# Generated by Django 5.2.3 on 2025-06-24 13:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_rename_utilisateur_commande_vendeur_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='produit',
            name='prix',
            field=models.IntegerField(),
        ),
    ]
