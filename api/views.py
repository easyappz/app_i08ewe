from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from drf_spectacular.utils import extend_schema

from .serializers import MessageSerializer, RegisterSerializer, MeSerializer
from .models import Profile


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: MeSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # Ensure profile exists (created in serializer, but keep defensive)
        Profile.objects.get_or_create(user=user)
        me = MeSerializer(user, context={"request": request})
        return Response(me.data, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(responses={200: MeSerializer})
    def get(self, request):
        # Ensure a Profile exists for the authenticated user
        Profile.objects.get_or_create(user=request.user)
        data = MeSerializer(request.user, context={"request": request}).data
        return Response(data, status=status.HTTP_200_OK)
