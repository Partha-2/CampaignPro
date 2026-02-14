
import { Test, TestingModule } from '@nestjs/testing';
import { ReportGenerationService } from './report-generation.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('ReportGenerationService', () => {
    let service: ReportGenerationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReportGenerationService],
        }).compile();

        service = module.get<ReportGenerationService>(ReportGenerationService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate reports successfully', () => {
        const outputDir = path.join(process.cwd(), 'output');

        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
            if (filePath.includes('campaign-analytics.json')) {
                return JSON.stringify([{ campaign_id: 1, total_amount_raised: 100000 }]);
            }
            if (filePath.includes('investor-insights.json')) {
                return JSON.stringify([{ investor_id: 1, total_investment_amount: 100000 }]);
            }
            return '[]';
        });

        const result = service.generateReports(false);
        expect(result.count).toBe(100);
        expect(fs.writeFileSync).toHaveBeenCalled();
    });
});
