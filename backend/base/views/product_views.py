from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.products import products
from rest_framework import status
from base.serializers import ProductSerializer
from base.models import Product


@api_view(['GET'])
def get_products(request):
    query = request.query_params.get("keyword","")
    print("query: ", query)
    if query == None:
        query = ""
    products = Product.objects.filter(name__icontains=query).order_by("pk")
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


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
    product.image = request.FILES.get("image")
    product.save()
    return Response({"detail":"Image has been uploaded!"}, status=status.HTTP_200_OK)


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