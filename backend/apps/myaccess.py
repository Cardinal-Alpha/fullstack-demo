from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.urls import re_path

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from admin.serializer import PermissionSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myaccess(request):
    app = request.query_params.get('app')
    serial = None
    if request.user.is_superuser:
        serial = Permission.objects.all()
    else:
        serial = request.user.user_permissions.all()
    if app:
        ct = ContentType.objects.get(model=app)
        serial = serial.filter(content_type=ct)
    serial = PermissionSerializer(serial, many=True)
    return Response(serial.data)


urlpatterns = [
    re_path(r'myaccess\/?', myaccess)
]