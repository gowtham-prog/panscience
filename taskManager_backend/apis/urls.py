from django.urls import path

from .views import UserCreateAPIView,UserUpdateAPIView,UserRetrieveAPIView,ListUserAPIView, LogoutView, TaskCreateAPIView,TaskListAPIView, TaskRetrieveUpdateDestroyAPIView
urlpatterns = [
    path("user/create/", UserCreateAPIView.as_view(), name="user_create"),
    path("user/update/", UserUpdateAPIView.as_view(), name="user_update"),
    path("user/get/", UserRetrieveAPIView.as_view(), name="user_retrieve"),
    path("user/list", ListUserAPIView.as_view(), name="user_list"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("task",TaskCreateAPIView.as_view(), name="task"),
    path("task/<str:key>/", TaskListAPIView.as_view(), name="task_list"),
    path("task_detail/<str:id>/", TaskRetrieveUpdateDestroyAPIView.as_view(), name="task_detail"),
]