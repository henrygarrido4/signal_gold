<script>
import DateSelector from "@/Pages/dashboards/analytics/date-selector.vue";
import axios from 'axios';
import { Link } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import { ref, onMounted } from 'vue';
import tableauService from "@/services/tableauService.js";
import { 
  BDropdown, 
  BDropdownItem, 
  BDropdownDivider, 
  BButtonGroup 
} from 'bootstrap-vue-next';

export default {
  components: {
    DateSelector,
    Link,
    Layout,
    PageHeader,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,
    BButtonGroup
  },
  props: {
    campaignId: {
      type: String,
      default: ''
    },
    campaignOptions: {
      type: Array,
      required: true
    },
    selectedCampaign: {
      type: String,
      default: ''
    },
    allCampaignNames: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      date: null,
      config: {
        inline: true,
        dateFormat: "Y-m-d",
        mode: "range"
      },
      campaignSearch: '',
      comparisonPeriod: 'month',
      isCustomDropdownOpen: false,
      periodOptions: [
        { value: 'custom', text: 'Custom Range' }
      ],
      showDatePicker: false,
      recentEvents: [],
      isLoadingGroups: false,
      metrics: null,
      selectedDates: null
    };
  },
  computed: {
    selectedCampaignText() {
      if (!this.selectedCampaign) return 'Select Campaign';
      return this.selectedCampaign;
    },
    filteredCampaigns() {
      if (!this.campaignSearch) {
        return this.campaignOptions;
      }
      
      return [
        { value: null, text: 'Select a campaign' },
        ...this.allCampaignNames
          .filter(name => 
            name.toLowerCase().includes(this.campaignSearch.toLowerCase())
          )
          .map(name => ({
            value: name,
            text: name
          }))
      ];
    },
    isReadyToFetch() {
      return this.selectedCampaign && this.date && (
        Array.isArray(this.date) ? this.date.length === 2 : true
      );
    }
  },
  methods: {
    async logDateSelection(dates) {
      try {
        await axios.post('/api/campaign-logs', {
          campaign_id: this.campaignId,
          action: 'date_selection',
          start_date: dates.start,
          end_date: dates.end,
          timestamp: new Date().toISOString(),
          user_id: window?.Laravel?.user?.id // If you have user info in window
        });
      } catch (error) {
        console.error('Failed to log date selection:', error);
      }
    },
    handlePeriodSelection(dates) {
      // Debug available fields
      this.$refs.tableau?.getAvailableFields();
      // Forward the event with the same structure as analytics
      this.$emit('period-selected', {
        start: dates.start,
        end: dates.end
      });
    },
    updatePeriod(period) {
      this.comparisonPeriod = period;
      
      const today = new Date();
      let start = new Date();
      let end = today;
      
      switch(period) {
        case 'mtd':
          start = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'ytd':
          start = new Date(today.getFullYear(), 0, 1);
          break;
      }
      
      if (period !== 'custom') {
        this.handlePeriodSelection({ start, end });
      }
    },
    activateCustomRange(e) {
      e.preventDefault();
      e.stopPropagation();
      this.comparisonPeriod = 'custom';
      this.isCustomDropdownOpen = true;
    },
    getDateDisplayText() {
      if (!this.date || this.date.length !== 2) {
        return '📅 Select Date Range';
      }
      
      const start = new Date(this.date[0]).toLocaleDateString();
      const end = new Date(this.date[1]).toLocaleDateString();
      return `${start} - ${end}`;
    },
    fetchData() {
      if (!this.isReadyToFetch) return;

      const dates = Array.isArray(this.date) ? {
        start: new Date(this.date[0]),
        end: new Date(this.date[1])
      } : this.date;

      this.$emit('fetch-data', {
        campaignId: this.selectedCampaign,
        dates
      });

      // Optional: Show loading state or success message
      this.$toast?.success('Fetching campaign data...');
    },
    async fetchRecentEvents() {
      try {
        const response = await axios.get('/api/campaign-logs', {
          params: { recent: true },
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        this.recentEvents = response.data.data;
        // console.log('Recent events:', this.recentEvents);
      } catch (error) {
        console.error('Failed to fetch recent events:', error);
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
      }
    },
    handleCampaignSelect(campaign) {
      this.$emit('update:selected-campaign', campaign);
    },
    async updateCampaignNames(campaigns) {
      this.allCampaignNames = campaigns;
      this.campaignOptions = [
        { value: null, text: 'Select a campaign' },
        ...campaigns.slice(0, 6).map(name => ({
          value: name,
          text: name
        }))
      ];
    },
    handleDateSelection(dates) {
      this.selectedDates = dates;
      this.$emit('date-selection', dates);
    }
  },
  mounted() {
    this.fetchRecentEvents();
  }
};
</script>

<template>
  <BCard no-body>
    <BCardHeader class="border-0">
      <div class="d-flex flex-column gap-2">
        <!-- Campaign Selection -->
        <div class="mb-4">
          <label class="form-label">Select Campaign</label>
          <BButtonGroup class="w-100">
            <BDropdown
              variant="primary"
              :text="selectedCampaign || 'Select Campaign'"
              class="w-100"
            >
              <div class="px-3 py-2" @click.stop>
                <BFormInput
                  v-model="campaignSearch"
                  type="search"
                  placeholder="Search campaigns..."
                  class="form-control"
                  @click.stop
                  @keydown.stop
                />
              </div>
              <BDropdownDivider />
              <BDropdownItem
                v-for="option in filteredCampaigns"
                :key="option.value"
                @click="handleCampaignSelect(option.value)"
                :active="selectedCampaign === option.value"
              >
                {{ option.text }}
              </BDropdownItem>
            </BDropdown>
          </BButtonGroup>
        </div>

        <!-- Date Selection -->
        <div class="mb-4">
          <label class="form-label">Select Date Range</label>
          <DateSelector 
            @period-selected="handlePeriodSelection"
            :disabled="!selectedCampaign"
          />
        </div>
      </div>
    </BCardHeader>

    <BCardBody class="pt-0">
      <!-- Recent Events Section -->
      <h6 class="text-uppercase fw-semibold mt-4 mb-3 text-muted">Events:</h6>
      <div v-if="recentEvents.length === 0" class="text-center mt-3">
        <p class="text-muted mb-0">No upcoming events</p>
      </div>
      <div 
        v-else
        v-for="event in recentEvents" 
        :key="event.date"
        class="mini-stats-wid d-flex align-items-center mt-3"
      >
        <div class="flex-shrink-0 avatar-sm">
          <span class="mini-stat-icon avatar-title rounded-circle text-success bg-success-subtle fs-4">
            {{ event.date }}
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <h6 class="mb-1">{{ event.title }}</h6>
          <p class="text-muted mb-0">{{ event.company }}</p>
          <span 
            class="badge rounded-pill mt-1"
            :class="{
              'text-success bg-success-subtle': event.status === 'running',
              'text-warning bg-warning-subtle': event.status === 'scheduled',
              'text-info bg-info-subtle': event.status === 'completed',
              'text-primary bg-primary-subtle': event.status === 'pending'
            }"
          >
            {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
          </span>
        </div>
        <div class="flex-shrink-0">
          <p class="text-muted mb-0">
            {{ event.time }} <span class="text-uppercase">{{ event.period }}</span>
          </p>
        </div>
      </div>

     

      <!-- Campaign Metrics -->
      <div v-if="metrics" class="campaign-metrics mt-4">
        <h6>Campaign Performance</h6>
        <div class="table-responsive">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Sends</td>
                <td>{{ metrics.dailyMetrics?.[0]?.metrics?.totalSends?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Delivered</td>
                <td>{{ metrics.totals?.emails_delivered?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Delivery Rate</td>
                <td>{{ (metrics.rates?.delivery_rate || 0).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Unique Opens</td>
                <td>{{ metrics.dailyMetrics?.[0]?.metrics?.uniqueOpenClicks?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Open Rate</td>
                <td>{{ (metrics.dailyMetrics?.[0]?.metrics?.openRate || 0).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Total Clicks</td>
                <td>{{ metrics.dailyMetrics?.[0]?.metrics?.totalClicks?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Click-to-Open Rate</td>
                <td>{{ (metrics.dailyMetrics?.[0]?.metrics?.clickToOpenRate || 0).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Click Through Rate</td>
                <td>{{ (metrics.dailyMetrics?.[0]?.metrics?.clickThruRate || 0).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Unsubscribes</td>
                <td>{{ metrics.dailyMetrics?.[0]?.metrics?.uniqueUnsubscribers?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Unsubscribe Rate</td>
                <td>{{ (metrics.dailyMetrics?.[0]?.metrics?.unsubscribeRate || 0).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Entries</td>
                <td>{{ metrics.totals?.entries?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Dealer Leads</td>
                <td>{{ metrics.dailyMetrics?.[0]?.metrics?.dealerLeads?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Total Leads</td>
                <td>{{ metrics.totals?.leads?.toLocaleString() || 0 }}</td>
              </tr>
              <tr>
                <td>Conversion Rate</td>
                <td>{{ (metrics.rates?.conversion_rate || 0).toFixed(2) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template>

<style lang="scss">
.flatpickr-calendar {
  .highlighted {
    background-color: var(--vz-primary-subtle);
    border-color: var(--vz-primary);
  }
}

.flatpickr-calendar {
  .flatpickr-day {
    &.selected,
    &.startRange,
    &.endRange,
    &.inRange {
      background: var(--vz-primary);
      border-color: var(--vz-primary);
      color: white;
      
      &:hover {
        background: var(--vz-primary);
        border-color: var(--vz-primary);
      }
    }
    
    &.inRange {
      background: var(--vz-primary-subtle);
      border-color: var(--vz-primary-subtle);
      color: var(--vz-primary);
      
      &:hover {
        background: var(--vz-primary-subtle);
        color: var(--vz-primary);
      }
    }
  }
}

/* Style adjustments for the date selector in dropdown */
.custom-date-selector {
  min-width: 280px;
}

/* Ensure dropdown stays open when interacting with date selector */
:deep(.dropdown-menu.show) {
  display: block !important;
}

/* Prevent dropdown from closing when typing in search */
.dropdown-menu {
  .px-3.py-2 {
    cursor: default;
  }
}

/* Match dropdown item styling */
.dropdown-item {
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: var(--vz-dropdown-link-color);
  &:hover {
    background-color: var(--vz-dropdown-link-hover-bg);
    color: var(--vz-dropdown-link-hover-color);
  }
  &.active {
    background-color: var(--vz-dropdown-link-active-bg);
    color: var(--vz-dropdown-link-active-color);
  }
}

/* Update dropdown button styles */
:deep(.btn-soft-primary) {
  text-align: left;
  
  &:not(:hover) {
    background-color: var(--vz-light);
    border-color: var(--vz-border-color);
  }
}

/* Style for the Go button */
.btn-success {
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.campaign-metrics {
  font-size: 0.875rem;
}

.table th {
  font-weight: 600;
  background-color: var(--vz-light);
}

.table td {
  vertical-align: middle;
}

/* Add these styles to match analytics */
.btn-group {
  display: flex;
}

.dropdown {
  flex: 1;
}

.form-control {
  border-radius: 4px;
}

.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
