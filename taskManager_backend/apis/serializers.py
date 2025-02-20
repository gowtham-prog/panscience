from rest_framework import serializers
from rest_framework.generics import CreateAPIView

from .models import Task, User,TaskFile


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = User
        fields = ('id','username', 'first_name', 'last_name', 'email', 'password','profile_image') 
    
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

# Task File Serializer
class TaskFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = TaskFile
        fields = ("id", "file", "uploaded_on")

class TaskSerializer(serializers.ModelSerializer):
    task_files = TaskFileSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['created_by'] = UserSerializer(instance.created_by, many=False, allow_null=True, required=False).data
        data['assigned_to'] = UserSerializer(instance.assigned_to, many=True, allow_null=True, required=False).data
        data["task_files"] = TaskFileSerializer(instance.task_files, many=True).data
        return data

