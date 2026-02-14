
import { Test, TestingModule } from '@nestjs/testing';
import { CampaignAnalyticsService } from './campaign-analytics.service';
import { JsonDataService } from '../data/json-data.service';

describe('CampaignAnalyticsService', () => {
    let service: CampaignAnalyticsService;
    let jsonDataService: JsonDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CampaignAnalyticsService,
                {
                    provide: JsonDataService,
                    useValue: {
                        getCampaignById: jest.fn(),
                        getTransactionsByCampaignId: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CampaignAnalyticsService>(CampaignAnalyticsService);
        jsonDataService = module.get<JsonDataService>(JsonDataService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should calculate campaign analytics correctly', () => {
        const campaignId = 1;
        const analyticsDate = '2026-02-14';

        // Mock campaign
        (jsonDataService.getCampaignById as jest.Mock).mockReturnValue({
            id: campaignId,
            minimum_amt_commitment: 1000000,
            name: 'Test Campaign',
        });

        // Mock transactions: 2 investors, total 500,000
        (jsonDataService.getTransactionsByCampaignId as jest.Mock).mockReturnValue([
            { investor_id: 1, investment_amount: 200000 },
            { investor_id: 2, investment_amount: 300000 },
        ]);

        const result = service.getCampaignAnalytics(campaignId, analyticsDate);

        expect(result.campaign_id).toBe(campaignId);
        expect(result.total_investors).toBe(2);
        expect(result.total_amount_raised).toBe(500000);
        expect(result.average_investment_amount).toBe(250000);
        expect(result.funding_progress_percentage).toBe(50.0);

        // Formula 1 check:
        // Progress % = 50.0
        // Investor Component = (2 / 50) * 100 = 4.0
        // Score = (50.0 * 0.6) + (4.0 * 0.4) = 30 + 1.6 = 31.6
        expect(result.campaign_performance_score).toBe(31.6);
    });

    it('should cap performance score at 100', () => {
        const campaignId = 1;

        (jsonDataService.getCampaignById as jest.Mock).mockReturnValue({
            id: campaignId,
            minimum_amt_commitment: 1000, // Very low goal
            name: 'Fast Goal Campaign',
        });

        (jsonDataService.getTransactionsByCampaignId as jest.Mock).mockReturnValue([
            { investor_id: 1, investment_amount: 50000 }, // Raised way over goal
        ]);

        const result = service.getCampaignAnalytics(campaignId, '2026-02-14');
        expect(result.campaign_performance_score).toBe(100);
    });
});
