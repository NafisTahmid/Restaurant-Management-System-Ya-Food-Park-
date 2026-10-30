import logging

from cloudinary import uploader
from cloudinary.exceptions import Error as CloudinaryError
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.products import products
from rest_framework import status
from base.serializers import ProductSerializer
from base.models import Product, Review
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage

logger = logging.getLogger(__name__)


@api_view(['GET'])
def get_products(request):
    query = request.query_params.get("keyword","")
    page = request.query_params.get("page")
    if query == None:
        query = ""
    if page == None:
        page = 1
    page = int(page)
    products = Product.objects.filter(name__icontains=query).order_by("pk")
    paginator = Paginator(products, 4)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)
    

    serializer = ProductSerializer(products, many=True)
    return Response({"products":serializer.data, "page":page, "pages":paginator.num_pages})


@api_view(["GET"])
def get_product(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def uploadProductImage(request):
    data = request.data
    product = Product.objects.get(_id=data["_id"])
    image = request.FILES.get("image")
    if image is None:
        return Response(
            {"detail": "Select an image to upload."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not all(
        (
            settings.CLOUDINARY_CLOUD_NAME,
            settings.CLOUDINARY_API_KEY,
            settings.CLOUDINARY_API_SECRET,
        )
    ):
        return Response(
            {"detail": "Cloudinary is not configured on the server."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    try:
        uploaded_image = uploader.upload(
            image,
            folder="yaya-food-park/products",
            resource_type="image",
        )
    except CloudinaryError:
        logger.exception("Cloudinary product image upload failed.")
        return Response(
            {"detail": "Image upload to Cloudinary failed."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    image_url = uploaded_image.get("secure_url")
    if not image_url:
        logger.error("Cloudinary product image upload returned no secure URL.")
        return Response(
            {"detail": "Cloudinary did not return an image URL."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    product.image = image_url
    product.save()
    return Response(
        {"detail": "Image has been uploaded!", "image": image_url},
        status=status.HTTP_200_OK,
    )


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    user = request.user

    product = Product.objects.get(_id=pk)

    product.name = data["name"]
    product.description = data["description"]
    product.brand = data["brand"]
    product.category = data["category"]
    product.price = data["price"]
    product.countInStock = data["countInStock"]
    product.user = user
    product.save()

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createProduct(request):
    user = request.user

    product = Product.objects.create(
        user=user,
        name="Sample name",
        description="Sample description",
        brand="Sample brand",
        category="Sample category",
        price = 0.00,
        countInStock=0
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response({"detail":"Product deleted!"}, status=status.HTTP_200_OK)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addReview(request, pk):
    data = request.data
    user = request.user
    product = Product.objects.get(_id=pk)

    # 1. Check if user already has submitted a review
    existingReview = product.review_set.filter(user=user).exists()
    if existingReview:
        return Response({"detail":"You can't post more than one review"}, status=status.HTTP_400_BAD_REQUEST)
    
    # 2. Check if rating exists
    if data["rating"] == 0 or data["review"] == "":
        return Response({"detail":"Both rating and review must be present to submit a review"}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Create a review
    review = Review.objects.create(
        product=product,
        user=user,
        name=user.first_name,
        rating = data["rating"],
        comment = data["review"]
    )

    # 4. Update product total rating and review
    reviews = product.review_set.all()
    total_reviews = len(reviews)
    total_rating = 0

    for i in reviews:
        total_rating += i.rating
    product_rating = total_rating/total_reviews
    product.rating = product_rating
    product.save()
    return Response("Review added")


@api_view(["GET"])
def getTopProducts(request):
    products = Product.objects.filter(rating__gte=4).order_by("-rating")[0:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)