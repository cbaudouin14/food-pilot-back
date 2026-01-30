// src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app: Application = express();

// Middleware pour parser le JSON
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

// Charger automatiquement toutes les routes dans src/http
const routesPath = path.join(__dirname, 'http');

fs.readdirSync(routesPath).forEach((folder) => {
  const routeDir = path.join(routesPath, folder);
  const stat = fs.statSync(routeDir);

  if (stat.isDirectory()) {
    const routeFile = path.join(routeDir, 'index.ts');
    if (fs.existsSync(routeFile)) {
      try {
        // Import synchrone pour éviter les problèmes d'asynchronisme
        const routeModule = require(routeFile).default;

        // -- DETECTION DE MÉTHODE ET NOM DE ROUTE --
        const methodMatch = folder.match(/^(get|post|put|delete)-/);
        let routeName = folder;
        let httpMethod = 'use'; // par défaut middleware

        if (methodMatch) {
          const method = methodMatch[1];      
          routeName = folder.replace(`${method}-`, ''); // get-users → users
          httpMethod = method.toLowerCase();  
        }

        // -- TRANSFORMATION DES PARAMS DYNAMIQUES --
        // Si le dossier contient "id" → remplacer par :id
        // Ex : get-user-id → user/:id
        routeName = routeName.replace(/-id$/, '/:id'); 
        routeName = routeName.replace(/-/g, '/'); // get-user-profile → user/profile

        // Monter la route sur Express
        app.use(`/${routeName}`, routeModule);
        console.log(`Route /${routeName} chargée (${httpMethod.toUpperCase()})`);

      } catch (err) {
        console.error(`Erreur en important la route /${folder}:`, err);
      }
    }
  }
});

export default app;
