import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import packageJson from '../../../package.json';

const servers = [];
const apis = [];

if (process.env.NODE_ENV === 'development') {
  servers.push({ url: 'http://localhost:5000/v1' });
  apis.push('./src/routes/**/*.ts');
} else {
  servers.push({ url: 'https://api.aniskip.com/v1' });
  apis.push('./dist/src/routes/**/*.js');
}

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
    servers,
  },
  apis,
});

const router = express.Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
