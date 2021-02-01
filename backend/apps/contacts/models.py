from django.db import models

# Create your models here.
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.db.models import signals
from django.db.models.query_utils import select_related_descend
from django.dispatch import receiver
import re

profile_storage = FileSystemStorage(location=str(settings.STATIC_ROOT/'profile_pict'), base_url=settings.STATIC_URL + 'profile_pict')

class Contact(models.Model):
    picture = models.ImageField(storage=profile_storage, default='default.png')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50, default='', blank=True)
    birthdate = models.DateField()
    email = models.EmailField()
    phone_number = models.CharField(max_length=30)


#Delete real file after deleting object from database only if the image isn't default
@receiver(models.signals.post_delete, sender=Contact)
def pictureDelete(instance, *args, **kwargs):
    if not re.search(r'default\.png$', instance.picture.name):
        instance.picture.delete(save=False)


#Delete file after not used because update
@receiver(models.signals.pre_save, sender=Contact)
def deleteOld(instance, *args, **kwargs):
    if instance.id:
        old = Contact.objects.get(id=instance.id)
        if instance.picture.name != old.picture.name:
            old.picture.delete(save=False)