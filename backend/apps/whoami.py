
from django.urls import re_path

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from admin.serializer import UserDownSerializer



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def whoami(request):
    ret = UserDownSerializer(request.user)
    return Response(ret.data)
        


urlpatterns = [
    re_path(r'whoami\/?', whoami)
]