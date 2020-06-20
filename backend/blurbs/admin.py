from django.contrib import admin

from . import models

# Register your models here.

admin.site.register(models.Blurb)
admin.site.register(models.Keyword)