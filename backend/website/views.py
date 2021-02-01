from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.views.static import serve
from django.conf import settings


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authorized_serve(request, path, document_root=None):
    return serve(request, path, document_root=str(settings.BASE_DIR / 'files'))