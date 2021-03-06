from .contacts import urls as contacts_url
from . import myaccess, whoami

urlpatterns = contacts_url.urlpatterns
urlpatterns += myaccess.urlpatterns
urlpatterns += whoami.urlpatterns