from rest_framework.serializers import ModelSerializer, StringRelatedField
from django.contrib.auth.models import User, Permission
from django.contrib.auth.hashers import make_password

class UserUpSerializer(ModelSerializer):

    def create(self, validated_data):
        """
        Intercept validated data and hash the password before creating new object
        """
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    class Meta:
        model = User
        fields = '__all__'



class UserDownSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']



class PermissionSerializer(ModelSerializer):
    content_type = StringRelatedField()
    class Meta:
        model = Permission
        fields = '__all__'
