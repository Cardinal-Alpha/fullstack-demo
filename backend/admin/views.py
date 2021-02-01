
# Create your views here.

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from .serializer import UserUpSerializer, UserDownSerializer, PermissionSerializer
from library.permissions import PatchedModelPermissions

@api_view(['POST'])
def userlogin(request):
    try:
        username = request.data['username']
        password = request.data['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return Response({'status':'SUCCESS'})
        else:
            return Response({'status':'FAILED'})
    except:
        return Response({'status':'ERROR'}, status=500)


@api_view(['GET'])
def userlogout(request):
    logout(request)
    return Response({'status':'GOODBYE'})



class UserManagementViewset(ModelViewSet):

    queryset = User.objects.order_by('username').all()
    permission_classes = [PatchedModelPermissions]

    def get_serializer_class(self):
        if self.request.method in ['POST', 'UPDATE']:
            return UserUpSerializer
        else:
            return UserDownSerializer


class PermissionViewset(GenericViewSet, ListModelMixin, RetrieveModelMixin):
    queryset = Permission.objects.all()
    permission_classes = [PatchedModelPermissions]
    serializer_class = PermissionSerializer

    def get_queryset(self):
        app = self.request.query_params.get('app', None)
        if app:
            ct = ContentType.objects.get(model=app)
            return Permission.objects.filter(content_type=ct).order_by('id')
        else:
            return super().get_queryset().order_by('id')
