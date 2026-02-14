
let rawCampaigns = [];
let rawInvestors = [];
let rawReports = [];

async function fetchData() {
    try {
        const [cRes, iRes, rRes] = await Promise.all([
            fetch('/data-api/campaign-analytics.json'),
            fetch('/data-api/investor-insights.json'),
            fetch('/data-api/analytics-reports.json')
        ]);

        rawCampaigns = await cRes.json();
        rawInvestors = await iRes.json();
        rawReports = await rRes.json();

        updateStats(rawCampaigns, rawInvestors);
        handleSearch(); // Initial render
    } catch (e) {
        console.error('Failed to fetch data', e);
    }
}

function updateStats(campaigns, investors) {
    const totalMoney = campaigns.reduce((sum, c) => sum + (c.total_amount_raised || 0), 0);
    const avgScore = campaigns.reduce((sum, c) => sum + (c.campaign_performance_score || 0), 0) / (campaigns.length || 1);

    document.getElementById('stat-total-money').innerText = `$${(totalMoney / 1000000).toFixed(2)}M`;
    document.getElementById('stat-investors').innerText = investors.length;
    document.getElementById('stat-score').innerText = avgScore.toFixed(1);
}

function handleSearch() {
    const query = document.getElementById('global-search').value.toLowerCase().trim();

    const filteredCampaigns = rawCampaigns.filter(c => {
        if (query === "") return true;
        const searchable = [
            `cam-${c.campaign_id}`,
            c.campaign_id.toString(),
            c.analytics_date,
            c.funding_progress_percentage.toString(),
            c.campaign_performance_score.toString()
        ].join(' ').toLowerCase();
        return searchable.includes(query);
    });

    const filteredInvestors = rawInvestors.filter(i => {
        if (query === "") return true;
        const searchable = [
            `inv-${i.investor_id}`,
            i.investor_id.toString(),
            i.investor_segment,
            i.preferred_sector,
            i.insight_date
        ].join(' ').toLowerCase();
        return searchable.includes(query);
    });

    const filteredReports = rawReports.filter(r => {
        if (query === "") return true;
        const searchable = [
            `#${r.id}`,
            r.id.toString(),
            r.report_name,
            r.report_type,
            r.report_period_start,
            r.report_period_end
        ].join(' ').toLowerCase();
        return searchable.includes(query);
    });

    renderCampaigns(filteredCampaigns);
    renderInvestors(filteredInvestors);
    renderReports(filteredReports);

    document.getElementById('count-campaigns').innerText = `${filteredCampaigns.length} Records`;
    document.getElementById('count-investors').innerText = `${filteredInvestors.length} Records`;
    document.getElementById('count-reports').innerText = `${filteredReports.length} Records`;
}

function renderCampaigns(data) {
    const body = document.getElementById('campaigns-body');
    body.innerHTML = data.map(c => `
        <tr>
            <td class="highlight">#${c.id}</td>
            <td>CAM-${c.campaign_id}</td>
            <td>${c.analytics_date}</td>
            <td>${c.funding_progress_percentage.toFixed(1)}%</td>
            <td>${c.total_investors}</td>
            <td>$${(c.total_amount_raised / 1000).toFixed(0)}k</td>
            <td><strong style="color: var(--accent-color)">${c.campaign_performance_score.toFixed(1)}</strong></td>
        </tr>
    `).join('');
}

function renderInvestors(data) {
    const body = document.getElementById('investors-body');
    body.innerHTML = data.map(i => `
        <tr>
            <td class="highlight">#${i.id}</td>
            <td>INV-${i.investor_id}</td>
            <td>${i.insight_date}</td>
            <td><span class="status-badge" style="background: rgba(88, 166, 255, 0.1); border-color: var(--accent-color); color: var(--accent-color)">${i.investor_segment}</span></td>
            <td>${i.preferred_sector}</td>
            <td>$${(i.total_investment_amount / 1000).toFixed(0)}k</td>
        </tr>
    `).join('');
}

function renderReports(data) {
    const body = document.getElementById('reports-body');
    body.innerHTML = data.map(r => `
        <tr>
            <td class="highlight">#${r.id}</td>
            <td>${r.report_name}</td>
            <td><span class="status-badge" style="background: rgba(188, 140, 255, 0.1); border-color: #bc8cff; color: #bc8cff">${r.report_type}</span></td>
            <td>${r.report_period_start}</td>
            <td>${r.report_period_end}</td>
            <td>$${(r.report_data.summary.total_amount / 1000000).toFixed(2)}M</td>
        </tr>
    `).join('');
}

document.addEventListener('DOMContentLoaded', fetchData);
