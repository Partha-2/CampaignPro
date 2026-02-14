import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReportGenerationService {
    /**
     * Generates summary reports for campaigns and investors.
     * If seedData is true, it creates the output directory if missing.
     */
    generateReports(seedData: boolean = false) {
        const outputDir = path.join(process.cwd(), 'output');
        this.ensureOutputDir(outputDir, seedData);

        const campaignAnalytics = this.loadJsonFile(path.join(outputDir, 'campaign-analytics.json'));
        const investorInsights = this.loadJsonFile(path.join(outputDir, 'investor-insights.json'));

        const reports = Array.from({ length: 100 }, (_, i) => this.createReport(i + 1, campaignAnalytics, investorInsights));

        fs.writeFileSync(path.join(outputDir, 'analytics-reports.json'), JSON.stringify(reports, null, 2));
        return { count: reports.length };
    }

    private ensureOutputDir(dir: string, allowCreate: boolean) {
        if (!fs.existsSync(dir)) {
            if (allowCreate) {
                fs.mkdirSync(dir, { recursive: true });
            } else {
                throw new Error('Output directory not found. Please run seed data first.');
            }
        }
    }

    private loadJsonFile(filePath: string) {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File missing: ${filePath}. Run seed data first.`);
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }

    private createReport(id: number, campaigns: any[], investors: any[]) {
        const isCampaignType = id % 2 === 0;
        const type = isCampaignType ? 'campaign' : 'investor';

        const summary = isCampaignType
            ? this.getCampaignSummary(campaigns)
            : this.getInvestorSummary(investors);

        return {
            id,
            report_name: `${this.capitalize(type)} Analytics Report - ${id}`,
            report_type: type,
            generated_by: 1,
            report_period_start: '2025-10-01',
            report_period_end: '2026-02-14',
            report_data: {
                summary,
                details: isCampaignType ? campaigns.slice(0, 5) : investors.slice(0, 5)
            },
            export_file_url: null,
            generated_at: new Date().toISOString()
        };
    }

    private getCampaignSummary(data: any[]) {
        return {
            total_campaigns: new Set(data.map(c => c.campaign_id)).size,
            total_amount: data.reduce((sum, c) => sum + c.total_amount_raised, 0)
        };
    }

    private getInvestorSummary(data: any[]) {
        return {
            total_investors: new Set(data.map(inv => inv.investor_id)).size,
            total_amount: data.reduce((sum, inv) => sum + inv.total_investment_amount, 0)
        };
    }

    private capitalize(s: string) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
}
