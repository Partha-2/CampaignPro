import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { JsonDataService } from './data/json-data.service';
import { CampaignAnalyticsService } from './campaign-analytics/campaign-analytics.service';
import { InvestorInsightsService } from './investor-insights/investor-insights.service';
import { ReportGenerationService } from './reports/report-generation.service';
import { DataSeedingService } from './data/data-seeding.service';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
            serveRoot: '/',
        }),
    ],
    controllers: [AppController],
    providers: [
        JsonDataService,
        CampaignAnalyticsService,
        InvestorInsightsService,
        ReportGenerationService,
        DataSeedingService
    ],
})
export class AppModule { }
