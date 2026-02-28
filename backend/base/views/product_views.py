from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from base.products import products
from rest_framework import status
from base.serializers import ProductSerializer
from base.models import Product


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
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
    product = Product.objects.get(id=data["id"])
    product.image = request.FILES.get("image")
    product.save()
    return Response({"detail":"Image has been uploaded!"}, status=status.HTTP_200_OK)