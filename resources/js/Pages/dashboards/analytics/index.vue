<script>
import { AlertTriangleIcon } from '@zhuowenli/vue-feather-icons';
import { Link, Head } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import AudiencesMetrics from "./audiences-metrics.vue";
import AudiencesSessions from "./audiences-sessions.vue";
import Country from "./country.vue";
import Referrals from "./referrals.vue";
import SessionsCounties from "./sessions-countries.vue";
import TopPages from "./top-pages.vue";
import Users from "./users.vue";
import CampaignComparisonResults from "./campaign-comparison-results.vue";
import CampaignWidget from "./campaign-widget.vue";
import StatisticalSignificance from "./statistical-significance.vue";
import DateSelector from './date-selector.vue';
import SaveToSnapshotButton from "@/Components/SaveToSnapshotButton.vue";
import AnalyticsWidget from './analytics-widget.vue';
import TableauDashboard from "@/Components/TableauDashboard.vue";
import axios from 'axios';
import tableauService from "@/services/tableauService.js";
import CampaignPerformanceChart from "./campaign-performance-chart.vue";

export default {
  components: {
    AlertTriangleIcon,
    Layout,
    PageHeader,
    AudiencesSessions,
    AudiencesMetrics,
    Country,
    Referrals,
    SessionsCounties,
    TopPages,
    Users,
    Link,
    Head,
    CampaignComparisonResults,
    CampaignWidget,
    StatisticalSignificance,
    flatPickr,
    DateSelector,
    SaveToSnapshotButton,
    AnalyticsWidget,
    TableauDashboard,
    CampaignPerformanceChart
  },
  data() {
    return {
      selectedCampaigns: ['', ''],
      campaignOptions: [
        { value: null, text: 'Select a campaign' }
      ],
      allGroups: false,
      isLoadingGroups: false,
      isDashboardMinimized: true,  // Start minimized
      isTableauLoading: true,
      campaignAMetrics: null,
      campaignBMetrics: null,
      comparisonPeriod: 'mtd',
      periodOptions: [
        { value: 'custom', text: 'Custom Range' }
      ],
      dateRange: '',
      showDatePicker: false,
      campaignSearchA: '',
      campaignSearchB: '',
      dateConfig: {
        mode: 'range',
        maxDate: 'today',
        dateFormat: 'Y-m-d',
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            this.dateRange = selectedDates.map(date => this.formatDate(date)).join(' to ');
            [this.startDate, this.endDate] = selectedDates.map(date => this.formatDate(date));
          }
        }
      },
      startDate: '',
      endDate: '',
      metrics: {
        currentPeriod: {
          totals: {
            emails_delivered: 0,
            entries: 0,
            leads: 0
          },
          rates: {
            conversion_rate: 0
          },
          trends: {
            delivery_rate: 0,
            entry_rate: 0,
            lead_rate: 0,
            conversion_trend: 0
          }
        }
      },
      allCampaignNames: [],
      campaignMetrics: {},  // Will store metrics for each campaign
      allCampaignMetrics: {},  // Will be populated from Tableau data
      showSignInAlert: false
    }
  },
  computed: {
    extraCampaigns() {
      return this.selectedCampaigns.slice(2)
    },
    today() {
      return new Date().toISOString().split('T')[0];
    },
    filteredCampaignsA() {
      if (this.campaignSearchA) {
        const filtered = this.allCampaignNames
          .filter(name => 
            name.toLowerCase().includes(this.campaignSearchA.toLowerCase())
          )
          .slice(0, 6)
          .map(name => ({
            value: name,
            text: name
          }));
        return [
          { value: null, text: 'Select a campaign' },
          ...filtered
        ];
      }
      return this.campaignOptions;
    },
    filteredCampaignsB() {
      if (this.campaignSearchB) {
        const filtered = this.allCampaignNames
          .filter(name => 
            name.toLowerCase().includes(this.campaignSearchB.toLowerCase())
          )
          .slice(0, 6)
          .map(name => ({
            value: name,
            text: name
          }));
        return [
          { value: null, text: 'Select a campaign' },
          ...filtered
        ];
      }
      return this.campaignOptions;
    }
  },
  methods: {
    updateTableauFilter(field, value) {
      if (this.$refs.tableau?.isVizReady) {
        this.$refs.tableau.applyFilter(field, value);
      } else {
        console.warn(`⚠ Cannot apply filter: Tableau is not ready yet.`);
      }
    },

    clearTableauFilters() {
      if (this.$refs.tableau?.isVizReady) {
        this.$refs.tableau.clearFilter("Campaign Name");
        this.$refs.tableau.clearFilter("Email Campaign Groups");
        this.$refs.tableau.clearFilter("Date");
      } else {
        console.warn("⚠ Cannot clear filters: Tableau is not ready yet.");
      }
    },

    async handleCampaignNamesUpdated(campaigns) {
      this.campaignNames = campaigns;
      // Get metrics for all campaigns
      const metrics = await tableauService.getCampaignMetrics(campaigns);
      // console.log('Fetched Campaign Metrics:', metrics);
      this.allCampaignMetrics = metrics;
      
      // Store full list for reference
      this.allCampaignNames = campaigns;
      
      // Get the first 6 campaigns for default view
      const limitedCampaigns = campaigns.slice(0, 6);
      
      // Create the options array with the limited campaigns
      this.campaignOptions = [
        { value: null, text: 'Select a campaign' },
        ...limitedCampaigns.map(name => ({
          value: name,
          text: name
        }))
      ];
    },

    formatTableauDate(date) {
      if (!date) return null;
      // Format date as YYYY-MM-DD
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },

    addCampaignSelector() {
        this.selectedCampaigns.push('');
    },

    removeCampaignSelector(index) {
        this.selectedCampaigns.splice(index, 1);
    },

    compareCampaigns() {
        // Implementation can be added later if needed
        // console.log('Comparing campaigns:', this.selectedCampaigns);
    },

    downloadData() {
        // Implementation can be added later if needed
        // console.log('Downloading data for campaigns:', this.selectedCampaigns);
    },

    async updateCampaignMetrics() {
        const metrics = await tableauService.getCampaignMetrics(this.selectedCampaigns);
        
        // Update Campaign A metrics
        if (metrics && this.selectedCampaigns[0]) {
            this.campaignAMetrics = {
                ...metrics[this.selectedCampaigns[0]],
                campaignName: this.selectedCampaigns[0]
            };
        }
        
        // Update Campaign B metrics
        if (metrics && this.selectedCampaigns[1]) {
            this.campaignBMetrics = {
                ...metrics[this.selectedCampaigns[1]],
                campaignName: this.selectedCampaigns[1]
            };
        }
    }
  },

  watch: {
    comparisonPeriod(newValue) {
      this.showDatePicker = newValue === 'custom';
      if (newValue !== 'custom') {
        // Clear the date filter when switching away from custom
        this.updateTableauFilter('Date', null);
      }
    },
    selectedCampaigns: {
      deep: true,
      async handler(newVal) {
        const selectedCampaigns = newVal.filter(Boolean);
        if (selectedCampaigns.length > 0) {
          this.updateTableauFilter("Campaign Name", selectedCampaigns);
          await this.updateCampaignMetrics();
        } else {
          this.clearTableauFilters();
          this.campaignMetrics = {};
        }
      }
    },
    dateRange(newVal) {
      if (newVal && this.startDate && this.endDate) {
        this.updateTableauFilter("Date", [this.startDate, this.endDate]);
      }
    }
  },

  mounted() {
    setTimeout(() => {
      if (!this.$refs.tableau?.isVizReady) {
        this.showSignInAlert = true;
      }
    }, 5000); // Wait 5 seconds before showing the alert
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Analytics" pageTitle="Dashboards" />

    <BRow class="mb-4">
      <BCol cols="12">
        <BCard no-body>
          <BCardHeader>
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <BCardTitle class="mb-0">Email Analytics Dashboard</BCardTitle>
                <div class="ms-2">
                  <BSpinner v-if="isTableauLoading" small variant="primary" />
                  <small v-else-if="!$refs.tableau?.isVizReady" class="text-muted">
                    (Not signed in)
                  </small>
                </div>
              </div>
              <BButton
                variant="soft-primary"
                size="sm"
                @click="isDashboardMinimized = !isDashboardMinimized"
              >
                  <i :class="isDashboardMinimized ? 'ri-fullscreen-line' : 'ri-fullscreen-exit-line'" />
                  {{ isDashboardMinimized ? 'Expand' : 'Minimize' }}
              </BButton>
            </div>
          </BCardHeader>
          <div v-if="showSignInAlert && !$refs.tableau?.isVizReady && isDashboardMinimized" 
               class="alert alert-warning m-3 d-flex align-items-center" 
               role="alert">
            <i class="ri-error-warning-line me-2"></i>
            Please verify that you are signed in to Tableau Cloud. If you're already signed in, the visualization may take a moment to load.
          </div>
          <BCardBody>
            <TableauDashboard 
              ref="tableau"
              vizUrl="https://us-west-2b.online.tableau.com/t/cars/views/EmailDashboards/EmailDashboard"
              :height="isDashboardMinimized ? '0' : '800'"
              @campaign-names-updated="handleCampaignNamesUpdated"
              @loading="isTableauLoading = $event"
            />
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <BRow>
      <BCol xxl="8" lg="12" cols="12">
        <div class="h-100 d-flex flex-column">
          <BCard no-body class="mb-4">
            <BCardBody>
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="card-title mb-2">Campaign Comparison</h5>
              </div>
              <BRow>
                <BCol md="4" sm="12" class="mb-3">
                  <BButtonGroup class="w-100">
                    <BDropdown
                      variant="primary"
                      :text="selectedCampaigns[0] || 'Select Campaign A'"
                      class="w-100"
                    >
                      <div class="px-3 py-2" @click.stop>
                        <BFormInput
                          v-model="campaignSearchA"
                          type="search"
                          placeholder="Search campaigns..."
                          class="form-control"
                          @click.stop
                          @keydown.stop
                        />
                      </div>
                      <BDropdownDivider />
                      <BDropdownItem
                        v-for="option in filteredCampaignsA"
                        :key="option.value"
                        @click="() => {
                          selectedCampaigns[0] = option.value;
                          updateTableauFilter('Campaign Name', selectedCampaigns.filter(Boolean));
                        }"
                        :active="selectedCampaigns[0] === option.value"
                      >
                        {{ option.text }}
                      </BDropdownItem>
                    </BDropdown>
                  </BButtonGroup>
                </BCol>
                <BCol md="4" sm="12" class="mb-3">
                  <BButtonGroup class="w-100">
                    <BDropdown
                      variant="primary"
                      :text="selectedCampaigns[1] || 'Select Campaign B'"
                      class="w-100"
                    >
                      <div class="px-3 py-2" @click.stop>
                        <BFormInput
                          v-model="campaignSearchB"
                          type="search"
                          placeholder="Search campaigns..."
                          class="form-control"
                          @click.stop
                          @keydown.stop
                        />
                      </div>
                      <BDropdownDivider />
                      <BDropdownItem
                        v-for="option in filteredCampaignsB"
                        :key="option.value"
                        @click="() => {
                          selectedCampaigns[1] = option.value;
                          updateTableauFilter('Campaign Name', selectedCampaigns.filter(Boolean));
                        }"
                        :active="selectedCampaigns[1] === option.value"
                      >
                        {{ option.text }}
                      </BDropdownItem>
                    </BDropdown>
                  </BButtonGroup>
                </BCol>
                <BCol md="3" sm="11" class="mb-3">
                  <BButtonGroup class="w-100">
                    <BDropdown
                      variant="primary"
                      :text="periodOptions.find(p => p.value === comparisonPeriod)?.text || 'Select Period'"
                      class="w-100"
                    >
                      <BDropdownItem
                        v-for="option in periodOptions"
                        :key="option.value"
                        @click="comparisonPeriod = option.value"
                        :active="comparisonPeriod === option.value"
                      >
                        {{ option.text }}
                      </BDropdownItem>
                    </BDropdown>
                  </BButtonGroup>
                </BCol>
                <BCol md="1" sm="1" class="mb-3 d-flex align-items-start">
                  <BButton
                    v-b-tooltip.hover
                    title="Show all campaign groups"
                    variant="outline-primary"
                    :pressed="allGroups"
                    :disabled="isLoadingGroups"
                    @click="async () => {
                      try {
                        isLoadingGroups = true;
                        allGroups = !allGroups;
                        const value = allGroups ? 'All' : null;
                        await updateTableauFilter('Email Campaign groups ', value);
                        // Refresh campaigns after filter change
                        await this.$refs.tableau?.refreshCampaigns();
                      } catch (error) {
                        console.error('Error toggling groups:', error);
                        this.$toast.error('Failed to update campaign groups');
                        allGroups = !allGroups; // Revert state on error
                      } finally {
                        isLoadingGroups = false;
                      }
                    }"
                  >
                    <template v-if="isLoadingGroups">
                      <BSpinner small />
                    </template>
                    <template v-else>
                      <i class="ri-eye-line align-middle"></i>
                    </template>
                  </BButton>
                </BCol>
              </BRow>

              <!-- Custom Date Range -->
              <BRow v-if="showDatePicker" class="mb-3">
                <BCol md="12">
                  <DateSelector
                    @period-selected="async ({ start, end }) => {
                      // Debug available fields
                      await this.$refs.tableau?.getAvailableFields();
                      // Apply filter with exact field name from debug output
                      updateTableauFilter('Date', [start, end]);
                      // Update metrics after date filter is applied
                      await this.updateCampaignMetrics();
                    }"
                  />
                </BCol>
              </BRow>

              <!-- Additional Campaign Selectors -->
              <BRow v-if="selectedCampaigns.length > 2">
                <BCol md="4" v-for="(_, index) in extraCampaigns" :key="index + 2" class="mb-3">
                  <div class="d-flex gap-2">
                    <BFormSelect
                      v-model="selectedCampaigns[index + 2]"
                      :options="campaignOptions"
                      :placeholder="`Select Campaign ${String.fromCharCode(67 + index)}`"
                    />
                    <BButton
                      variant="outline-danger"
                      size="sm"
                      @click="removeCampaignSelector(index + 2)"
                    >
                      ×
                    </BButton>
                  </div>
                </BCol>
              </BRow>
            </BCardBody>
          </BCard>

          <!-- Campaign A Metrics -->
          <BRow class="mb-4">
            <BCol cols="12">
              <h5 class="mb-3 text-muted">{{ selectedCampaigns[0] || 'Campaign A' }}</h5>
            </BCol>
            <analytics-widget
              title="Delivered"
              :value="campaignAMetrics?.totals?.emails_delivered || 0"
              :trend="campaignAMetrics?.trends?.delivery_rate || 0"
              icon="ri-mail-send-line"
              color="primary"
            />

            <analytics-widget
              title="Entries"
              :value="campaignAMetrics?.totals?.entries || 0"
              :trend="campaignAMetrics?.trends?.entry_rate || 0"
              icon="ri-user-add-line"
              color="success"
            />

            <analytics-widget
              title="Leads"
              :value="campaignAMetrics?.totals?.leads || 0"
              :trend="campaignAMetrics?.trends?.lead_rate || 0"
              icon="ri-team-line"
              color="warning"
            />

            <analytics-widget
              title="Conversion Rate"
              :value="campaignAMetrics?.rates?.conversion_rate || 0"
              :trend="campaignAMetrics?.trends?.conversion_trend || 0"
              suffix="%"
              icon="ri-percent-line"
              color="info"
            />
          </BRow>

          <!-- Campaign B Metrics -->
          <BRow class="mb-4">
            <BCol cols="12">
              <h5 class="mb-3 text-muted">{{ selectedCampaigns[1] || 'Campaign B' }}</h5>
            </BCol>
            <analytics-widget
              title="Delivered"
              :value="campaignBMetrics?.totals?.emails_delivered || 0"
              :trend="campaignBMetrics?.trends?.delivery_rate || 0"
              icon="ri-mail-send-line"
              color="primary"
            />

            <analytics-widget
              title="Entries"
              :value="campaignBMetrics?.totals?.entries || 0"
              :trend="campaignBMetrics?.trends?.entry_rate || 0"
              icon="ri-user-add-line"
              color="success"
            />

            <analytics-widget
              title="Leads"
              :value="campaignBMetrics?.totals?.leads || 0"
              :trend="campaignBMetrics?.trends?.lead_rate || 0"
              icon="ri-team-line"
              color="warning"
            />

            <analytics-widget
              title="Conversion Rate"
              :value="campaignBMetrics?.rates?.conversion_rate || 0"
              :trend="campaignBMetrics?.trends?.conversion_trend || 0"
              suffix="%"
              icon="ri-percent-line"
              color="info"
            />
          </BRow>
        </div>
      </BCol>
      <BCol xxl="4" lg="12" cols="12">
        <CampaignComparisonResults 
          :selected-campaigns="selectedCampaigns"
          :campaign-a-metrics="campaignAMetrics"
          :campaign-b-metrics="campaignBMetrics"
        />
      </BCol>
    </BRow>

    <BRow>
      <BCol lg="12">
        <CampaignPerformanceChart
          :campaign-a-metrics="campaignAMetrics"
          :campaign-b-metrics="campaignBMetrics"
          :selected-campaigns="selectedCampaigns"
        />
      </BCol>
    </BRow>

    <BRow>
      <BCol xl="6" md="6">
        <TopPages :all-campaign-metrics="allCampaignMetrics" />
      </BCol>
      <BCol xl="6" md="6">
        <StatisticalSignificance 
          :campaign-a-metrics="campaignAMetrics"
          :campaign-b-metrics="campaignBMetrics"
          :selected-campaigns="selectedCampaigns"
        />
      </BCol>
    </BRow>

  </Layout>
</template>


