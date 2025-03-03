<script>
import { CountTo } from "vue3-count-to";

export default {
  props: {
    metrics: {
      type: Object,
      default: () => ({
        totals: {
          emails_delivered: 0,
          entries: 0,
          leads: 0,
          emails_sent: 0
        },
        rates: {
          conversion_rate: 0,
          click_through_rate: 0,
          open_rate: 0,
          click_to_open_rate: 0
        },
        trends: {
          delivery_rate: 0,
          entry_rate: 0,
          lead_rate: 0,
          conversion_rate: 0,
          click_through_rate: 0,
          open_rate: 0
        }
      })
    }
  },
  computed: {
    crmWidgets() {
      // Debug logs
      // console.log('Raw metrics:', this.metrics);
      // console.log('Click to open rate:', this.metrics.rates?.click_to_open_rate);
      
      return [
        {
          id: 1,
          label: "Emails Delivered",
          badge: this.getTrendBadge(this.metrics.trends?.delivery_rate),
          icon: "ri-mail-send-line",
          counter: this.metrics.totals?.emails_delivered || 0,
          decimals: 0,
          separator: ",",
          suffix: "",
          prefix: "",
        },
        {
          id: 2,
          label: "Open Rate",
          badge: this.getTrendBadge(this.metrics.trends?.open_rate),
          icon: "ri-mail-open-line",
          counter: this.metrics.rates?.open_rate || 0,
          decimals: 1,
          suffix: "%",
          prefix: "",
        },
        {
          id: 3,
          label: "Click-Through Rate",
          badge: this.getTrendBadge(this.metrics.trends?.click_through_rate),
          icon: "ri-cursor-line",
          counter: this.metrics.rates?.click_through_rate || 0,
          decimals: 1,
          suffix: "%",
          prefix: "",
        },
        {
          id: 4,
          label: "Total Leads",
          badge: this.getTrendBadge(this.metrics.trends?.lead_rate),
          icon: "ri-user-add-line",
          counter: this.metrics.totals?.leads || 0,
          decimals: 0,
          separator: ",",
          suffix: "",
          prefix: "",
        },
        {
          id: 5,
          label: "Conversion Rate",
          badge: this.getTrendBadge(this.metrics.trends?.conversion_rate),
          icon: "ri-exchange-dollar-line",
          counter: this.metrics.rates?.conversion_rate || 0,
          decimals: 1,
          suffix: "%",
          prefix: "",
        },
        {
          id: 6,
          label: "Click-to-Open Rate",
          badge: this.getTrendBadge(this.metrics.trends?.click_to_open_rate),
          icon: "ri-line-chart-line",
          counter: this.metrics.rates?.click_to_open_rate || 0,
          decimals: 1,
          suffix: "%",
          prefix: "",
        },
      ];
    }
  },
  methods: {
    getTrendBadge(trend) {
      if (!trend || trend === 0) return '';
      return trend > 0 
        ? 'ri-arrow-up-circle-line text-success'
        : 'ri-arrow-down-circle-line text-danger';
    }
  },
  components: {
    CountTo
  }
};
</script>

<template>
  <BCard no-body class="crm-widget">
    <BCardBody class="p-0">
      <BRow class="row-cols-xxl-6 row-cols-md-3 row-cols-1 g-0">
        <BCol v-for="widget of crmWidgets" :key="widget.id">
          <div class="py-4 px-3">
            <h5 class="text-muted text-uppercase fs-13 mb-3">
              {{ widget.label }}
              <i v-if="widget.badge" :class="`${widget.badge} fs-18 float-end align-middle`"></i>
            </h5>
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <i :class="`${widget.icon} display-6 fs-3 text-muted`"></i>
              </div>
              <div class="flex-grow-1 ms-3">
                <h4 class="mb-0">
                  {{widget.prefix}}<count-to :startVal='0' :endVal='widget.counter' :duration='2000' :decimals="widget.decimals" :separator="widget.separator"></count-to>{{widget.suffix}}
                </h4>
              </div>
            </div>
          </div>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>
