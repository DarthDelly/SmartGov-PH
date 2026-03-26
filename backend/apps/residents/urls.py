from django.urls import path

from .views import ResidentListCreateView, ResidentRetrieveUpdateView

urlpatterns = [
    path("", ResidentListCreateView.as_view(), name="resident-list"),
    path("<int:pk>/", ResidentRetrieveUpdateView.as_view(), name="resident-detail"),
]
