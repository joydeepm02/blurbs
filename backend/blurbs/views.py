from django.shortcuts import render
from rest_framework import generics, permissions, authentication
from django.contrib.auth.models import User

from . import models
from . import serializers
from . import permissions as custom_permissions

# Create your views here.

class BlurbListAPIView(generics.ListAPIView):
    def get_queryset(self):
        # If authenticated user is a superuser, return all Blurb objects
        if self.request.user.is_superuser:
            queryset = models.Blurb.objects.all()
            return queryset
        # If authenticated user is not a superuser, return only Blurbs for which they are the consumer
        else:
            queryset = models.Blurb.objects.filter(consumer=self.request.user)
            # Narrow results by checking if request includes favorited Blurbs
            favorited = self.request.query_params.get('favorited', None)
            if favorited:
                queryset = queryset.filter(favorited=favorited)
            return queryset

    serializer_class = serializers.BlurbSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)

class BlurbRetrieveAPIView(generics.RetrieveAPIView):
    def get_queryset(self):
        # If authenticated user is a superuser, return all Blurb objects
        if self.request.user.is_superuser:
            queryset = models.Blurb.objects.all()
            return queryset
        # If authenticated user is not a superuser, return only Blurbs for which they are the consumer
        else:
            queryset = models.Blurb.objects.filter(consumer=self.request.user)
            # Narrow results by checking if request includes favorited Blurbs
            favorited = self.request.query_params.get('favorited', None)
            if favorited:
                queryset = queryset.filter(favorited=favorited)
            return queryset

    serializer_class = serializers.BlurbSerializer
    permission_classes = (custom_permissions.IsBlurbConsumerOrSuperuser,permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)

class BlurbCreateAPIView(generics.CreateAPIView):
    serializer_class = serializers.BlurbSerializer
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)

class BlurbEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    def get_queryset(self):
        # If authenticated user is a superuser, return all Blurb objects
        if self.request.user.is_superuser:
            queryset = models.Blurb.objects.all()
            return queryset
        # If authenticated user is not a superuser, return only Blurbs for which they are the consumer
        else:
            queryset = models.Blurb.objects.filter(consumer=self.request.user)
            # Narrow results by checking if request includes favorited Blurbs
            favorited = self.request.query_params.get('favorited', None)
            if favorited:
                queryset = queryset.filter(favorited=favorited)
            return queryset

    serializer_class = serializers.BlurbEditSerializer
    permission_classes = (custom_permissions.IsBlurbConsumerOrSuperuser,permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)

class UserListAPIView(generics.ListAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (permissions.IsAdminUser,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = User.objects.all()

class UserRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (custom_permissions.IsUserOrSuperuser,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = User.objects.all()

class UserCreateAPIView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    permission_classes = (~permissions.IsAuthenticated,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = User.objects.all()

class UserEditAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.UserEditSerializer
    permission_classes = (custom_permissions.IsUserOrSuperuser,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = User.objects.all()

class UserResetAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = serializers.UserResetSerializer
    permission_classes = (custom_permissions.IsUserOrSuperuser,)
    authentication_classes = (authentication.TokenAuthentication,)
    queryset = User.objects.all()