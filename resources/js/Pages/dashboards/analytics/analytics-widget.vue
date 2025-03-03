<template>
  <BCol xl="3" md="6">
    <BCard no-body class="card-animate">
      <BCardBody>
        <div class="d-flex align-items-center">
          <div class="flex-grow-1">
            <p class="text-uppercase fw-medium text-muted mb-0">
              {{ title }}
            </p>
          </div>
        </div>
        <div class="d-flex align-items-end justify-content-between mt-4">
          <div>
            <h4 class="fs-22 fw-semibold ff-secondary mb-4">
              {{ prefix }}<count-to :startVal="0" :endVal="value" :duration="2000"></count-to>{{ suffix }}
            </h4>
            <BLink v-if="link" :href="link.url" class="text-decoration-underline">{{ link.text }}</BLink>
          </div>
          <div class="avatar-sm flex-shrink-0">
            <span class="avatar-title bg-success-subtle rounded fs-3">
              <i :class="`${icon} text-${color}`"></i>
            </span>
          </div>
        </div>
      </BCardBody>
    </BCard>
  </BCol>
</template>

<script>
import { CountTo } from "vue3-count-to";

export default {
  components: {
    CountTo
  },
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    trend: {
      type: Number,
      default: 0
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'success'
    },
    icon: {
      type: String,
      required: true
    },
    link: {
      type: Object,
      default: null
    }
  },
  computed: {
    trendColor() {
      return this.trend >= 0 ? 'success' : 'danger';
    },
    trendDirection() {
      return this.trend >= 0 ? 'right-up' : 'right-down';
    }
  }
}
</script>

<style scoped>
.card-animate {
  transition: all 0.3s ease-in-out;
}

.card-animate:hover {
  transform: translateY(-5px);
}
</style> 