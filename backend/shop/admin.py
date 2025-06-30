from django.contrib import admin
from .models import Utilisateur, Produit, Commande, LigneCommande

admin.site.register(Utilisateur)
admin.site.register(Produit)
admin.site.register(Commande)
admin.site.register(LigneCommande)
