from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Blurb(models.Model):
    title = models.CharField(max_length=250)
    source = models.CharField(max_length=250)
    link = models.URLField(max_length=750)
    image = models.URLField(max_length=750)
    created = models.DateTimeField(auto_now_add=True)
    consumer = models.ForeignKey(User, on_delete=models.CASCADE)
    favorited = models.BooleanField(default=False)
    hidden = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return self.title

class Keyword(models.Model):
    keyword = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.keyword

def getUserFromId(id):
    return User.objects.all().get(id=id)

User._meta.get_field('email')._unique = True
