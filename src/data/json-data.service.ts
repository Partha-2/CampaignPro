
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Interfaces (redefined here to be self-contained if needed, or import from a shared file)
export interface Campaign {
    id: number;
    startup_id: number;
    minimum_amt_commitment: number;
    name: string;
}

export interface Investor {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
}

export interface Transaction {
    id: number;
    campaign_id: number;
    investor_id: number;
    investment_amount: number;
    investment_at: string;
    status: string;
}

export interface Startup {
    id: number;
    sector: string;
    company_name: string;
}

@Injectable()
export class JsonDataService implements OnModuleInit {
    private campaigns: Campaign[] = [];
    private investors: Investor[] = [];
    private transactions: Transaction[] = []; // Only invested
    private startups: Startup[] = [];

    onModuleInit() {
        this.loadData();
    }

    private loadData() {
        try {
            // Correct path: process.cwd() is project root. Data is in src/data/*.json
            const dataDir = path.join(process.cwd(), 'src', 'data');

            this.campaigns = JSON.parse(fs.readFileSync(path.join(dataDir, 'campaigns.json'), 'utf-8'));
            this.investors = JSON.parse(fs.readFileSync(path.join(dataDir, 'investors.json'), 'utf-8'));
            this.startups = JSON.parse(fs.readFileSync(path.join(dataDir, 'startups.json'), 'utf-8'));

            const allTransactions = JSON.parse(fs.readFileSync(path.join(dataDir, 'transactions.json'), 'utf-8'));
            // FILTER RULE: Only use transactions where status = "invested"
            this.transactions = allTransactions.filter((t: any) => t.status === 'invested');

            console.log(`Loaded ${this.campaigns.length} campaigns, ${this.investors.length} investors, ${this.transactions.length} invested transactions.`);
        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }

    getCampaigns() { return this.campaigns; }
    getInvestors() { return this.investors; }
    getTransactions() { return this.transactions; } // Returns only invested transactions
    getStartups() { return this.startups; }

    getCampaignById(id: number) { return this.campaigns.find(c => c.id === id); }
    getInvestorById(id: number) { return this.investors.find(i => i.id === id); }
    getStartupById(id: number) { return this.startups.find(s => s.id === id); }

    getTransactionsByCampaignId(campaignId: number): Transaction[] {
        return this.transactions.filter(t => t.campaign_id === campaignId);
    }

    getTransactionsByInvestorId(investorId: number): Transaction[] {
        return this.transactions.filter(t => t.investor_id === investorId);
    }
}
