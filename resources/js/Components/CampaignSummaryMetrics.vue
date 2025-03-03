<template>
  <BCard no-body>
    <BCardHeader>
      <div class="d-flex align-items-center">
        <h5 class="card-title mb-0 flex-grow-1">Campaign Summary</h5>
        <div class="flex-shrink-0">
          <BFormSelect 
            v-model="selectedCampaigns" 
            :options="campaignOptions"
            multiple
            class="form-select-sm"
          />
        </div>
      </div>
    </BCardHeader>
    <BCardBody>
      <BRow>
        <!-- Column Headers -->
        <BCol cols="3" class="text-muted"></BCol>
        <BCol cols="3" class="text-center text-muted">
          <h6 class="text-uppercase fw-semibold">MTD</h6>
        </BCol>
        <BCol cols="3" class="text-center text-muted">
          <h6 class="text-uppercase fw-semibold">WoW %</h6>
        </BCol>
        <BCol cols="3" class="text-center text-muted">
          <h6 class="text-uppercase fw-semibold">YoY %</h6>
        </BCol>
      </BRow>

      <!-- Email Volume Section -->
      <div class="metric-section">
        <h6 class="text-muted text-uppercase fw-semibold mb-3">Email Volume</h6>
        <BRow class="align-items-center mb-2">
          <BCol cols="3">
            <p class="text-muted mb-0">Sent</p>
          </BCol>
          <BCol cols="3" class="text-center">
            <h5 class="mb-0">{{ formatNumber(metrics.emailVolume.mtd) }}</h5>
          </BCol>
          <BCol cols="3" class="text-center">
            <span :class="`badge bg-${getPercentageClass(metrics.emailVolume.wow)} fs-12`">
              {{ formatPercentage(metrics.emailVolume.wow) }}%
            </span>
          </BCol>
          <BCol cols="3" class="text-center">
            <span :class="`badge bg-${getPercentageClass(metrics.emailVolume.yoy)} fs-12`">
              {{ formatPercentage(metrics.emailVolume.yoy) }}%
            </span>
          </BCol>
        </BRow>
      </div>

      <!-- Email Visits Section -->
      <div class="metric-section">
        <h6 class="text-muted text-uppercase fw-semibold mb-3">Visits</h6>
        <BRow class="align-items-center mb-2">
          <BCol cols="3">
            <p class="text-muted mb-0">Email Visits</p>
          </BCol>
          <BCol cols="3" class="text-center">
            <h5 class="mb-0">{{ formatNumber(metrics.emailVisits.mtd) }}</h5>
          </BCol>
          <BCol cols="3" class="text-center">
            <span :class="`badge bg-${getPercentageClass(metrics.emailVisits.wow)} fs-12`">
              {{ formatPercentage(metrics.emailVisits.wow) }}%
            </span>
          </BCol>
          <BCol cols="3" class="text-center">
            <span :class="`badge bg-${getPercentageClass(metrics.emailVisits.yoy)} fs-12`">
              {{ formatPercentage(metrics.emailVisits.yoy) }}%
            </span>
          </BCol>
        </BRow>
      </div>

      <!-- Email Leads Section -->
      <div class="metric-section">
        <h6 class="text-muted text-uppercase fw-semibold mb-3">Leads</h6>
        <BRow class="align-items-center mb-2">
          <BCol cols="3">
            <p class="text-muted mb-0">Email Leads</p>
          </BCol>
          <BCol cols="3" class="text-center">
            <h5 class="mb-0">{{ formatNumber(metrics.emailLeads.mtd) }}</h5>
          </BCol>
          <BCol cols="3" class="text-center">
            <span :class="`badge bg-${getPercentageClass(metrics.emailLeads.wow)} fs-12`">
              {{ formatPercentage(metrics.emailLeads.wow) }}%
            </span>
          </BCol>
          <BCol cols="3" class="text-center">
            <span :class="`badge bg-${getPercentageClass(metrics.emailLeads.yoy)} fs-12`">
              {{ formatPercentage(metrics.emailLeads.yoy) }}%
            </span>
          </BCol>
        </BRow>
      </div>

      <!-- Totals Section -->
      <div class="border-top mt-4 pt-4">
        <h6 class="text-muted text-uppercase fw-semibold mb-3">Campaign Totals</h6>
        <BRow class="align-items-center mb-2">
          <BCol cols="4">
            <p class="text-muted mb-0">Total Volume:</p>
          </BCol>
          <BCol cols="8" class="text-end">
            <h6 class="mb-0">{{ formatNumber(totals.volume) }}</h6>
          </BCol>
        </BRow>
        <BRow class="align-items-center mb-2">
          <BCol cols="4">
            <p class="text-muted mb-0">Total Visits:</p>
          </BCol>
          <BCol cols="8" class="text-end">
            <h6 class="mb-0">{{ formatNumber(totals.visits) }}</h6>
          </BCol>
        </BRow>
        <BRow class="align-items-center">
          <BCol cols="4">
            <p class="text-muted mb-0">Total Leads:</p>
          </BCol>
          <BCol cols="8" class="text-end">
            <h6 class="mb-0">{{ formatNumber(totals.leads) }}</h6>
          </BCol>
        </BRow>
      </div>
    </BCardBody>
  </BCard>
</template>

<script>
export default {
  props: {
    campaignOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedCampaigns: [],
      metrics: {
        emailVolume: {
          mtd: 0,
          wow: 0,
          yoy: 0
        },
        emailVisits: {
          mtd: 0,
          wow: 0,
          yoy: 0
        },
        emailLeads: {
          mtd: 0,
          wow: 0,
          yoy: 0
        }
      }
    }
  },
  computed: {
    totals() {
      return {
        volume: this.metrics.emailVolume.mtd,
        visits: this.metrics.emailVisits.mtd,
        leads: this.metrics.emailLeads.mtd
      }
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat().format(value)
    },
    formatPercentage(value) {
      return value.toFixed(2)
    },
    getPercentageClass(value) {
      return value >= 0 ? 'success' : 'danger'
    },
    async fetchMetrics() {
      try {
        const response = await axios.get('/api/campaign-summary', {
          params: {
            campaigns: this.selectedCampaigns
          }
        });
        this.metrics = response.data;
      } catch (error) {
        console.error('Failed to fetch campaign metrics:', error);
      }
    }
  },
  watch: {
    selectedCampaigns: {
      handler() {
        this.fetchMetrics();
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.metric-section {
  padding: 1rem 0;
  border-bottom: 1px dashed #e9ebec;
}

.metric-section:last-of-type {
  border-bottom: none;
}

.badge {
  min-width: 60px;
}
</style> 