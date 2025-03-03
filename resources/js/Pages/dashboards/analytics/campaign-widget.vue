<script>
import { 
  TruckIcon, 
  InboxIcon, 
  UserPlusIcon, 
  BarChart2Icon 
} from '@zhuowenli/vue-feather-icons';

export default {
  components: {
    TruckIcon,
    InboxIcon,
    UserPlusIcon,
    BarChart2Icon
  },
  props: {
    campaign: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      stats: [
        {
          title: "Total Delivered",
          value: "0",
          percentage: "0%",
          component: 'TruckIcon',
          color: "primary"
        },
        {
          title: "Total Entries",
          value: "0",
          percentage: "0%",
          component: 'InboxIcon',
          color: "success"
        },
        {
          title: "Total Leads",
          value: "0",
          percentage: "0%",
          component: 'UserPlusIcon',
          color: "warning"
        },
        {
          title: "Conversion Rate",
          value: "0%",
          percentage: "0%",
          component: 'BarChart2Icon',
          color: "info"
        }
      ]
    };
  }
};
</script>

<template>
  <BCard no-body>
    <BCardBody>
      <h5 class="card-title mb-4">Campaign {{ campaign }} Metrics</h5>
      <BRow>
        <BCol sm="6" xl="3" v-for="(stat, index) in stats" :key="index">
          <BCard class="card-animate">
            <BCardBody>
              <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                  <h6 class="text-muted mb-3">{{ stat.title }}</h6>
                  <h2 class="mb-0">
                    {{ stat.value }}
                    <span
                      class="text-success fs-13 mb-0 ms-1"
                    >
                      {{ stat.percentage }}
                    </span>
                  </h2>
                </div>
                <div class="flex-shrink-0">
                  <div :class="`avatar-sm rounded-circle bg-${stat.color}-subtle`">
                    <span class="avatar-title rounded-circle" :class="`bg-${stat.color}-subtle`">
                      <component 
                        :is="stat.component"
                        :class="`text-${stat.color}`"
                        size="24"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </BCardBody>
          </BCard>
        </BCol>
      </BRow>
    </BCardBody>
  </BCard>
</template>

