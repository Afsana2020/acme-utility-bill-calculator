// app.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo() {
    return {
      message: 'Utility Bill Calculator API',
      status: 'operational',
      version: '1.0',
      endpoints: [
        {
          method: 'GET',
          path: '/api/config',
          description: 'Get current billing configuration',
          example: 'GET /api/config'
        },
        {
          method: 'POST',
          path: '/api/config',
          description: 'Update configuration (admin only)',
          example: 'POST /api/config with JSON body',
          auth: 'Admin PIN required'
        },
        {
          method: 'POST',
          path: '/api/bill',
          description: 'Calculate utility bill',
          example: 'POST /api/bill with {"units": 150}',
          response: 'Returns bill breakdown with PDF download link'
        }
      ],
      deployment: {
        frontend: 'https://ah-utility-bill-calculator.vercel.app/',
        backend: 'https://acme-utility-bill-calculator-backend.onrender.com',
        database: 'Supabase PostgreSQL'
      },
      project: 'A.H. Electricity: Utility Bill Calculator'
    };
  }
}
