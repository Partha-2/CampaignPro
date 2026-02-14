
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Handler, Context, Callback } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let cachedServer: Handler;

async function bootstrap() {
    if (!cachedServer) {
        const app = await NestFactory.create(AppModule);
        app.enableCors();
        await app.init();
        const expressApp = app.getHttpAdapter().getInstance();
        cachedServer = serverlessExpress({ app: expressApp });
    }
    return cachedServer;
}

export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    const server = await bootstrap();
    return server(event, context, callback);
};
