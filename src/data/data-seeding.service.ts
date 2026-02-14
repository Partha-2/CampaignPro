
import { Injectable } from '@nestjs/common';
import { JsonDataService } from '../data/json-data.service';
import { CampaignAnalyticsService } from '../campaign-analytics/campaign-analytics.service';
import { InvestorInsightsService } from '../investor-insights/investor-insights.service';
import { ReportGenerationService } from '../reports/report-generation.service';
import * as fs from 'fs';
import * as path from 'path';

export interface SeedDataResult {
    campaignAnalytics: number;
    investorInsights: number;
    reports: number;
}

@Injectable()
export class DataSeedingService {
    constructor(
        private jsonDataService: JsonDataService,
        private campaignAnalyticsService: CampaignAnalyticsService,
        private investorInsightsService: InvestorInsightsService,
        private reportGenerationService: ReportGenerationService
    ) { }

    seedData() {
        console.log("Starting data seeding...");
        const outputDir = path.join(process.cwd(), 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const campaigns = this.jsonDataService.getCampaigns();
        const investors = this.jsonDataService.getInvestors();

        // Safety check
        if (!campaigns.length || !investors.length) {
            throw new Error("No campaigns or investors loaded. Check JsonDataService.");
        }

        // 1. Generate 100 Campaign Analytics Records
        const campaignResults = [];
        for (let i = 0; i < 100; i++) {
            // Cycle through campaigns if fewer than 100
            const campaignIndex = i % campaigns.length;
            const campaign = campaigns[campaignIndex];

            const date = new Date();
            date.setDate(date.getDate() - (i % 90)); // Spread dates over last 90 days
            const formattedDate = date.toISOString().split('T')[0];

            const result = this.campaignAnalyticsService.getCampaignAnalytics(campaign.id, formattedDate);

            // Override ID to be sequential 1-40
            const finalResult = { ...result, id: i + 1 };
            campaignResults.push(finalResult);
        }
        fs.writeFileSync(path.join(outputDir, 'campaign-analytics.json'), JSON.stringify(campaignResults, null, 2));

        // 2. Generate 100 Investor Insights Records
        const investorResults = [];
        for (let i = 0; i < 100; i++) {
            const investorIndex = i % investors.length;
            const investor = investors[investorIndex];

            const date = new Date();
            date.setDate(date.getDate() - (i % 90));
            const formattedDate = date.toISOString().split('T')[0];

            const result = this.investorInsightsService.getInvestorInsights(investor.id, formattedDate);

            const finalResult = { ...result, id: i + 1 };
            investorResults.push(finalResult);
        }
        fs.writeFileSync(path.join(outputDir, 'investor-insights.json'), JSON.stringify(investorResults, null, 2));

        // 3. Generate 40 Reports
        // We need to pass the just-generated data to the report service, or let it read from file.
        // The previously written service reads from file, which is fine since we just wrote them.
        const reportsResult = this.reportGenerationService.generateReports(true);

        return {
            campaignAnalytics: campaignResults.length,
            investorInsights: investorResults.length,
            reports: reportsResult.count
        };
    }
}
