import django.contrib
import django.core.asgi
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView,ListAPIView,RetrieveAPIView, UpdateAPIView, RetrieveUpdateDestroyAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import User,Task, TaskFile
from .serializers import UserSerializer,TaskSerializer, UserListSerializer,TaskFileSerializer



class UserCreateAPIView(CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self,request,*args,**kwargs):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            if User.objects.filter(email=serializer.validated_data['email']).count() > 0:
                return Response(
                    {'status': 'failure', 'message': "A user with that email already exists. Use a different email."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user = User.objects.create(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                profile_image=request.FILES.get("profile_image"),
            )
            user.set_password(serializer.validated_data['password'])
            user.save()
            return Response({'message':'User created successfully'},status=status.HTTP_200_OK)
        else :
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserRetrieveAPIView(RetrieveAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)



    # def post(self,request,*args,**kwargs):
    #     user =  User.objects.get(id, request.user.id)
    #     serializer = UserSerializer(user, context={'request': request})

    #     return Response(serializer.data, status=status.HTTP_200_OK)


class UserUpdateAPIView(UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self):
        return self.request.user

class ListUserAPIView(ListAPIView):
    permission_classes = [IsAuthenticated,]
    queryset = User.objects.all()
    serializer_class = UserListSerializer

class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token).blacklist()
            return Response({'success': 'User logged out successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': 'Invalid refresh token.'}, status=status.HTTP_400_BAD_REQUEST)


class TaskCreateAPIView(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        task = serializer.save(created_by=self.request.user)

        uploaded_files = self.request.FILES.getlist("task_files")
        if len(uploaded_files) > 3:
            return Response({"error": "You can upload a maximum of 3 files per task."}, status=status.HTTP_400_BAD_REQUEST)

        for file in uploaded_files:
            TaskFile.objects.create(task_id=task.id, file=file)  # Ensure task is correctly linked

        return Response(TaskSerializer(task).data, status=status.HTTP_201_CREATED)

        
class TaskListAPIView(ListAPIView):
    # permission_classes = [ IsAuthenticated, ]
    serializer_class = TaskSerializer
    queryset = Task.objects.all()

    def get_queryset(self):
        user = self.request.user
        key = self.kwargs.get('key')
        if key=="assigned":
            return Task.objects.filter(assigned_to=user)
        elif key == "created":
            return Task.objects.filter(created_by=user)

class TaskRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = TaskSerializer
    queryset = Task.objects.all()
    lookup_field = "id"
    parser_classes = [MultiPartParser, FormParser]

    def retrieve(self, request, *args, **kwargs):
        if request.user == self.get_object().created_by or request.user in self.get_object().assigned_to.all():
            return super().retrieve(request, *args, **kwargs)
        else:
            return Response({'message': 'Failure! Permission denied.'}, status=status.HTTP_400_BAD_REQUEST)

        
    def partial_update(self, request, *args, **kwargs):
        task = self.get_object()

        if request.user != task.created_by and request.user not in task.assigned_to.all():
            return Response({"message": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            uploaded_files = request.FILES.getlist("task_files")
            if len(uploaded_files) > 3:
                return Response({"error": "Max 3 files allowed per task."}, status=status.HTTP_400_BAD_REQUEST)

            for file in uploaded_files:
                TaskFile.objects.create(task_id=task.id, file=file)  # Ensure correct linkage

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def perform_destroy(self, instance):
        if self.request.user == self.get_object().created_by or self.request.user in self.get_object().assigned_to.all():
            return instance.delete()
        else:
            return Response({'message': 'Failure! Permission denied.'}, status=status.HTTP_400_BAD_REQUEST)
