from django.urls import path
from base.views import user_views as views
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)

urlpatterns = [
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("register/", views.register_user, name="register-user"),
    path("profile/", views.getUserDetails, name="user-details"),
    path("profile/update/", views.updateProfile, name="update-profile"),
    path("", views.getUsers, name="get-users"),
    path("<str:pk>/", views.getUserById, name="get-user-by-id"),
    path("<str:pk>/update/",views.updateUserById, name="update-user-by-id"),
    path("<str:pk>/delete/", views.deleteUserById, name="delete-user-by-id")
]