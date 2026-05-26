FROM node:22-alpine

# Métadonnées
LABEL maintainer="Didier - Formation L3"
LABEL description="Environnement Angular - Gestionnaire de Tâches"

# Installer Angular CLI globalement
RUN npm install -g @angular/cli@latest

# Dossier de travail
WORKDIR /app

# Exposer le port dev Angular
EXPOSE 4200

# Shell par défaut
CMD ["sh"]