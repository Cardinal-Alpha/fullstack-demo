from .contacts import urls as contacts_url
from . import myaccess

urlpatterns = contacts_url.urlpatterns
urlpatterns += myaccess.urlpatterns