from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("base", "0002_alter_product_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="image",
            field=models.TextField(
                blank=True,
                default="/placeholder.jpg",
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="orderitem",
            name="image",
            field=models.TextField(blank=True, null=True),
        ),
    ]
