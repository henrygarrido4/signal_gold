<script>
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

export default {
  props: {
    selectedCampaigns: {
      type: Array,
      required: true
    },
    campaignAMetrics: {
      type: Object,
      default: () => null
    },
    campaignBMetrics: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    deliveredComparison() {
      return this.selectedCampaigns.map((campaign, index) => {
        const metrics = index === 0 ? this.campaignAMetrics : this.campaignBMetrics;
        const baseValue = index === 0 ? metrics?.totals?.emails_delivered : 0;
        const variance = index === 1 && metrics?.totals?.emails_delivered && this.campaignAMetrics?.totals?.emails_delivered
          ? ((metrics.totals.emails_delivered - this.campaignAMetrics.totals.emails_delivered) / this.campaignAMetrics.totals.emails_delivered * 100).toFixed(2)
          : 0;
        
        return {
          campaign: campaign || 'Not Selected',
          delivered: metrics?.totals?.emails_delivered?.toLocaleString() || '0',
          variance: index === 0 ? 'Baseline' : `${variance > 0 ? '+' : ''}${variance}%`
        };
      });
    },
    entriesComparison() {
      return this.selectedCampaigns.map((campaign, index) => {
        const metrics = index === 0 ? this.campaignAMetrics : this.campaignBMetrics;
        const baseValue = index === 0 ? metrics?.totals?.entries : 0;
        const variance = index === 1 && metrics?.totals?.entries && this.campaignAMetrics?.totals?.entries
          ? ((metrics.totals.entries - this.campaignAMetrics.totals.entries) / this.campaignAMetrics.totals.entries * 100).toFixed(2)
          : 0;
        
        return {
          campaign: campaign || 'Not Selected',
          entries: metrics?.totals?.entries?.toLocaleString() || '0',
          variance: index === 0 ? 'Baseline' : `${variance > 0 ? '+' : ''}${variance}%`
        };
      });
    },
    leadsComparison() {
      return this.selectedCampaigns.map((campaign, index) => {
        const metrics = index === 0 ? this.campaignAMetrics : this.campaignBMetrics;
        const baseValue = index === 0 ? metrics?.totals?.leads : 0;
        const variance = index === 1 && metrics?.totals?.leads && this.campaignAMetrics?.totals?.leads
          ? ((metrics.totals.leads - this.campaignAMetrics.totals.leads) / this.campaignAMetrics.totals.leads * 100).toFixed(2)
          : 0;
        
        return {
          campaign: campaign || 'Not Selected',
          leads: Math.round(metrics?.totals?.leads || 0).toLocaleString(),
          variance: index === 0 ? 'Baseline' : `${variance > 0 ? '+' : ''}${variance}%`
        };
      });
    },
    conversionComparison() {
      return this.selectedCampaigns.map((campaign, index) => {
        const metrics = index === 0 ? this.campaignAMetrics : this.campaignBMetrics;
        const baseValue = index === 0 ? metrics?.rates?.conversion_rate : 0;
        const variance = index === 1 && metrics?.rates?.conversion_rate && this.campaignAMetrics?.rates?.conversion_rate
          ? (metrics.rates.conversion_rate - this.campaignAMetrics.rates.conversion_rate).toFixed(2)
          : 0;
        
        return {
          campaign: campaign || 'Not Selected',
          rate: `${(metrics?.rates?.conversion_rate || 0).toFixed(2)}%`,
          variance: index === 0 ? 'Baseline' : `${variance > 0 ? '+' : ''}${variance}%`
        };
      });
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    },
    
    exportData() {
      // Prepare worksheet data
      const wsData = [
        ['Campaign Comparison Summary'],
        ['Generated on:', new Date().toLocaleString()],
        [''],
        ['Delivered Performance'],
        ['Campaign', 'Delivered', 'Variance'],
        [this.selectedCampaigns[0], this.deliveredComparison[0]?.delivered, 'Baseline'],
        [this.selectedCampaigns[1], this.deliveredComparison[1]?.delivered, this.deliveredComparison[1]?.variance],
        [''],
        ['Entries Performance'],
        ['Campaign', 'Entries', 'Variance'],
        [this.selectedCampaigns[0], this.entriesComparison[0]?.entries, 'Baseline'],
        [this.selectedCampaigns[1], this.entriesComparison[1]?.entries, this.entriesComparison[1]?.variance],
        [''],
        ['Leads Performance'],
        ['Campaign', 'Leads', 'Variance'],
        [
          this.selectedCampaigns[0], 
          this.leadsComparison[0]?.leads,
          'Baseline'
        ],
        [
          this.selectedCampaigns[1], 
          this.leadsComparison[1]?.leads,
          this.leadsComparison[1]?.variance || 'N/A'
        ],
        [''],
        ['Daily Metrics'],
        ['Date', 'Campaign', 'Delivered', 'Entries', 'Leads', 'Conversion Rate']
      ];
      
      // Add daily metrics for Campaign A
      Object.entries(this.campaignAMetrics?.dailyMetrics || {}).forEach(([date, data]) => {
        const convRate = data.metrics.entries ? 
          ((data.metrics.totalLeads / data.metrics.entries) * 100).toFixed(2) : '0.00';
        
        wsData.push([
          this.formatDate(date),
          this.selectedCampaigns[0],
          data.metrics.totalDelivered?.toLocaleString() || '0',
          data.metrics.entries?.toLocaleString() || '0',
          Math.round(data.metrics.totalLeads || 0).toLocaleString(),
          `${convRate}%`
        ]);
      });
      
      // Add spacing between campaigns
      wsData.push([''], [''], [''], ['']);
      
      // Add daily metrics for Campaign B
      Object.entries(this.campaignBMetrics?.dailyMetrics || {}).forEach(([date, data]) => {
        const convRate = data.metrics.entries ? 
          ((data.metrics.totalLeads / data.metrics.entries) * 100).toFixed(2) : '0.00';
        
        wsData.push([
          this.formatDate(date),
          this.selectedCampaigns[1],
          data.metrics.totalDelivered?.toLocaleString() || '0',
          data.metrics.entries?.toLocaleString() || '0',
          Math.round(data.metrics.totalLeads || 0).toLocaleString(),
          `${convRate}%`
        ]);
      });
      
      // Convert to CSV
      const csv = Papa.unparse(wsData);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const fileName = `campaign_comparison_${new Date().toISOString().split('T')[0]}.csv`;
      saveAs(blob, fileName);
    }
  }
};
</script>

<template>
  <BCard no-body class="h-100">
    <BCardHeader>
      <div class="d-flex justify-content-between align-items-center">
        <BCardTitle class="mb-0">Campaign Comparison Results</BCardTitle>
        <BButton
          variant="soft-primary"
          size="sm"
          @click="exportData"
          :disabled="!selectedCampaigns[0] || !selectedCampaigns[1]"
        >
          <i class="ri-download-2-line align-bottom me-1"></i>
          Export
        </BButton>
      </div>
    </BCardHeader>
    <BCardBody>
      <div>
      <h5 class="card-title mb-4">Campaign Performance Comparison</h5>
      
    </div>
      
      <div class="comparison-metrics">
        <!-- Delivered Performance -->
        <div class="metric-group mb-3">
          <h6 class="metric-title">Delivered Performance</h6>
          <BTable small striped hover 
            :items="deliveredComparison" 
            :fields="[
              { key: 'campaign', label: 'Campaign' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'variance', label: 'Variance' }
            ]" 
          />
        </div>

        <!-- Entries Performance -->
        <div class="metric-group mb-3">
          <h6 class="metric-title">Entries Performance</h6>
          <BTable small striped hover 
            :items="entriesComparison" 
            :fields="[
              { key: 'campaign', label: 'Campaign' },
              { key: 'entries', label: 'Entries' },
              { key: 'variance', label: 'Variance' }
            ]" 
          />
        </div>

        <!-- Leads Performance -->
        <div class="metric-group mb-3">
          <h6 class="metric-title">Leads Performance</h6>
          <BTable small striped hover 
            :items="leadsComparison" 
            :fields="[
              { key: 'campaign', label: 'Campaign' },
              { key: 'leads', label: 'Leads' },
              { key: 'variance', label: 'Variance' }
            ]" 
          />
        </div>

        <!-- Conversion Rate Performance -->
        <div class="metric-group">
          <h6 class="metric-title">Conversion Rate Performance</h6>
          <BTable small striped hover 
            :items="conversionComparison" 
            :fields="[
              { key: 'campaign', label: 'Campaign' },
              { key: 'rate', label: 'Rate' },
              { key: 'variance', label: 'Variance' }
            ]" 
          />
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<style scoped>

.h-100 { 
    height: 97% !important;
}

.metric-title {
  color: #495057;
  margin-bottom: 0.5rem;
}

.comparison-metrics {
  height: 100%;
}

/* Make tables more compact and ensure consistent alignment */
:deep(.table) {
  margin-bottom: 0;
  table-layout: fixed;
  width: 100%;
}

:deep(.table td), :deep(.table th) {
  padding: 0.5rem;
  width: 33.33%;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.table td:first-child) {
  width: 40%;
}

:deep(.table td:not(:first-child)) {
  width: 30%;
}
</style> 