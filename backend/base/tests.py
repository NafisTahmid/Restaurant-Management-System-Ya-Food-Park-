from django.test import TestCase

# Create your tests here.
from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from base.models import Product


class ProductImageUploadTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="image-admin",
            password="test-password",
            is_staff=True,
        )
        self.product = Product.objects.create(name="Test product")
        self.client = APIClient()
        self.client.force_authenticate(user=self.admin)

    @override_settings(
        CLOUDINARY_CLOUD_NAME="test-cloud",
        CLOUDINARY_API_KEY="test-key",
        CLOUDINARY_API_SECRET="test-secret",
    )
    @patch("base.views.product_views.uploader.upload")
    def test_upload_saves_and_returns_secure_cloudinary_url(self, upload):
        image_url = "https://res.cloudinary.com/test-cloud/image/upload/product.png"
        upload.return_value = {"secure_url": image_url}
        image = SimpleUploadedFile(
            "dish.png",
            b"test image",
            content_type="image/png",
        )

        response = self.client.put(
            "/api/products/upload/",
            {"_id": self.product.pk, "image": image},
            format="multipart",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["image"], image_url)
        self.product.refresh_from_db()
        self.assertEqual(self.product.image, image_url)

        product_response = self.client.get(f"/api/products/{self.product.pk}/")
        self.assertEqual(product_response.data["image"], image_url)

    def test_upload_without_file_returns_client_error(self):
        response = self.client.put(
            "/api/products/upload/",
            {"_id": self.product.pk},
            format="multipart",
        )

        self.assertEqual(response.status_code, 400)
