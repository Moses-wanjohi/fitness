from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    if User.objects.filter(username=username).exists():
        return Response({'username': ['A user with that username already exists.']}, status=status.HTTP_400_BAD_REQUEST)
        
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)