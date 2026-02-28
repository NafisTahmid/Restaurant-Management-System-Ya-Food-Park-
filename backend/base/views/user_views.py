from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from base.serializers import UserSerializerWithToken, UserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.hashers import make_password
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data

        for key, value in serializer.items():
            data[key] = value
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(["POST"])
def register_user(request):
    data = request.data

    try:
        new_user = User.objects.create(
            first_name=data["name"],
            email=data["email"],
            password= make_password(data["password"])
        )
        serializer = UserSerializerWithToken(new_user, many=False)
        return Response(serializer.data)
    except:
        return Response({"detail":"User already exists!"}, status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(["GET"])
def getUserDetails(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

@permission_classes([IsAuthenticated])
@api_view(["PUT"])
def updateProfile(request):
    user = request.user
    data = request.data

    user.first_name = data["name"]
    user.username = data["email"]
    user.email = data["email"]

    password = data.get("password", "")
    if password and password.strip():
        user.password = make_password(data["password"])
    user.save()
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def getUserById(request, pk):
    logged_in_user = request.user
    if logged_in_user.is_staff:
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    else:
        return Response({"detail":"You're not authorized!"},status=status.HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def updateUserById(request, pk):
    data = request.data
    user = User.objects.get(id=pk)

    user.first_name = data.get("name","")
    user.username = data.get("email","")
    user.email = data.get("email","")
    user.is_staff = data.get("isAdmin",False)
    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def deleteUserById(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response({"detail":"User has been deleted!"},status=status.HTTP_200_OK)