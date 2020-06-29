from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from . import models

class BlurbSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Blurb
        fields = ['id', 'title', 'source', 'link', 'image', 'created', 'consumer', 'favorited']

class BlurbEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Blurb
        fields = ['favorited']

    def update(self, instance, validated_data):
        instance.favorited = validated_data.get('favorited', instance.favorited)
        instance.save()
        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'password' : {
                'required' : True,
                'write_only' : True
            }
        }

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data['password']) # Password must be set with set_password()
        user.save()
        Token.objects.create(user=user)
        return user

class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name']

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.save()
        return instance

class UserResetSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['password']

    def update(self, instance, validated_data):
        instance.set_password(validated_data['password'])
        instance.save()
        return instance

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Keyword
        fields = ['id', 'keyword', 'user']
