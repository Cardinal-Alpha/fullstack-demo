from django.urls import re_path
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter(trailing_slash=False)

router.register('user', views.UserManagementViewset)
router.register('permission', views.PermissionViewset)

urlpatterns = [
    re_path(r'login/?', views.userlogin),
    re_path(r'logout/?', views.userlogout)
] + router.urls