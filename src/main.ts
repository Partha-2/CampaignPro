
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.enableCors();

    const port = 3000;
    await app.listen(port);
    console.log(`Campaign Analytics Service is running on http://localhost:${port}`);
}
bootstrap();
