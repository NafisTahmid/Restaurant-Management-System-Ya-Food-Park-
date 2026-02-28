from django.urls import path
from base.views import order_views as views

urlpatterns = [
    path("init", views.sslcommerz_init, name="init-sslcommerz"),
    path("add", views.addOrderItems, name="add-order"),
    path("success/", views.sslcommerz_success, name="ssl-success"),
    path("<str:pk>/", views.getOrderById, name="order-details"),
    path("deliver/<str:pk>", views.deliverOrder, name="order-deliver")
]