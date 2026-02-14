
import { Test, TestingModule } from '@nestjs/testing';
import { InvestorInsightsService } from './investor-insights.service';
import { JsonDataService } from '../data/json-data.service';

describe('InvestorInsightsService', () => {
    let service: InvestorInsightsService;
    let jsonDataService: JsonDataService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvestorInsightsService,
                {
                    provide: JsonDataService,
                    useValue: {
                        getInvestorById: jest.fn(),
                        getTransactionsByInvestorId: jest.fn(),
                        getCampaignById: jest.fn(),
                        getStartupById: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<InvestorInsightsService>(InvestorInsightsService);
        jsonDataService = module.get<JsonDataService>(JsonDataService);
    });

    it('should calculate investor insights correctly', () => {
        (jsonDataService.getInvestorById as jest.Mock).mockReturnValue({ id: 1 });
        (jsonDataService.getTransactionsByInvestorId as jest.Mock).mockReturnValue([
            { campaign_id: 1, investment_amount: 1000000, investment_at: '2026-01-01' },
            { campaign_id: 1, investment_amount: 1000000, investment_at: '2026-02-01' },
        ]);
        (jsonDataService.getCampaignById as jest.Mock).mockReturnValue({ startup_id: 1 });
        (jsonDataService.getStartupById as jest.Mock).mockReturnValue({ sector: 'Fin-tech' });

        const result = service.getInvestorInsights(1, '2026-02-14');

        expect(result.total_investments).toBe(2);
        expect(result.total_investment_amount).toBe(2000000);
        expect(result.preferred_sector).toBe('Fin-tech');
        expect(result.investor_segment).toBe('occasional');
        // countScore = (2/10) * 50 = 10
        // amountScore = (2M/1M) * 50 = 50 (capped at 50)
        // engagementScore = 10 + 50 = 60
        expect(result.engagement_score).toBe(60);
    });

    it('should determine whale segment for large investments', () => {
        (jsonDataService.getInvestorById as jest.Mock).mockReturnValue({ id: 1 });
        (jsonDataService.getTransactionsByInvestorId as jest.Mock).mockReturnValue([
            { campaign_id: 1, investment_amount: 6000000, investment_at: '2026-01-01' },
        ]);

        const result = service.getInvestorInsights(1, '2026-02-14');
        expect(result.investor_segment).toBe('whale');
    });
});
