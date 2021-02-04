import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import packageJson from '../../package.json';

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: packageJson.name,
      description: packageJson.description,
      version: packageJson.version,
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
});

const router = express.Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
