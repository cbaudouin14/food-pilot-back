import express, { Application } from 'express';
import fs from 'fs';
import path from 'path';

const app: Application = express();
app.use(express.json());

// Chemin vers le dossier des routes
const routesPath = path.join(__dirname, 'http');

if (fs.existsSync(routesPath)) {
  fs.readdirSync(routesPath).forEach((folder) => {
    const routeDir = path.join(routesPath, folder);
    if (fs.statSync(routeDir).isDirectory()) {
      // Utilise .ts en dev, .js en prod
      const ext = fs.existsSync(path.join(routeDir, 'index.js')) ? 'js' : 'ts';
      const routeFile = path.join(routeDir, `index.${ext}`);
      if (fs.existsSync(routeFile)) {
        const routeModule = require(routeFile).default;
        app.use(`/${folder}`, routeModule);
        console.log(`Route /${folder} chargée`);
      }
    }
  });
} else {
  console.warn(`Dossier des routes introuvable: ${routesPath}`);
}

export default app;
