from django.shortcuts import render

# Create your views here.

from rest_framework.viewsets import ModelViewSet
from library.permissions import PatchedModelPermissions
from django.db.models import Q
from .serializer import ContactSerializer
from .models import Contact

class ContactViewset(ModelViewSet):
    queryset = Contact.objects.order_by('first_name').all()
    serializer_class = ContactSerializer
    permission_classes = [PatchedModelPermissions]

    def get_queryset(self):
        search = self.request.query_params.get('search')
        if search:
            query = Q(first_name__icontains=search)
            query |= Q(last_name__icontains=search)
            query |= Q(phone_number__icontains=search)
            query |= Q(email__icontains=search)
            return self.queryset.filter(query)
        return super().get_queryset()