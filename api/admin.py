from django.contrib import admin

from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "full_name", "phone", "birthday")
    search_fields = ("user__username", "full_name", "phone")
    list_select_related = ("user",)
