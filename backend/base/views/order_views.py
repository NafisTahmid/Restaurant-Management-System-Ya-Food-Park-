from rest_framework.response import Response
from rest_framework.decorators import api_view
from base.products import products
from rest_framework import status
from base.serializers import ProductSerializer, OrderSerializer
from base.models import Product, Order, OrderItem, ShippingAddress
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
import uuid
import requests
from django.conf import settings
from datetime import datetime
from django.shortcuts import redirect



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orderItems = data["orderItems"]
    if not orderItems or len(orderItems) == 0:
        return Response({"detail":"You've no orders!"},status=status.HTTP_400_BAD_REQUEST)
    # 1. Create an order
    order = Order.objects.create(
        user=user,
        paymentMethod=data["paymentMethod"],
        taxPrice = data["taxPrice"],
        totalPrice = data["totalPrice"],
        shippingPrice = data["shippingPrice"]
    )
    # 2. Create a shipping address
    shippingAddress = ShippingAddress.objects.create(
        order=order,
        address=data["shippingAddress"]["address"],
        city=data["shippingAddress"]["city"],
        postalCode = data["shippingAddress"]["postalCode"],
        country=data["shippingAddress"]["country"]
    )
    # 3. Create an order item object for each order-item
    for i in orderItems:
        product = Product.objects.get(_id=i["_id"])
        orderItem = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty = i["qty"],
            price = i["price"],
            image = product.image.url
        )
    # 4. Update product count in stock accordingly
        product.countInStock -= orderItem.qty
        product.save()
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    try:
        user = request.user
        order = Order.objects.get(_id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({"details":"You're not allowed to view this data"}, status=status.HTTP_400_BAD_REQUEST)
    except:
        return Response({"details":"Order not found!"},status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sslcommerz_init(request):
    user = request.user
    data = request.data

    transaction_id = data["pk"]

    payload = {
        "store_id": settings.SSLCOMMERZ_STORE_ID,
        "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
        "total_amount": data["total_price"],
        "currency": "BDT",
        "tran_id": transaction_id,
        "success_url": f"{settings.BACKEND_URL}/api/orders/success/",
        "fail_url": f"{settings.BACKEND_URL}/api/orders/success/",
        "cancel_url":f"{settings.BACKEND_URL}/api/orders/success/",
        "cus_name": user.username,
        "cus_email": user.email,
        "cus_add1": data["shippingAddress"]["address"],
        "cus_city": data["shippingAddress"]["city"],
        "cus_country": data["shippingAddress"]["country"],
        "cus_phone": "01700000000",
        "shipping_method": "NO",
        "product_name": "Order Payment",
        "product_category": "Ecommerce",
        "product_profile": "general",
    }

    response = requests.post(settings.SSLCOMMERZ_BASE_URL, data=payload)
    result = response.json()
   

    if result.get("status") == "SUCCESS":
        return Response({"payment_url": result["GatewayPageURL"]})

    return Response(result, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def sslcommerz_success(request):
    data = request.data
    tran_id = data.get("tran_id")

    # 1️⃣ Verify transaction
    verify_url = (
        "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
        if settings.SSLCOMMERZ_IS_SANDBOX
        else "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    )

    params = {
        "val_id": data.get("val_id"),
        "store_id": settings.SSLCOMMERZ_STORE_ID,
        "store_passwd": settings.SSLCOMMERZ_STORE_PASSWORD,
        "format": "json",
    }

    verify_response = requests.get(verify_url, params=params)
    verify_data = verify_response.json()

    if verify_data["status"] == "VALID":
        # mark order as paid
        order = Order.objects.get(_id=tran_id)
        order.isPaid = True
        order.paidAt = datetime.now()
        order.save()
        return redirect(f"{settings.FRONTEND_URL}/order/{order._id}")

    return Response({"message": "Payment verification failed"}, status=400)


@permission_classes([IsAdminUser])
@api_view(["PUT"])
def deliverOrder(request, pk):
    order = Order.objects.get(_id=pk)
    order.isDelivered = True
    order.deliverAt = datetime.now()
    order.save()
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)
        
    