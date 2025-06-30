from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt


urlpatterns = [
    path('', lambda request: redirect('/graphql/')),
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
   
    
]
