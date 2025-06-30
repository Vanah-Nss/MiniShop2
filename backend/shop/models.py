from django.db import models
from django.contrib.auth.models import AbstractUser

class Utilisateur(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Administrateur'),
        ('vendeur', 'Commercant'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    def __str__(self):
        return self.username


class Produit(models.Model):
    nom = models.CharField(max_length=100)
    prix = models.FloatField()
    stock = models.PositiveIntegerField()
    vendeur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)

    def __str__(self):
        return self.nom


class Commande(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    vendeur = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    total = models.FloatField()

    def __str__(self):
        return f"Commande #{self.id} - {self.date.strftime('%Y-%m-%d')}"


class LigneCommande(models.Model):
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='lignes')
    produit = models.ForeignKey(Produit, on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantite} x {self.produit.nom}"


class Client(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=20)
    adresse = models.TextField()

    def __str__(self):
        return self.nom
