from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import Profile


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email")
        read_only_fields = ("id",)


class ProfileSerializer(serializers.ModelSerializer):
    birthday = serializers.DateField(
        required=False,
        allow_null=True,
        input_formats=["%Y-%m-%d"],
        format="%Y-%m-%d",
    )

    class Meta:
        model = Profile
        fields = ("full_name", "phone", "birthday")


class MeSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "email", "profile")
        read_only_fields = ("id", "username", "email", "profile")


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    birthday = serializers.DateField(
        required=False,
        allow_null=True,
        input_formats=["%Y-%m-%d"],
        format="%Y-%m-%d",
    )

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username must be unique.")
        return value

    def validate_email(self, value: str) -> str:
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email must be unique.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        password = validated_data.pop("password")
        full_name = validated_data.pop("full_name", "")
        phone = validated_data.pop("phone", "")
        birthday = validated_data.pop("birthday", None)

        user = User(**validated_data)
        user.set_password(password)
        user.save()

        Profile.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            birthday=birthday,
        )
        return user

    def to_representation(self, instance):
        return MeSerializer(instance, context=self.context).data
