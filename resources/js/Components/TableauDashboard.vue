<template>
    <div class="tableau-container">
      <template v-if="isScriptLoaded">
        <tableau-viz 
          ref="tableauViz"
          id="tableau-viz" 
          :src="vizUrl"
          :width="width"
          :height="height"
          toolbar="bottom"
          @firstinteractive="handleFirstInteractive"
          @filter-change="handleFilterChange">
        </tableau-viz>
      </template>
      <div v-else class="loading">
        Loading Tableau Dashboard...
      </div>
    </div>
</template>

<script>
import tableauService from '@/services/tableauService';

export default {
  name: "TableauDashboard",
  props: {
    width: {
      type: [String, Number],
      default: "100%",
    },
    height: {
      type: [String, Number],
      default: "800",
    },
    vizUrl: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isScriptLoaded: false,
      pendingFilters: [],
      isVizReady: false
    };
  },
  watch: {
    isVizReady(newValue) {
      this.$emit('loading', !newValue);
    }
  },
  computed: {
  },
  async mounted() {
    try {
      await tableauService.loadTableauScript();
      this.isScriptLoaded = true;
      console.log("✅ Tableau script loaded, waiting for viz initialization...");
    } catch (error) {
      console.error('Failed to initialize Tableau:', error);
    }
  },
  methods: {
    async handleFirstInteractive(event) {
      if (tableauService.handleVizInit(event.target)) {
        this.isVizReady = true;
        console.log('✅ Tableau viz is ready');
        // Get initial campaign names
        await this.refreshCampaigns();
      }
    },
    async updateCampaignNames() {
      const campaignNames = await tableauService.getCampaignNames();
      if (campaignNames.length > 0) {
        this.$emit('campaign-names-updated', campaignNames);
      }
    },
    applyFilter(fieldName, value) {
      if (!this.isVizReady) {
        this.pendingFilters.push({ fieldName, value });
        return;
      }
      return tableauService.applyFilter(fieldName, value);
    },
    clearFilter(fieldName) {
      if (!this.isVizReady) {
        this.pendingFilters = this.pendingFilters.filter(f => f.fieldName !== fieldName);
        return;
      }
      return tableauService.clearFilter(fieldName);
    },
    handleFilterChange(event) {
      // console.log("Filter changed:", event);
    },
    async refreshCampaigns() {
      const campaigns = await tableauService.getCampaignNames();
      this.$emit('campaign-names-updated', campaigns);
      return campaigns;
    },
    async getAvailableFields() {
      return tableauService.getAvailableFields();
    },
    getCampaignMetrics(campaignNames) {
      return tableauService.getCampaignMetrics(campaignNames);
    }
  },
};
</script>

<style scoped>
.tableau-container {
  width: 100%;
  overflow-x: auto;
}

.loading {
  padding: 2rem;
  text-align: center;
}
</style>
