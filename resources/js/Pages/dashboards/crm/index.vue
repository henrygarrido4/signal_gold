<script>
import { Link, Head } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import Widget from "./widget.vue";
import Widget2 from "./widget2.vue";
import Project from "./projects.vue";
import Chart from "./chart.vue";
import Schedules from "./schedule.vue";
import SalesForecast from "./forecast.vue";
import DealType from "./deal-type.vue";
import BalanceOverview from "./balance-overview.vue";
import DealStatus from "./deals-status.vue";
import Tasks from "./tasks.vue";
import UpcomingActivity from "./activities.vue";
import ClosingDeals from "./closing-deals.vue";
import CampaignSchedule from "@/Components/CampaignSchedule.vue";
import CampaignMetricsTable from "@/Components/CampaignMetricsTable.vue";
import DateSelector from "@/Pages/dashboards/analytics/date-selector.vue";
import AnalyticsWidget from '@/Pages/dashboards/analytics/analytics-widget.vue';
import TableauDashboard from "@/Components/TableauDashboard.vue";
import tableauService from "@/services/tableauService.js";

export default {
  components: {
    Layout,
    PageHeader,
    Widget,
    Widget2,
    Project,
    Chart,
    Schedules,
    SalesForecast,
    DealType,
    BalanceOverview,
    DealStatus,
    Tasks,
    UpcomingActivity,
    ClosingDeals,
    CampaignSchedule,
    CampaignMetricsTable,
    DateSelector,
    AnalyticsWidget,
    TableauDashboard
  },
  data() {
    return {
      selectedCampaign: '',
      dateRange: '',
      comparisonPeriod: 'month',
      showDatePicker: false,
      snapshots: [],
      campaigns: [
        { value: '', text: 'Select a campaign' },
        { value: 'campaign1', text: 'Campaign 1' },
        { value: 'campaign2', text: 'Campaign 2' },
        { value: 'campaign3', text: 'Campaign 3' }
      ],
      campaignAMetrics: {
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
      },
      analyticsData: {},
      campaignSearch: '',
      periodSearch: '',
      startDate: '',
      endDate: '',
      periodOptions: [
        { value: 'day', text: 'Day over Day' },
        { value: 'month', text: 'Month over Month' },
        { value: 'year', text: 'Year over Year' },
        { value: 'custom', text: 'Custom Range' }
      ],
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
        },
        previousPeriod: {
          totals: {
            emails_sent: 0,
            emails_delivered: 0,
            emails_opened: 0,
            clicks: 0,
            visitors: 0,
            entries: 0,
            leads: 0,
            conversions: 0
          },
          rates: {
            delivery_rate: 0,
            open_rate: 0,
            click_through_rate: 0,
            conversion_rate: 0,
            lead_conversion_rate: 0
          }
        },
        mtd: {},
        wow: {},
        yoy: {},
        status: {}
      },
      loading: false,
      campaignOptions: [
        { value: null, text: 'Select a campaign' }
      ],
      isTableauLoading: true,
      isDashboardMinimized: true,
      allCampaignNames: [],
      campaignMetrics: {},
      showSignInAlert: false
    }
  },
  computed: {
    filteredCampaigns() {
      const search = this.campaignSearch.toLowerCase();
      return this.campaigns.filter(campaign => 
        campaign.text.toLowerCase().includes(search)
      );
    },
    filteredPeriods() {
      const search = this.periodSearch.toLowerCase();
      return this.periodOptions.filter(period => 
        period.text.toLowerCase().includes(search)
      );
    }
  },
  methods: {
    async fetchMetrics() {
      // Temporarily comment out API call until endpoint is ready
      /*
      try {
        const response = await axios.get('/api/campaign-metrics', {
          params: {
            campaign: this.selectedCampaign,
            start_date: this.startDate,
            end_date: this.endDate
          }
        });
        this.metrics = response.data;
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      }
      */
    },
    handlePeriodSelection({ start, end }) {
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.dateRange = `${this.startDate} to ${this.endDate}`;
      this.fetchMetrics();
    },
    formatDate(date) {
      return date.toISOString().split('T')[0];
    },
    downloadCampaignData() {
      window.location.href = `/campaign-performance/download?campaign=${this.selectedCampaign}&start_date=${this.dateRange.start}&end_date=${this.dateRange.end}`;
    },
    async handleFetchData({ campaignId, dates }) {
      try {
        // Show loading state
        this.loading = true;

        // Fetch the data
        const response = await axios.get('/api/campaign-metrics', {
          params: {
            campaign_id: campaignId,
            start_date: dates.start.toISOString().split('T')[0],
            end_date: dates.end.toISOString().split('T')[0]
          }
        });

        // Update your data
        this.metrics = response.data;
        this.campaignAMetrics = response.data.currentPeriod;

      } catch (error) {
        console.error('Failed to fetch campaign data:', error);
        this.$toast?.error('Failed to fetch campaign data');
      } finally {
        this.loading = false;
      }
    },
    async handleCampaignNamesUpdated(campaigns) {
      this.campaignNames = campaigns;
      // Get metrics for all campaigns
      const metrics = await tableauService.getCampaignMetrics(campaigns);
      // console.log('Fetched Campaign Metrics:', metrics);
      this.campaignMetrics = metrics;
      
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

    async handleDateSelection({ start, end }) {
      try {
        this.loading = true;
        
        // Debug available fields
        await this.$refs.tableau?.getAvailableFields();
        
        // Apply filter with exact field name from debug output
        if (this.$refs.tableau?.isVizReady) {
          await this.$refs.tableau.applyFilter('Date', [start, end]);
          
          // Update metrics after date filter is applied
          if (this.selectedCampaign) {
            await this.updateCampaignMetrics();
          }
        }
      } catch (error) {
        console.error('Failed to update date range:', error);
      } finally {
        this.loading = false;
      }
    },

    updateTableauFilter(field, value) {
      if (this.$refs.tableau?.isVizReady) {
        if (field === 'Date') {
          // Format dates for Tableau
          const formattedDates = value.map(date => 
            new Date(date).toISOString().split('T')[0]
          );
          this.$refs.tableau.applyFilter(field, formattedDates);
        } else {
          this.$refs.tableau.applyFilter(field, value);
        }
      } else {
        console.warn(`⚠ Cannot apply filter: Tableau is not ready yet.`);
      }
    },

    clearTableauFilters() {
      if (this.$refs.tableau?.isVizReady) {
        this.$refs.tableau.clearFilter("Campaign Name");
        this.$refs.tableau.clearFilter("Date");
      } else {
        console.warn("⚠ Cannot clear filters: Tableau is not ready yet.");
      }
    },

    async handleCampaignSelect(campaign) {
      try {
        this.loading = true;
        this.selectedCampaign = campaign;
        
        if (campaign) {
          await tableauService.applyFilter('Campaign Name', [campaign]);
          
          const metrics = await tableauService.getCampaignMetrics([campaign]);
          if (metrics[campaign]) {
            const tableauMetrics = metrics[campaign];
            
            // Store the daily metrics directly
            const dailyMetrics = tableauMetrics.dailyMetrics;

            // Get all daily metrics and sum them up (for the table display)
            const aggregatedMetrics = Object.values(dailyMetrics).reduce((acc, day) => {
              const metrics = day.metrics;
              return {
                totalSends: (acc.totalSends || 0) + (metrics.totalSends || 0),
                totalDelivered: (acc.totalDelivered || 0) + (metrics.totalDelivered || 0),
                totalClicks: (acc.totalClicks || 0) + (metrics.totalClicks || 0),
                uniqueOpenClicks: (acc.uniqueOpenClicks || 0) + (metrics.uniqueOpenClicks || 0),
                uniqueUnsubscribers: (acc.uniqueUnsubscribers || 0) + (metrics.uniqueUnsubscribers || 0)
              };
            }, {});

            // Calculate rates as before
            const rates = {
              clickThruRate: aggregatedMetrics.totalClicks / aggregatedMetrics.totalDelivered,
              openRate: aggregatedMetrics.uniqueOpenClicks / aggregatedMetrics.totalDelivered,
              clickToOpenRate: 0, // This will be calculated later
              deliveryRate: aggregatedMetrics.totalDelivered / aggregatedMetrics.totalSends,
              unsubscribeRate: aggregatedMetrics.uniqueUnsubscribers / aggregatedMetrics.totalDelivered
            };

            // Calculate average Click-to-Open rate
            const clickToOpenRates = Object.values(dailyMetrics).map(day => day.metrics.clickToOpenRate);
            const totalCTOR = clickToOpenRates.reduce((sum, rate) => sum + rate, 0);
            const averageClickToOpenRate = (totalCTOR / clickToOpenRates.length) * 100;

            // Debug the calculation
            // console.log('Click-to-Open Rates:', {
            //   dailyRates: clickToOpenRates,
            //   total: totalCTOR,
            //   count: clickToOpenRates.length,
            //   average: averageClickToOpenRate
            // });

            rates.clickToOpenRate = averageClickToOpenRate;

            // Debug logs
            // console.log('Aggregated Metrics:', {
            //   totalClicks: aggregatedMetrics.totalClicks,
            //   uniqueOpenClicks: aggregatedMetrics.uniqueOpenClicks,
            //   calculatedCTOR: (aggregatedMetrics.totalClicks / aggregatedMetrics.uniqueOpenClicks) * 100
            // });

            // Store both aggregated and daily metrics
            this.metrics = {
              campaign_id: campaign,
              totals: {
                emails_sent: aggregatedMetrics.totalSends || 0,
                emails_delivered: aggregatedMetrics.totalDelivered || 0,
                entries: tableauMetrics.totals?.entries || 0,
                leads: tableauMetrics.totals?.leads || 0,
                total_clicks: aggregatedMetrics.totalClicks || 0,
                unique_opens: aggregatedMetrics.uniqueOpenClicks || 0
              },
              rates: {
                conversion_rate: tableauMetrics.rates?.conversion_rate || 0,
                click_through_rate: (rates.clickThruRate * 100) || 0,
                open_rate: (rates.openRate * 100) || 0,
                click_to_open_rate: rates.clickToOpenRate || 0,
                delivery_rate: (rates.deliveryRate * 100) || 0,
                unsubscribe_rate: (rates.unsubscribeRate * 100) || 0
              },
              trends: tableauMetrics.trends || {},
              dailyMetrics: dailyMetrics // Include the raw daily metrics
            };

            // Debug final metrics
            // console.log('Final metrics:', this.metrics);

            // Update campaignAMetrics to match
            this.campaignAMetrics = {
              totals: this.metrics.totals,
              rates: this.metrics.rates,
              trends: this.metrics.trends
            };

            // console.log('Aggregated Daily Metrics:', aggregatedMetrics);
            // console.log('Calculated Rates:', rates);
            // console.log('Processed Metrics:', this.metrics);
          }
        }
      } catch (error) {
        console.error('Failed to update campaign:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateCampaignMetrics() {
      if (this.selectedCampaign) {
        await this.handleCampaignSelect(this.selectedCampaign);
      }
    }
  },
  watch: {
    comparisonPeriod(newValue) {
      this.showDatePicker = newValue === 'custom';
      if (newValue !== 'custom') {
        this.dateRange = '';
        this.startDate = '';
        this.endDate = '';
      }
    },
    selectedCampaign: {
      async handler(newVal) {
        if (newVal) {
          this.updateTableauFilter("Campaign Name", [newVal]);
          await this.handleCampaignSelect(newVal);
        } else {
          this.clearTableauFilters();
        }
      }
    }
  },
  mounted() {
    this.fetchMetrics();
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
    <PageHeader title="CRM" pageTitle="Dashboards" />

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
      <BCol xl="12">
        <Widget :metrics="metrics" />
      </BCol>
    </BRow>

    <BRow class="project-wrapper">
      <BCol cols="12" xxl="4">
        <Schedules 
          :campaign-options="campaignOptions"
          :selected-campaign="selectedCampaign"
          :all-campaign-names="allCampaignNames"
          @update:selected-campaign="selectedCampaign = $event"
          @period-selected="handleDateSelection"
        />
      </BCol>
      <BCol cols="12" xxl="8">
        <BRow>
          <BCol xl="12">
            <Chart 
              :metrics="metrics" 
              :selected-period="{
                startDate: startDate,
                endDate: endDate
              }"
            />
          </BCol>
        </BRow>
      </BCol>  
    </BRow>

    <!-- Detailed Metrics Table -->
    <BRow class="mt-4">
      <BCol lg="12">
        <CampaignMetricsTable 
          :metrics="metrics" 
          :selected-campaign="selectedCampaign"
          :snapshots="snapshots"
        />
      </BCol>
    </BRow>
  </Layout>
</template>

