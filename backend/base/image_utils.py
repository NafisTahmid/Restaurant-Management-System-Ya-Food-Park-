from django.conf import settings


def get_image_url(image, request=None):
    if not image:
        return ""

    image_url = str(image)
    if image_url.startswith(("http://", "https://")):
        return image_url

    media_url = settings.MEDIA_URL.rstrip("/")
    if not image_url.startswith(f"{media_url}/"):
        image_url = f"{media_url}/{image_url.lstrip('/')}"

    if request is not None:
        return request.build_absolute_uri(image_url)
    return image_url
