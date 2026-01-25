# Utilise Node officiel
FROM node:20

WORKDIR /app

# Copie package.json & package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source
COPY . .

# Build TypeScript pour prod
RUN npm run build

# Port exposé
EXPOSE 3000

# Commande par défaut (prod)
CMD ["node", "dist/server.js"]
