from rest_framework import serializers
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from . import models
import requests

class BlurbSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Blurb
        fields = ['id', 'title', 'source', 'link', 'image', 'created', 'consumer', 'favorited', 'hidden']

class BlurbCreateSerializer(serializers.Serializer):
    keyword = serializers.CharField(max_length=100, required=False, write_only=True)
    user = serializers.IntegerField(required=False, write_only=True)

    def create(self, validated_data):
        print(validated_data)
        r = requests.get("https://newsapi.org/v2/everything?q=" + validated_data.get('keyword').replace(' ', '%20') + "&apiKey=59718915a52e49e195790e93dd55c3d2")
        if r.json()["totalResults"] > 0:
            latest_article = None
            found = False
            for article in r.json()["articles"]:
                if not models.Blurb.objects.all().filter(link=article["url"]).exists():
                    latest_article = article
                    found = True
                    break
            if not found:
                return None
            blurb = models.Blurb()
            blurb.title = latest_article["title"]
            blurb.source = latest_article["source"]["name"]
            blurb.link = latest_article["url"]
            blurb.image = latest_article["urlToImage"]
            blurb.consumer = models.getUserFromId(validated_data.get('user'))
            blurb.favorited = False
            blurb.hidden = False
            blurb.save()
            return blurb
        else:
            return None

class BlurbEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Blurb
        fields = ['favorited', 'hidden']

    def update(self, instance, validated_data):
        instance.favorited = validated_data.get('favorited', instance.favorited)
        instance.hidden = validated_data.get('hidden', instance.hidden)
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
        fields = ['email', 'first_name', 'last_name', 'password']

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
