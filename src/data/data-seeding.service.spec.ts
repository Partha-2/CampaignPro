
import { Test, TestingModule } from '@nestjs/testing';
import { DataSeedingService } from './data-seeding.service';
import { JsonDataService } from './json-data.service';
import { CampaignAnalyticsService } from '../campaign-analytics/campaign-analytics.service';
import { InvestorInsightsService } from '../investor-insights/investor-insights.service';
import { ReportGenerationService } from '../reports/report-generation.service';
import * as fs from 'fs';

jest.mock('fs');

describe('DataSeedingService', () => {
    let service: DataSeedingService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DataSeedingService,
                { provide: JsonDataService, useValue: { getCampaigns: jest.fn().mockReturnValue([{ id: 1 }]), getInvestors: jest.fn().mockReturnValue([{ id: 1 }]) } },
                { provide: CampaignAnalyticsService, useValue: { getCampaignAnalytics: jest.fn() } },
                { provide: InvestorInsightsService, useValue: { getInvestorInsights: jest.fn() } },
                { provide: ReportGenerationService, useValue: { generateReports: jest.fn().mockReturnValue({ count: 100 }) } },
            ],
        }).compile();

        service = module.get<DataSeedingService>(DataSeedingService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should run seedData successfully', () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        const result = service.seedData();
        expect(result.campaignAnalytics).toBe(100);
        expect(result.investorInsights).toBe(100);
        expect(result.reports).toBe(100);
        expect(fs.writeFileSync).toHaveBeenCalled();
    });
});
