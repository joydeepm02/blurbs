from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Blurb(models.Model):
    title = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    link = models.URLField()
    created = models.DateTimeField(auto_now_add=True)
    consumer = models.ForeignKey(User, on_delete=models.CASCADE)
    favorited = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title

class Keyword(models.Model):
    keyword = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.keyword

User._meta.get_field('email')._unique = True
Keyword._meta.get_field('keyword')._unique = True