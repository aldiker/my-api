import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrapMicroservice() {
  const logger = new Logger('Microservice');

  const host = process.env.MICROSERVICE_HOST || '0.0.0.0';
  const port = parseInt(process.env.MICROSERVICE_PORT || '3001', 10);

  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host,
        port,
      },
    },
  );

  // Start microservice
  await app.listen();
  logger.log(`Microservice is listening on ${host}:${port}`);
}

bootstrapMicroservice().catch((err) => {
  console.error('Error during microservice bootstrap:', err);
});
