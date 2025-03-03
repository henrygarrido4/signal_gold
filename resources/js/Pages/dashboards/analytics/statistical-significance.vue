<script>
export default {
  props: {
    campaignAMetrics: {
      type: Object,
      default: () => null
    },
    campaignBMetrics: {
      type: Object,
      default: () => null
    },
    selectedCampaigns: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      confidenceLevel: 95,
      result: null
    };
  },
  computed: {
    campaignAValues() {
      return {
        visitors: this.campaignAMetrics?.totals?.entries || 0,
        conversions: Math.round(this.campaignAMetrics?.totals?.leads || 0)
      };
    },
    campaignBValues() {
      return {
        visitors: this.campaignBMetrics?.totals?.entries || 0,
        conversions: Math.round(this.campaignBMetrics?.totals?.leads || 0)
      };
    },
    campaignARate() {
      return this.campaignAValues.visitors ? (this.campaignAValues.conversions / this.campaignAValues.visitors) * 100 : 0;
    },
    campaignBRate() {
      return this.campaignBValues.visitors ? (this.campaignBValues.conversions / this.campaignBValues.visitors) * 100 : 0;
    }
  },
  methods: {
    calculateSignificance() {
      const rate1 = this.campaignAValues.conversions / this.campaignAValues.visitors;
      const rate2 = this.campaignBValues.conversions / this.campaignBValues.visitors;

      // Standard error calculation
      const se1 = Math.sqrt((rate1 * (1 - rate1)) / this.campaignAValues.visitors);
      const se2 = Math.sqrt((rate2 * (1 - rate2)) / this.campaignBValues.visitors);
      const seDiff = Math.sqrt(se1 * se1 + se2 * se2);

      // Z-score calculation
      const zScore = Math.abs((rate1 - rate2) / seDiff);

      // Two-sided test p-value calculation
      const pValue = 2 * (1 - this.normalCDF(zScore));

      this.result = {
        zScore,
        pValue,
        isSignificant: pValue < (1 - this.confidenceLevel / 100),
        improvement: rate2 > rate1 ? 
          ((rate2 - rate1) / rate1) * 100 : 
          ((rate1 - rate2) / rate2) * 100,
        winner: rate2 > rate1 ? 'B' : 'A'
      };
    },
    normalCDF(x) {
      // Approximation of the normal cumulative distribution function
      const t = 1 / (1 + 0.2316419 * Math.abs(x));
      const d = 0.3989423 * Math.exp(-x * x / 2);
      const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      return x > 0 ? 1 - p : p;
    },
    resetCalculator() {
      this.confidenceLevel = 95;
      this.result = null;
    }
  }
}
</script>

<template>
  <BCard no-body>
    <BCardHeader>
      <BCardTitle class="mb-0">Lead Conversion Significance Test</BCardTitle>
    </BCardHeader>
    <BCardBody>
      <BRow>
        <BCol md="6">
          <BFormGroup label="Confidence Level">
            <BFormSelect
              v-model="confidenceLevel"
              :options="[
                { value: 90, text: '90%' },
                { value: 95, text: '95%' },
                { value: 99, text: '99%' }
              ]"
            />
          </BFormGroup>
        </BCol>
      </BRow>

      <div class="mt-4">
        <h6>Campaign A: {{ selectedCampaigns[0] || 'Not Selected' }}</h6>
        <p>
          {{ campaignAValues.conversions.toLocaleString() }} leads from 
          {{ campaignAValues.visitors.toLocaleString() }} entries
          ({{ campaignARate.toFixed(2) }}%)
        </p>

        <h6>Campaign B: {{ selectedCampaigns[1] || 'Not Selected' }}</h6>
        <p>
          {{ campaignBValues.conversions.toLocaleString() }} leads from 
          {{ campaignBValues.visitors.toLocaleString() }} entries
          ({{ campaignBRate.toFixed(2) }}%)
        </p>
      </div>

      <div class="mt-3 d-flex gap-2">
        <BButton variant="primary" @click="calculateSignificance" :disabled="!campaignAValues.visitors || !campaignBValues.visitors">
          Calculate
        </BButton>
        <BButton variant="outline-secondary" @click="resetCalculator">
          Reset
        </BButton>
      </div>

      <div v-if="result" class="mt-4">
        <div :class="[
          'alert',
          result.isSignificant ? 'alert-success' : 'alert-warning'
        ]">
          <h5>{{ result.isSignificant ? 'Statistically Significant!' : 'Not Statistically Significant' }}</h5>
          <p class="mb-0">
            Campaign {{ result.winner }} is {{ result.improvement.toFixed(2) }}% 
            {{ result.winner === 'B' ? 'better' : 'worse' }} with 
            {{ (100 * (1 - result.pValue)).toFixed(2) }}% confidence.
            <br>
            <small class="text-muted">p-value: {{ result.pValue.toExponential(3) }}</small>
          </p>
        </div>
      </div>
    </BCardBody>
  </BCard>
</template> 