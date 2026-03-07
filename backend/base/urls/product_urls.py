from django.urls import path
from base.views import product_views as views

urlpatterns = [
    path("", views.get_products, name="get-products"),
    path("upload/", views.uploadProductImage, name="upload-product-image"),
    path("create/",views.createProduct, name="create-product"),
    path("<str:pk>/create-review/",views.addReview, name="add-review"),
    path("<str:pk>/", views.get_product, name="get-product"),
    path("<str:pk>/update/", views.updateProduct, name="update-product"),
    path("<str:pk>/delete", views.deleteProduct, name="delete-product")
]