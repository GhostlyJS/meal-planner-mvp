# MealPlanner MVP

Application de gestion de repas et de liste de courses avec génération assistée par IA.

## Fonctionnalités

- Création et connexion de compte utilisateur
- Gestion des recettes (création, modification, suppression)
- Génération intelligente de listes de courses à partir de recettes sélectionnées
- Organisation des ingrédients par catégorie pour faciliter les courses

## Architecture

L'application est construite avec une architecture de microservices:

- **Client** : Application frontend React
- **API Gateway** : Point d'entrée pour les requêtes client
- **Auth Service** : Gestion de l'authentification des utilisateurs
- **Recipe Service** : Gestion des recettes
- **AI Service** : Génération de listes de courses optimisées avec OpenAI

## Prérequis

- Docker et Docker Compose
- Node.js 18+ (pour le développement)
- Une clé API OpenAI

## Installation et démarrage

1. Clonez le dépôt
```bash
git clone https://github.com/username/meal-planner-mvp.git
cd meal-planner-mvp

# Créez un fichier .env à la racine du projet
cp .env.example .env
# Modifiez le fichier .env avec vos propres valeurs, notamment la clé API OpenAI

docker-compose up -d

http://localhost:3000