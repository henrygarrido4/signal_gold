<script>
import SaveToSnapshotButton from '@/Components/SaveToSnapshotButton.vue';
import CampaignMetricsTable from '@/Components/CampaignMetricsTable.vue';
import axios from 'axios';
import { ref, onMounted, watch } from 'vue';

export default {
  components: {
    SaveToSnapshotButton,
    CampaignMetricsTable
  },
  props: {
    campaign: {
      type: String,
      default: ''
    },  
    comparisonPeriod: {
      type: String,
      default: 'month'
    },
    analyticsData: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const performanceData = ref({
      series: [
        {
          name: "Current Period",                                                             
          data: []
        },
        {
          name: "Previous Period",
          data: []
        }
      ],
      chartOptions: {
        chart: {
          type: 'line',
          height: 350,
          toolbar: {
            show: false
          }
        },
        stroke: {
          width: [3, 3],
          curve: 'smooth'
        },
        colors: ['#4b38b3', '#45cb85'],
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100]
          }
        },
        markers: {
          size: 4,
          hover: {
            size: 6
          }
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          title: {
            text: 'Conversion Rate (%)'
          }
        }
      }
    });

    const metrics = ref({
      currentPeriod: {
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
      }
    });

    const detailedMetrics = ref([]);
    const kpis = ref({});
    const trends = ref([]);
    const anomalies = ref([]);

    const fetchCampaignData = async () => {
      if (!props.campaign) {
        console.log('No campaign selected');
        return;
      }

      try {
        const response = await axios.get(`/api/campaign-performance`, {
          params: {
            campaign_names: [props.campaign],
            // Add other params if necessary
          }
        });

        const data = response.data;

        // Process data to update metrics and performanceData
        // Assuming data contains both current and previous period data
        // You may need to adjust based on your actual data structure

        // Example processing:
        metrics.value.currentPeriod = processCurrentPeriod(data);
        metrics.value.previousPeriod = processPreviousPeriod(data);

        // Update performanceData for the chart
        performanceData.value.series = [
          {
            name: "Current Period",
            data: prepareChartData(metrics.value.currentPeriod)
          },
          {
            name: "Previous Period",
            data: prepareChartData(metrics.value.previousPeriod)
          }
        ];

        // Prepare detailedMetrics for the table
        detailedMetrics.value = generateDetailedMetrics(metrics.value);

        // Fetch KPI and Analysis Data
        fetchAnalysisData();
      } catch (error) {
        console.error('Failed to fetch campaign data:', error);
      }
    };

    const processCurrentPeriod = (data) => {
      // Implement processing logic
      // Example:
      return {
        // Populate with processed current period data
      };
    };

    const processPreviousPeriod = (data) => {
      // Implement processing logic
      // Example:
      return {
        // Populate with processed previous period data
      };
    };

    const prepareChartData = (periodData) => {
      // Transform periodData into chart data format
      return periodData.map(item => ({
        x: new Date(item.date).getTime(),
        y: item.conversion_rate
      }));
    };

    const generateDetailedMetrics = (metricsData) => {
      return [
        { label: 'Emails Sent', current: metricsData.currentPeriod.emails_sent, previous: metricsData.previousPeriod.emails_sent, change: calculateChange(metricsData.currentPeriod.emails_sent, metricsData.previousPeriod.emails_sent) },
        // Add other metrics similarly
      ];
    };

    const calculateChange = (current, previous) => {
      if (!previous) return 0;
      return Number(((current - previous) / previous * 100).toFixed(2));
    };

    const fetchAnalysisData = async () => {
      try {
        const response = await axios.get(`/api/campaign-analysis/${props.campaign}`);
        kpis.value = response.data.kpis;
        trends.value = response.data.trends;
        anomalies.value = response.data.anomalies;
      } catch (error) {
        console.error('Failed to fetch analysis data:', error);
      }
    };

    onMounted(() => {
      fetchCampaignData();
    });

    watch(() => props.campaign, () => {
      fetchCampaignData();
    });

    return {
      performanceData,
      metrics,
      detailedMetrics,
      kpis,
      trends,
      anomalies
    };
  },
  methods: {
    getPercentageClass(value) {
      return value > 0 ? 'badge-soft-success' : 'badge-soft-danger';
    },
    processComparisonData(data) {
      const comparison = [];

      // Assuming data contains performance metrics for both campaigns
      const campaignAData = data.filter(item => item.campaign_name === this.selectedCampaigns[0]);
      const campaignBData = data.filter(item => item.campaign_name === this.selectedCampaigns[1]);

      // Example: Compare totals over the selected period
      comparison.push({
        metric: 'Emails Sent',
        campaignA: campaignAData.reduce((sum, item) => sum + item.emails_sent, 0),
        campaignB: campaignBData.reduce((sum, item) => sum + item.emails_sent, 0),
        variance: this.calculateVariance(
          campaignAData.reduce((sum, item) => sum + item.emails_sent, 0),
          campaignBData.reduce((sum, item) => sum + item.emails_sent, 0)
        )
      });

      // Add more metrics as needed

      return comparison;
    },
    calculateVariance(current, previous) {
      if (previous === 0) return '0%';
      const change = ((current - previous) / previous) * 100;
      return `${change.toFixed(2)}%`;
    },
    formatMetric(value) {
      return new Intl.NumberFormat().format(value || 0);
    },
    formatChange(value) {
      return `${(value || 0).toFixed(2)}%`;
    },
    getChangeClass(value) {
      if (!value) return 'secondary';
      return value >= 0 ? 'success' : 'danger';
    },
    formatNumber(value) {
      return new Intl.NumberFormat().format(value || 0);
    },
    formatPercentage(value) {
      return (value || 0).toFixed(2);
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
    }
  },
  computed: {
    emailSentChange() {
      const current = this.metrics.currentPeriod.totals.emails_sent;
      const previous = this.metrics.previousPeriod.totals.emails_sent;
      return previous ? ((current - previous) / previous) * 100 : 0;
    },
    openRateChange() {
      const current = this.metrics.currentPeriod.rates.open_rate;
      const previous = this.metrics.previousPeriod.rates.open_rate;
      return previous ? ((current - previous) / previous) * 100 : 0;
    },
    clickRateChange() {
      const current = this.metrics.currentPeriod.rates.click_through_rate;
      const previous = this.metrics.previousPeriod.rates.click_through_rate;
      return previous ? ((current - previous) / previous) * 100 : 0;
    }
  }
}
</script>

<template>
  <div>
    <!-- Add the button near the top of your metrics display -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4>Campaign Performance</h4>
      <SaveToSnapshotButton
        :data="metrics"
        data-type="campaign"
      />
    </div>

    <!-- Email Marketing Metrics -->
    <BRow class="mb-4">
      <!-- Sends -->
      <BCol md="4" xl="2">
        <BCard class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0">Sends</p>
                <div class="d-flex align-items-center mb-2">
                  <h4 class="fs-4 flex-grow-1 mb-0">{{ metrics.currentPeriod.totals.emails_sent }}</h4>
                  <span class="badge" :class="getPercentageClass(emailSentChange)">
                    {{ emailSentChange }}%
                  </span>
                </div>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-soft-primary rounded fs-3">
                  <i class="ri-mail-send-line"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Email Opens -->
      <BCol md="4" xl="2">
        <BCard class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0">Opens</p>
                <div class="d-flex align-items-center mb-2">
                  <h4 class="fs-4 flex-grow-1 mb-0">{{ metrics.currentPeriod.totals.emails_opened }}</h4>
                  <span class="badge" :class="getPercentageClass(openRateChange)">
                    {{ openRateChange }}%
                  </span>
                </div>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-soft-success rounded fs-3">
                  <i class="ri-mail-open-line text-success"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Click-throughs -->
      <BCol md="4" xl="2">
        <BCard class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0">Click-throughs</p>
                <div class="d-flex align-items-center mb-2">
                  <h4 class="fs-4 flex-grow-1 mb-0">{{ metrics.currentPeriod.totals.clicks }}</h4>
                  <span class="badge" :class="getPercentageClass(clickRateChange)">
                    {{ clickRateChange }}%
                  </span>
                </div>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-soft-warning rounded fs-3">
                  <i class="ri-cursor-line text-warning"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- CTR -->
      <BCol md="4" xl="2">
        <BCard class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0">CTR</p>
                <div class="d-flex align-items-center mb-2">
                  <h4 class="fs-4 flex-grow-1 mb-0">{{ metrics.currentPeriod.rates.click_through_rate }}%</h4>
                  <span class="badge" :class="getPercentageClass(clickRateChange)">
                    {{ clickRateChange }}%
                  </span>
                </div>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-soft-info rounded fs-3">
                  <i class="ri-percent-line text-info"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Entries -->
      <BCol md="4" xl="2">
        <BCard class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0">Entries</p>
                <div class="d-flex align-items-center mb-2">
                  <h4 class="fs-4 flex-grow-1 mb-0">{{ metrics.currentPeriod.totals.entries }}</h4>
                  <span class="badge" :class="getPercentageClass(entryRateChange)">
                    {{ entryRateChange }}%
                  </span>
                </div>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-soft-danger rounded fs-3">
                  <i class="ri-login-circle-line text-danger"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>

      <!-- Conversions -->
      <BCol md="4" xl="2">
        <BCard class="card-animate">
          <BCardBody>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <p class="text-uppercase fw-medium text-muted mb-0">Conversions</p>
                <div class="d-flex align-items-center mb-2">
                  <h4 class="fs-4 flex-grow-1 mb-0">{{ metrics.currentPeriod.totals.conversions }}</h4>
                  <span class="badge" :class="getPercentageClass(conversionRateChange)">
                    {{ conversionRateChange }}%
                  </span>
                </div>
              </div>
              <div class="avatar-sm flex-shrink-0">
                <span class="avatar-title bg-soft-success rounded fs-3">
                  <i class="ri-exchange-dollar-line text-success"></i>
                </span>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Performance Chart -->
    <BRow>
      <BCol lg="8">
        <apexchart
          class="apex-charts"
          height="350"
          :series="performanceData.series"
          :options="performanceData.chartOptions"
        />
      </BCol>
    </BRow>

    <!-- Detailed Metrics Table -->
    <BRow class="mt-4">
      <BCol lg="12">
        <CampaignMetricsTable :metrics="metrics" />
      </BCol>
    </BRow>
  </div>
</template> 




