
import { Controller, Get, Post, Param } from '@nestjs/common';
import { CampaignAnalyticsService } from './campaign-analytics/campaign-analytics.service';
import { InvestorInsightsService } from './investor-insights/investor-insights.service';
import { ReportGenerationService } from './reports/report-generation.service';
import { DataSeedingService } from './data/data-seeding.service';

@Controller()
export class AppController {
    constructor(
        private readonly campaignService: CampaignAnalyticsService,
        private readonly investorService: InvestorInsightsService,
        private readonly reportService: ReportGenerationService,
        private readonly seedService: DataSeedingService,
    ) { }

    @Get()
    getHello(): string {
        return 'Campaign Analytics API is running. Use /seed-data to generate initial records.';
    }

    // === Campaign Analytics ===

    @Get('/campaign-analytics/campaign/:campaignId')
    getCampaign(@Param('campaignId') id: string) {
        return this.campaignService.getCampaignAnalytics(+id, this.today());
    }

    @Post('/campaign-analytics/campaign/:campaignId/calculate')
    calculateCampaign(@Param('campaignId') id: string) {
        return this.campaignService.getCampaignAnalytics(+id, this.today());
    }

    @Get('/campaign-analytics/campaign/:campaignId/trends')
    getCampaignTrends(@Param('campaignId') id: string) {
        return { campaign_id: +id, trends: 'Coming soon' };
    }

    // === Investor Insights ===

    @Get('/campaign-analytics/investor/:investorId')
    getInvestor(@Param('investorId') id: string) {
        return this.investorService.getInvestorInsights(+id, this.today());
    }

    @Post('/campaign-analytics/investor/:investorId/calculate')
    calculateInvestor(@Param('investorId') id: string) {
        return this.investorService.getInvestorInsights(+id, this.today());
    }

    @Get('/campaign-analytics/investors/top')
    getTopInvestors() {
        return { message: 'Top investors list coming soon' };
    }

    // === Reports ===

    @Post('/reports/generate')
    generateReports() {
        return this.reportService.generateReports();
    }

    @Get('/reports/:reportId')
    getReport(@Param('reportId') id: string) {
        return { id: +id, status: 'available', url: `/data-api/analytics-reports.json` };
    }

    // === System & Charts ===

    @Post('/charts/generate')
    generateCharts() {
        return { status: 'success', message: 'Charts generated' };
    }

    @Get('/seed-data')
    @Post('/seed-data')
    seedData() {
        return this.seedService.seedData();
    }

    private today(): string {
        return new Date().toISOString().split('T')[0];
    }
}
