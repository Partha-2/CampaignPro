
import { Test, TestingModule } from '@nestjs/testing';
import { JsonDataService } from './json-data.service';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('fs');

describe('JsonDataService', () => {
    let service: JsonDataService;

    beforeEach(async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify([]));

        const module: TestingModule = await Test.createTestingModule({
            providers: [JsonDataService],
        }).compile();

        service = module.get<JsonDataService>(JsonDataService);
        // Manually trigger onModuleInit if needed, or check logic
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should load data on initialization', () => {
        const mockCampaigns = [{ id: 1, name: 'Test' }];
        (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
            if (filePath.includes('campaigns.json')) return JSON.stringify(mockCampaigns);
            return JSON.stringify([]);
        });

        // Trigger loading
        (service as any).onModuleInit();

        expect(service.getCampaigns()).toEqual(mockCampaigns);
    });

    it('should filter transactions by status invested', () => {
        const mockTransactions = [
            { id: 1, status: 'invested', amount: 100 },
            { id: 2, status: 'failed', amount: 100 }
        ];
        (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
            if (filePath.includes('transactions.json')) return JSON.stringify(mockTransactions);
            return JSON.stringify([]);
        });

        (service as any).onModuleInit();

        expect((service as any).transactions.length).toBe(1);
    });
});
