import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from graphql_jwt.decorators import login_required
from django.db.models import Sum
from django.db.models.functions import TruncMonth
from django.shortcuts import get_object_or_404
import calendar

from .models import Utilisateur, Produit, Commande, LigneCommande, Client


class UtilisateurType(DjangoObjectType):
    class Meta:
        model = Utilisateur
        fields = ("id", "username", "email", "role")

    role = graphene.String()


class ProduitType(DjangoObjectType):
    class Meta:
        model = Produit
        fields = ("id", "nom", "prix", "stock", "vendeur")


class LigneCommandeType(DjangoObjectType):
    class Meta:
        model = LigneCommande
        fields = ("id", "produit", "quantite")


class CommandeType(DjangoObjectType):
    lignes = graphene.List(LigneCommandeType)

    class Meta:
        model = Commande
        fields = ("id", "date", "vendeur", "total", "lignes")

    def resolve_lignes(self, info):
        return self.lignes.all()


class ClientType(DjangoObjectType):
    class Meta:
        model = Client
        fields = ("id", "nom", "email", "telephone", "adresse")


# ===========================
# TYPES PERSONNALISÉS POUR STATS
# ===========================

class TopProduitStat(graphene.ObjectType):
    nom = graphene.String()
    quantite = graphene.Int()

class ProduitVenteParMois(graphene.ObjectType):
    produit = graphene.String()
    mois = graphene.String()
    quantite = graphene.Int()

class DashboardStats(graphene.ObjectType):
    total_commandes = graphene.Int()
    total_ventes = graphene.Float()
    total_clients = graphene.Int()
    top_produits = graphene.List(TopProduitStat)
    produit_le_plus_vendu = graphene.String()
    derniere_commande = graphene.String()



class RegisterUser(graphene.Mutation):
    utilisateur = graphene.Field(UtilisateurType)

    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)
        email = graphene.String()
        role = graphene.String(required=True)

    def mutate(self, info, username, password, email=None, role="vendeur"):
        if role not in ['admin', 'vendeur']:
            raise Exception("Rôle invalide.")
        utilisateur = Utilisateur(username=username, email=email, role=role)
        utilisateur.set_password(password)
        utilisateur.save()
        return RegisterUser(utilisateur=utilisateur)


class ChangePassword(graphene.Mutation):
    success = graphene.Boolean()

    class Arguments:
        old_password = graphene.String(required=True)
        new_password = graphene.String(required=True)

    @login_required
    def mutate(self, info, old_password, new_password):
        user = info.context.user
        if not user.check_password(old_password):
            raise Exception("Ancien mot de passe incorrect.")
        user.set_password(new_password)
        user.save()
        return ChangePassword(success=True)


class CreateProduit(graphene.Mutation):
    produit = graphene.Field(ProduitType)

    class Arguments:
        nom = graphene.String(required=True)
        prix = graphene.Float(required=True)
        stock = graphene.Int(required=True)
        vendeur_id = graphene.Int(required=True)

    def mutate(self, info, nom, prix, stock, vendeur_id):
        vendeur = get_object_or_404(Utilisateur, id=vendeur_id)
        produit = Produit.objects.create(nom=nom, prix=prix, stock=stock, vendeur=vendeur)
        return CreateProduit(produit=produit)


class UpdateProduit(graphene.Mutation):
    produit = graphene.Field(ProduitType)

    class Arguments:
        id = graphene.ID(required=True)
        nom = graphene.String()
        prix = graphene.Float()
        stock = graphene.Int()

    def mutate(self, info, id, nom=None, prix=None, stock=None):
        produit = get_object_or_404(Produit, id=id)
        if nom is not None:
            produit.nom = nom
        if prix is not None:
            produit.prix = prix
        if stock is not None:
            produit.stock = stock
        produit.save()
        return UpdateProduit(produit=produit)


class DeleteProduit(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        produit = get_object_or_404(Produit, id=id)
        produit.delete()
        return DeleteProduit(ok=True)


class LigneCommandeInput(graphene.InputObjectType):
    produit_id = graphene.ID(required=True)
    quantite = graphene.Int(required=True)


class CreateCommande(graphene.Mutation):
    commande = graphene.Field(CommandeType)

    class Arguments:
        vendeur_id = graphene.ID(required=True)
        lignes = graphene.List(LigneCommandeInput, required=True)

    def mutate(self, info, vendeur_id, lignes):
        vendeur = get_object_or_404(Utilisateur, id=vendeur_id)
        commande = Commande.objects.create(vendeur=vendeur, total=0)

        total = 0
        for ligne_input in lignes:
            produit = get_object_or_404(Produit, id=ligne_input.produit_id)
            quantite = ligne_input.quantite
            LigneCommande.objects.create(
                commande=commande,
                produit=produit,
                quantite=quantite
            )
            total += produit.prix * quantite

        commande.total = total
        commande.save()
        return CreateCommande(commande=commande)


class CreateClient(graphene.Mutation):
    client = graphene.Field(ClientType)

    class Arguments:
        nom = graphene.String(required=True)
        email = graphene.String(required=True)
        telephone = graphene.String()
        adresse = graphene.String()

    def mutate(self, info, nom, email, telephone=None, adresse=None):
        client = Client.objects.create(
            nom=nom,
            email=email,
            telephone=telephone or "",
            adresse=adresse or ""
        )
        return CreateClient(client=client)


class UpdateClient(graphene.Mutation):
    client = graphene.Field(ClientType)

    class Arguments:
        id = graphene.ID(required=True)
        nom = graphene.String()
        email = graphene.String()
        telephone = graphene.String()
        adresse = graphene.String()

    def mutate(self, info, id, nom=None, email=None, telephone=None, adresse=None):
        client = get_object_or_404(Client, id=id)
        if nom is not None:
            client.nom = nom
        if email is not None:
            client.email = email
        if telephone is not None:
            client.telephone = telephone
        if adresse is not None:
            client.adresse = adresse
        client.save()
        return UpdateClient(client=client)


class DeleteClient(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        id = graphene.ID(required=True)

    def mutate(self, info, id):
        client = get_object_or_404(Client, id=id)
        client.delete()
        return DeleteClient(ok=True)



class Query(graphene.ObjectType):
    all_produits = graphene.List(ProduitType)
    all_utilisateurs = graphene.List(UtilisateurType)
    all_commandes = graphene.List(CommandeType)
    all_clients = graphene.List(ClientType)
    dashboard_stats = graphene.Field(DashboardStats)
    produits_vendus_par_mois = graphene.List(ProduitVenteParMois)

    def resolve_all_produits(self, info):
        return Produit.objects.select_related("vendeur").all()

    def resolve_all_utilisateurs(self, info):
        return Utilisateur.objects.all()

    def resolve_all_commandes(self, info):
        return Commande.objects.select_related("vendeur").prefetch_related("lignes").all()

    def resolve_all_clients(self, info):
        return Client.objects.all()

    def resolve_dashboard_stats(self, info):
        commandes = Commande.objects.all()
        total_commandes = commandes.count()
        total_ventes = sum(c.total for c in commandes)
        total_clients = Client.objects.count()

        produits_count = {}
        derniere_date = None

        for commande in commandes:
            if derniere_date is None or commande.date > derniere_date:
                derniere_date = commande.date

            for ligne in commande.lignes.all():
                nom = ligne.produit.nom
                produits_count[nom] = produits_count.get(nom, 0) + ligne.quantite

        top_items = sorted(produits_count.items(), key=lambda x: x[1], reverse=True)
        top_produits = [
            TopProduitStat(nom=nom, quantite=qt) for nom, qt in top_items[:5]
        ]

        produit_le_plus_vendu = top_items[0][0] if top_items else None

        return DashboardStats(
            total_commandes=total_commandes,
            total_ventes=total_ventes,
            total_clients=total_clients,
            top_produits=top_produits,
            produit_le_plus_vendu=produit_le_plus_vendu,
            derniere_commande=derniere_date.isoformat() if derniere_date else None
        )

    def resolve_produits_vendus_par_mois(self, info):
        ventes = (
            LigneCommande.objects
            .annotate(mois=TruncMonth('commande__date'))
            .values('produit__nom', 'mois')
            .annotate(quantite=Sum('quantite'))
            .order_by('mois')
        )

        result = []
        for v in ventes:
            nom_produit = v['produit__nom']
            mois = v['mois']
            nom_mois = calendar.month_name[mois.month]
            result.append(ProduitVenteParMois(
                produit=nom_produit,
                mois=nom_mois,
                quantite=v['quantite']
            ))

        return result


class Mutation(graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()

    register_user = RegisterUser.Field()
    change_password = ChangePassword.Field()
    create_produit = CreateProduit.Field()
    update_produit = UpdateProduit.Field()
    delete_produit = DeleteProduit.Field()
    create_commande = CreateCommande.Field()
    create_client = CreateClient.Field()
    update_client = UpdateClient.Field()
    delete_client = DeleteClient.Field()



schema = graphene.Schema(query=Query, mutation=Mutation)
