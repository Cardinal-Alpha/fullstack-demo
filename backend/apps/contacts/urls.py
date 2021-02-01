from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter(trailing_slash=False)

router.register(r'contact', views.ContactViewset)

urlpatterns = router.urls