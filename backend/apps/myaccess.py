
from django.urls import re_path

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myaccess(request):
    #Allow all access on super user
    if request.user.is_superuser:
        return Response({
            'status':'OK'
        })
    perms = request.user.user_permissions.all()
    #Using id list
    permApp = request.query_params.get('app')
    permLabel = request.query_params.get('perm')
    if permApp and permLabel:
        permLabel = permLabel.split(',')
        perms = []
        for pL in permLabel:
            perms.append("{}.{}".format(permApp, pL))
        if request.user.has_perms(perms):
            return Response({
                'status':'OK'
            })
        else:
            return Response({
                'status':'FORBIDDEN'
            }, status.HTTP_403_FORBIDDEN)
    if request.user.is_authenticated:
        return Response({
            'status': 'AUTHENTICATED'
        })
    else:
        return Response({
            'status': 'UNAUTHENTICATED'
        }, status.HTTP_403_FORBIDDEN)
        


urlpatterns = [
    re_path(r'myaccess\/?', myaccess)
]