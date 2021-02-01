import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'Opening and Ending Skipper API',
      description:
        'Provides the opening and ending skip times for the Opening and Ending Skipper extension',
      version: '0.1.1',
    },
  },
  apis: ['./src/routes/*.ts'],
});

const router = express.Router();
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
