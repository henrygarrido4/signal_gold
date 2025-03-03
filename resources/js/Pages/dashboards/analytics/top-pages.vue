<script>
import simplebar from "simplebar-vue";

export default {
  components: {
    simplebar
  },
  props: {
    allCampaignMetrics: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      sortBy: 'leads', // Default sort by conversion rate
      isLoading: true,
      sortOptions: [
        { value: 'leads', text: 'Total Leads' },
        { value: 'entries', text: 'Total Entries' },
        { value: 'conversion', text: 'Conversion Rate' }
      ]
    }
  },
  watch: {
    allCampaignMetrics: {
      immediate: true,
      handler(newVal) {
        this.isLoading = Object.keys(newVal).length === 0;
      }
    }
  },
  computed: {
    topCampaigns() {
      // console.log('All Campaign Metrics:', this.allCampaignMetrics);
      // Convert metrics object to array
      const campaigns = Object.entries(this.allCampaignMetrics).map(([name, metrics]) => ({
        name,
        entries: metrics.totals?.entries || 0,
        leads: metrics.totals?.leads || 0,
        conversionRate: metrics.rates?.conversion_rate || 0
      }));
      
      // console.log('Processed Campaigns:', campaigns);
      // Sort based on selected metric
      return campaigns
        .sort((a, b) => {
          switch (this.sortBy) {
            case 'leads':
              return b.leads - a.leads;
            case 'entries':
              return b.entries - a.entries;
            case 'conversion':
            default:
              return b.conversionRate - a.conversionRate;
          }
        })
        .slice(0, 20); // Changed from 7 to 15 to show top 15 campaigns
    }
  }
};
</script>

<template>
    <BCard no-body class="card-height-100">
        <BCardHeader class="align-items-center d-flex py-0">
            <BCardTitle class="mb-0 flex-grow-1">Top Performing Campaigns MTD</BCardTitle>
            <div class="flex-shrink-0">
                <BDropdown
                    variant="soft-primary"
                    size="sm"
                    right
                >
                    <template #button-content>
                        <i class="ri-sort-desc me-1 align-bottom"></i>
                        Sort by {{ sortOptions.find(opt => opt.value === sortBy)?.text }}
                    </template>
                    <BDropdownItem
                        v-for="option in sortOptions"
                        :key="option.value"
                        @click="sortBy = option.value"
                        :active="sortBy === option.value"
                    >
                        {{ option.text }}
                    </BDropdownItem>
                </BDropdown>
            </div>
        </BCardHeader>
        <BCardBody>
            <div v-if="isLoading" class="text-center py-5">
                <BSpinner variant="primary" />
                <p class="text-muted mt-2 mb-0">Loading campaign data...</p>
            </div>
            <div v-else-if="!Object.keys(allCampaignMetrics).length" class="text-center py-3">
                <p class="text-muted mb-0">No campaign data available</p>
            </div>
            <div v-else>
                <div class="mx-n3">
                    <simplebar 
                        data-simplebar 
                        data-simplebar-auto-hide="false" 
                        data-simplebar-track="primary"
                        style="max-height: 300px;"
                    >
                        <div class="table-responsive table-card px-3">
                            <table class="table align-middle table-borderless table-centered table-nowrap mb-0">
                                <thead class="text-muted table-light">
                                    <tr>
                                        <th scope="col" style="min-width: 200px;">Campaign Name</th>
                                        <th scope="col" style="min-width: 100px;">Entries</th>
                                        <th scope="col" style="min-width: 100px;">Leads</th>
                                        <th scope="col" style="min-width: 120px;">Conversion Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="campaign in topCampaigns" :key="campaign.name">
                                        <td>{{ campaign.name }}</td>
                                        <td>{{ campaign.entries.toLocaleString() }}</td>
                                        <td>{{ Math.round(campaign.leads).toLocaleString() }}</td>
                                        <td>{{ campaign.conversionRate.toFixed(2) }}%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </simplebar>
                </div>
            </div>
        </BCardBody>
    </BCard>
</template>

<style scoped>
.dropdown-item.active {
    background-color: var(--vz-primary);
    color: white;
}

/* Add these styles for the primary scrollbar */
:deep(.simplebar-track.simplebar-vertical) {
    right: 0;
}

:deep(.simplebar-track.simplebar-horizontal) {
    bottom: 0;
}

:deep(.simplebar-track[data-simplebar-track="primary"]) {
    background-color: var(--vz-primary-rgb);
    opacity: 0.1;
}

:deep(.simplebar-track[data-simplebar-track="primary"] .simplebar-scrollbar::before) {
    background-color: var(--vz-primary);
}

/* Add padding to maintain spacing */
.table-responsive {
    margin: 0;
}
</style>