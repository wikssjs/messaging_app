# Utiliser l'image node:14 comme image de base
FROM node:14

# Copier le contenu du dossier de l'application dans le conteneur
COPY . /app

# Définir le répertoire de travail à /app
WORKDIR /app

# Installer les dépendances de l'application
RUN npm install

# Exposer le port 3000 pour l'application
EXPOSE 3000

# Lancer l'application
CMD ["npm", "start"]
