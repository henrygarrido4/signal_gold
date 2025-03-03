<script>
import { SendIcon, UserPlusIcon, UsersIcon, TrendingUpIcon } from '@zhuowenli/vue-feather-icons';

export default {
  setup() {
    return {
      emailWidgets: [
        {
          id: 1,
          feaIcon: "send",
          feaIconClass: "primary",
          label: "Delivered",
          counter: "124,125",
          badgeClass: "success",
          icon: "ri-arrow-up-s-line",
          percentage: "8.5%",
          caption: "Delivery rate",
        },
        {
          id: 2,
          feaIcon: "user-plus",
          feaIconClass: "info",
          label: "Entries",
          counter: "28,519",
          badgeClass: "success",
          icon: "ri-arrow-up-s-line",
          percentage: "4.6%",
          caption: "New entries",
        },
        {
          id: 3,
          feaIcon: "users",
          feaIconClass: "warning",
          label: "Leads",
          counter: "9,847",
          badgeClass: "danger",
          icon: "ri-arrow-down-s-line",
          percentage: "2.4%",
          caption: "Total leads",
        },
        {
          id: 4,
          feaIcon: "trending-up",
          feaIconClass: "success",
          label: "Conversion Rate",
          counter: "34.8%",
          badgeClass: "success",
          icon: "ri-arrow-up-s-line",
          percentage: "6.2%",
          caption: "Lead to customer rate",
        },
      ],
    };
  },
  components: {
    SendIcon,
    UserPlusIcon,
    UsersIcon,
    TrendingUpIcon
  },
};
</script>

<template>
  <BCol xl="3" v-for="(item, index) of emailWidgets" :key="index">
    <BCard no-body class="card-animate">
      <BCardBody>
        <div class="d-flex align-items-center">
          <div class="avatar-sm flex-shrink-0">
            <span class="avatar-title rounded-2 fs-2" :class="{
              'bg-primary-subtle text-primary': item.feaIcon === 'send',
              'bg-info-subtle text-info': item.feaIcon === 'user-plus',
              'bg-warning-subtle text-warning': item.feaIcon === 'users',
              'bg-success-subtle text-success': item.feaIcon === 'trending-up'
            }">
              <template v-if="item.feaIcon === 'send'">
                <SendIcon size="24" class="text-primary"></SendIcon>
              </template>
              <template v-if="item.feaIcon === 'user-plus'">
                <UserPlusIcon size="24" class="text-info"></UserPlusIcon>
              </template>
              <template v-if="item.feaIcon === 'users'">
                <UsersIcon size="24" class="text-warning"></UsersIcon>
              </template>
              <template v-if="item.feaIcon === 'trending-up'">
                <TrendingUpIcon size="24" class="text-success"></TrendingUpIcon>
              </template>
            </span>
          </div>
          <div class="flex-grow-1 overflow-hidden ms-3">
            <p class="text-uppercase fw-medium text-muted text-truncate mb-3">
              {{ item.label }}
            </p>
            <div class="d-flex align-items-center mb-3">
              <h4 class="flex-grow-1 mb-0">
                <span class="counter-value">{{ item.counter }}</span>
              </h4>
              <span :class="`badge ${item.badgeClass === 'danger' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'} fs-12`">
                <i :class="`${item.icon} fs-13 align-middle me-1`"></i>{{ item.percentage }}
              </span>
            </div>
            <p class="text-muted text-truncate mb-0">{{ item.caption }}</p>
          </div>
        </div>
      </BCardBody>
    </BCard>
  </BCol>
</template>
