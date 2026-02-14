import { Injectable } from '@nestjs/common';
import { JsonDataService } from '../data/json-data.service';
import { Transaction } from '../data/json-data.service';

@Injectable()
export class InvestorInsightsService {
    constructor(private readonly jsonDataService: JsonDataService) { }

    /**
     * Generates insights for an investor based on their transaction history.
     */
    getInvestorInsights(investorId: number, insightDate: string) {
        const investor = this.jsonDataService.getInvestorById(investorId);
        if (!investor) {
            throw new Error(`Investor ${investorId} not found`);
        }

        const transactions = this.jsonDataService.getTransactionsByInvestorId(investorId);
        const totalAmount = transactions.reduce((sum, t) => sum + t.investment_amount, 0);
        const count = transactions.length;

        return {
            id: Math.floor(Math.random() * 100000),
            investor_id: investorId,
            insight_date: insightDate,
            total_investments: count,
            total_investment_amount: totalAmount,
            average_investment_amount: count > 0 ? this.round(totalAmount / count) : 0,
            preferred_sector: this.findPreferredSector(transactions),
            engagement_score: this.calculateEngagementScore(count, totalAmount),
            investor_segment: this.determineSegment(count, totalAmount),
            last_investment_date: this.findLastInvestmentDate(transactions)
        };
    }

    private findPreferredSector(transactions: any[]): string {
        const sectorCounts: Record<string, number> = {};

        transactions.forEach(t => {
            const campaign = this.jsonDataService.getCampaignById(t.campaign_id);
            const startup = campaign ? this.jsonDataService.getStartupById(campaign.startup_id) : null;
            const sector = startup?.sector || 'General';
            sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
        });

        return Object.entries(sectorCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0] || 'General';
    }

    private calculateEngagementScore(count: number, amount: number): number {
        const countScore = Math.min(count / 10, 1) * 50;
        const amountScore = Math.min(amount / 1000000, 1) * 50;
        return this.round(Math.min(countScore + amountScore, 100));
    }

    private determineSegment(count: number, amount: number): string {
        if (amount >= 5000000) return 'whale';
        if (count >= 5) return 'regular';
        if (count >= 2) return 'occasional';
        return 'new';
    }

    private findLastInvestmentDate(transactions: any[]): string | null {
        if (transactions.length === 0) return null;
        return transactions.reduce((latest, t) =>
            t.investment_at > latest ? t.investment_at : latest,
            transactions[0].investment_at
        );
    }

    private round(value: number): number {
        return Math.round(value * 100) / 100;
    }
}
