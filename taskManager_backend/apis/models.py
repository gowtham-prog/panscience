from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
# Create your models here.
import uuid
import os


def ten_digit_unique_id():
    return str(uuid.uuid4().int)[-1:-11:-1]

def profile_image_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"profile_{instance.username}_{uuid.uuid4().hex[:6]}.{ext}"
    return os.path.join("profile_images/", filename)

def task_file_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"task_{instance.id}_{uuid.uuid4().hex[:6]}.{ext}"
    return os.path.join("tasks/", filename)


class TenDigitPK(models.Model):
    id = models.CharField(
        max_length=10,
        primary_key=True,
        default=ten_digit_unique_id,
        editable=False,
    )
    created_on = models.DateTimeField(
        'Date and Time of creation',
        default=timezone.now,
    )

    class Meta:
        abstract = True
        ordering = ['-created_on']


class User(TenDigitPK, AbstractUser):
    profile_image = models.ImageField(
        upload_to=profile_image_upload_path,
        blank=True,
        null=True,
        help_text="Upload a profile image"
    )
    def __str__(self):
        return self.username


class Task(TenDigitPK):
    task_name = models.CharField(max_length=40, null=False, blank=False)
    task_description = models.TextField(null=False, blank=False)
    created_by = models.ForeignKey(
        User, related_name="created_tasks", on_delete=models.CASCADE, null=False, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, null=False, blank=False, default="pending", choices=(
        ("pending", "Pending"), ("in_progress", "In Progress"), ("on_hold", "On Hold"), ("cancelled", "Cancelled"),("completed", "Completed")))
    assigned_to = models.ManyToManyField(
        User, related_name="assigned_tasks", blank=True)
    priority = models.CharField(max_length=20, null=False, blank=False, default="low", choices=(
        ("low", "Low"), ("medium", "Medium"), ("high", "High")))
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.task_name} by {self.created_by} on {self.created_on}"

class TaskFile(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(upload_to="task_files/")
    uploaded_on = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"File: {self.file.name}"