from django.conf import settings
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    full_name = models.CharField(max_length=150, blank=True)
    phone = models.CharField(max_length=32, blank=True)
    birthday = models.DateField(null=True, blank=True)

    def __str__(self) -> str:  # type: ignore[override]
        return f"Profile({self.user.username})"
