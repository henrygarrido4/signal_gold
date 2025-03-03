<template>
  <BCard no-body>
    <BCardHeader>
      <BCardTitle>Campaign Metrics</BCardTitle>
    </BCardHeader>
    <BCardBody>
      <template v-if="metrics && metrics.totals">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h4 class="card-title mb-0">Campaign Metrics</h4>
          <div class="d-flex gap-2">
            <SaveToSnapshotButton
              v-if="canSaveSnapshot"
              :metrics="metrics"
              :source="source || 'campaign'"
              :campaign-name="selectedCampaign"
              :existing-snapshots="snapshots"
              data-type="campaign"
            />
            <BButton variant="primary" size="sm" @click="exportToCSV">
              <i class="ri-download-2-line align-middle me-1"></i> Export
            </BButton>
          </div>
        </div>
        <GridJs
          :data="formatGridData()"
          :columns="gridColumns"
          :search="true"
          :sort="true"
          :loading="loading"
        />
      </template>
      <template v-else>
        <div class="text-center py-4">
          <p class="text-muted mb-0">Select a campaign to view metrics</p>
        </div>
      </template>
    </BCardBody>
  </BCard>
</template>

<script>
import SaveToSnapshotButton from '@/Components/SaveToSnapshotButton.vue';
import GridJs from '@/Pages/dashboards/crm/gridjs.vue';

export default {
  name: 'CampaignMetricsTable',
  components: {
    SaveToSnapshotButton,
    GridJs
  },
  props: {
    metrics: {
      type: Object,
      default: () => ({
        totals: {},
        rates: {},
        trends: {},
        dailyMetrics: {}
      })
    },
    snapshots: {
      type: Array,
      required: false,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    source: {
      type: String,
      default: 'campaign'
    },
    selectedCampaign: {
      type: String,
      default: null
    }
  },
  computed: {
    campaignId() {
      return this.metrics?.campaign_id || null;
    },
    canSaveSnapshot() {
      return this.metrics && 
             Object.keys(this.metrics).length > 0 && 
             this.selectedCampaign;
    },
    gridColumns() {
      return [
        { 
          name: 'Campaign Name',
          id: 'campaign_name'
        },
        { 
          name: 'Delivered',
          id: 'emails_delivered',
          formatter: (cell) => this.formatNumber(cell)
        },
        { 
          name: 'Click Thrus',
          id: 'clicks',
          formatter: (cell) => this.formatNumber(cell)
        },
        { 
          name: 'Click Thru %',
          id: 'click_rate',
          formatter: (cell) => `
            <span class="badge bg-${this.getPercentageClass(cell)}">
              ${this.formatPercentage(cell)}%
            </span>
          `
        },
        {
          name: 'Entries',
          id: 'entries',
          formatter: (cell) => this.formatNumber(cell)
        },
        {
          name: 'Leads',
          id: 'leads',
          formatter: (cell) => this.formatNumber(cell)
        },
        {
          name: 'Conv. %',
          id: 'conversion_rate',
          formatter: (cell) => `
            <span class="badge bg-${this.getPercentageClass(cell)}">
              ${this.formatPercentage(cell)}%
            </span>
          `
        }
      ];
    },
    hasSnapshots() {
      return Array.isArray(this.snapshots) && this.snapshots.length > 0;
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat().format(value || 0);
    },
    formatPercentage(value) {
      return (value || 0).toFixed(2);
    },
    getPercentageClass(value) {
      if (!value) return 'secondary';
      return value >= 0 ? 'success' : 'danger';
    },
    getStatusClass(status) {
      switch(status) {
        case 'above_target': return 'success';
        case 'on_target': return 'primary';
        case 'below_target': return 'warning';
        case 'critical': return 'danger';
        default: return 'secondary';
      }
    },
    getStatusText(status) {
      switch(status) {
        case 'above_target': return 'Above Target';
        case 'on_target': return 'On Target';
        case 'below_target': return 'Below Target';
        case 'critical': return 'Critical';
        default: return 'No Data';
      }
    },
    formatGridData() {
      if (!this.metrics || !this.metrics.totals) return [];
      
      return [{
        campaign_name: this.selectedCampaign || 'Select a Campaign',
        emails_delivered: this.metrics.totals.emails_delivered,
        clicks: this.metrics.totals.total_clicks,
        click_rate: this.metrics.rates.click_through_rate,
        entries: this.metrics.totals.entries,
        leads: Math.round(this.metrics.totals.leads || 0),
        conversion_rate: this.metrics.rates.conversion_rate
      }];
    },
    exportToCSV() {
      if (!this.metrics?.dailyMetrics) {
        console.log('No daily metrics data available');
        return;
      }

      const headers = [
        'Date',
        'Campaign Name',
        'Delivered',
        'Click Thrus',
        'Click Thru %',
        'Open Rate %',
        'Click-to-Open %',
        'Entries',
        'Leads',
        'Conversion %'
      ];

      // Add campaign totals row
      const totalsRow = [
        'Campaign Totals',
        this.selectedCampaign,
        this.metrics.totals.emails_delivered || 0,
        this.metrics.totals.total_clicks || 0,
        this.formatPercentage(this.metrics.rates.click_through_rate * 100),
        this.formatPercentage(this.metrics.rates.open_rate * 100),
        this.formatPercentage(this.metrics.rates.click_to_open_rate * 100),
        this.metrics.totals.entries || 0,
        Math.round(this.metrics.totals.leads || 0),
        this.formatPercentage(this.metrics.rates.conversion_rate)
      ].join(',');

      // Convert daily metrics into rows and sort by date (newest first)
      const dailyRows = Object.entries(this.metrics.dailyMetrics)
        .map(([dateKey, data]) => {
          const metrics = data.metrics;
          const [month, day] = [data.monthDate, data.dayDate];
          
          // Format date as MM/DD
          const formattedDate = `${month}/${day}`;
          
          const entries = metrics.entries || 0;
          const leads = metrics.totalLeads || 0;
          const conversionRate = entries > 0 ? (leads / entries) * 100 : 0;
          const clickThruRate = (metrics.clickThruRate || 0) * 100;
          const openRate = (metrics.openRate || 0) * 100;
          const clickToOpenRate = (metrics.clickToOpenRate || 0) * 100;

          return {
            date: new Date(2024, month - 1, day),
            row: [
              formattedDate,
              this.selectedCampaign,
              metrics.totalDelivered || 0,
              metrics.totalClicks || 0,
              this.formatPercentage(clickThruRate),
              this.formatPercentage(openRate),
              this.formatPercentage(clickToOpenRate),
              entries,
              Math.round(leads),
              this.formatPercentage(conversionRate)
            ].join(',')
          };
        })
        .sort((a, b) => b.date - a.date)
        .map(item => item.row);

      const csvContent = [
        headers.join(','),
        totalsRow,
        '', // Add blank line between totals and daily metrics
        ...dailyRows
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.selectedCampaign || 'campaign'}-metrics.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }
}
</script> 