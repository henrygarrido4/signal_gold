<script>
import { ref, computed } from 'vue';

export default {
  props: {
    snapshotData: {
      type: Object,
      required: true
    },
    comparisonType: {
      type: String,
      default: 'wow'
    }
  },
  setup(props) {
    const metrics = computed(() => {
      const data = props.snapshotData;
      const periods = Object.keys(data).sort();
      
      return periods.map(period => ({
        period,
        ...data[period].metrics,
        changes: data[period].changes
      }));
    });

    const formatChange = (value) => {
      const sign = value >= 0 ? '+' : '';
      return `${sign}${value}%`;
    };

    return {
      metrics,
      formatChange
    };
  }
}
</script>

<template>
  <div class="comparison-table">
    <table class="table">
      <thead>
        <tr>
          <th>Period</th>
          <th>Emails Sent</th>
          <th>Opens</th>
          <th>Clicks</th>
          <th>Entries</th>
          <th>Leads</th>
          <th>Click Rate</th>
          <th>Conv. Rate</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(period, index) in metrics" :key="period.period">
          <tr>
            <td>{{ period.period }}</td>
            <td>
              {{ period.emails_sent }}
              <small v-if="period.changes" :class="period.changes.emails_sent >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.emails_sent) }}
              </small>
            </td>
            <td>
              {{ period.opens }}
              <small v-if="period.changes" :class="period.changes.opens >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.opens) }}
              </small>
            </td>
            <td>
              {{ period.clicks }}
              <small v-if="period.changes" :class="period.changes.clicks >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.clicks) }}
              </small>
            </td>
            <td>
              {{ period.entries }}
              <small v-if="period.changes" :class="period.changes.entries >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.entries) }}
              </small>
            </td>
            <td>
              {{ period.leads }}
              <small v-if="period.changes" :class="period.changes.leads >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.leads) }}
              </small>
            </td>
            <td>
              {{ period.click_rate }}%
              <small v-if="period.changes" :class="period.changes.click_rate >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.click_rate) }}
              </small>
            </td>
            <td>
              {{ period.conversion_rate }}%
              <small v-if="period.changes" :class="period.changes.conversion_rate >= 0 ? 'text-success' : 'text-danger'">
                {{ formatChange(period.changes.conversion_rate) }}
              </small>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template> 