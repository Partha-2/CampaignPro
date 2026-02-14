
import { Injectable } from '@nestjs/common';
import { JsonDataService } from '../data/json-data.service';

@Injectable()
export class CampaignAnalyticsService {
    constructor(private readonly jsonDataService: JsonDataService) { }

    /**
     * Calculates metrics for a specific campaign as of a specific date.
     * Formula: Score = (Progress * 0.6) + (InvestorComponent * 0.4)
     */
    getCampaignAnalytics(campaignId: number, analyticsDate: string) {
        const campaign = this.jsonDataService.getCampaignById(campaignId);
        if (!campaign) {
            throw new Error(`Campaign ${campaignId} not found`);
        }

        const transactions = this.jsonDataService.getTransactionsByCampaignId(campaignId);

        // Aggregate metrics
        const uniqueInvestors = new Set(transactions.map(t => t.investor_id)).size;
        const totalAmountRaised = transactions.reduce((sum, t) => sum + t.investment_amount, 0);

        // Business Logic Calculations
        const averageInvestment = uniqueInvestors > 0 ? totalAmountRaised / uniqueInvestors : 0;
        const progressPercentage = (totalAmountRaised / campaign.minimum_amt_commitment) * 100;

        return {
            id: Math.floor(Math.random() * 10000), // Random ID for record
            campaign_id: campaignId,
            analytics_date: analyticsDate,
            total_investors: uniqueInvestors,
            total_amount_raised: totalAmountRaised,
            average_investment_amount: this.round(averageInvestment),
            funding_progress_percentage: this.round(progressPercentage),
            campaign_performance_score: this.calculatePerformanceScore(progressPercentage, uniqueInvestors)
        };
    }

    private calculatePerformanceScore(progress: number, investors: number): number {
        const investorComponent = Math.min((investors / 50) * 100, 100);
        const score = (progress * 0.6) + (investorComponent * 0.4);
        return this.round(Math.min(score, 100));
    }

    private round(value: number): number {
        return Math.round(value * 100) / 100;
    }
}
