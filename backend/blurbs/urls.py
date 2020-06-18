from django.urls import path, include
from rest_framework import routers

from . import views

urlpatterns = [
    path('blurbs/view/', views.BlurbListAPIView.as_view()),
    path('blurbs/view/<pk>', views.BlurbRetrieveAPIView.as_view()),
    path('blurbs/edit/<pk>', views.BlurbEditAPIView.as_view()),
    path('blurbs/create/', views.BlurbCreateAPIView.as_view()),
    path('users/view/', views.UserListAPIView.as_view()),
    path('users/view/<pk>', views.UserRetrieveAPIView.as_view()),
    path('users/edit/<pk>', views.UserEditAPIView.as_view()),
    path('users/reset/<pk>', views.UserResetAPIView.as_view()),
    path('users/create/', views.UserCreateAPIView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]