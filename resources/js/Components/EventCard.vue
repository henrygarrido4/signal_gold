<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EventCard',
  props: {
    log: {
      type: Object,
      required: true
    }
  },
  methods: {
    getStatusClass(status) {
      return {
        'bg-success-subtle': status === 'running',
        'bg-warning-subtle': status === 'scheduled',
        'bg-info-subtle': status === 'completed',
        'bg-primary-subtle': status === 'pending'
      };
    },
    getStatusBadgeClass(status) {
      return {
        'badge-soft-success': status === 'running',
        'badge-soft-warning': status === 'scheduled',
        'badge-soft-info': status === 'completed',
        'badge-soft-primary': status === 'pending'
      };
    },
    getIconClass(status) {
      return {
        'text-success': status === 'running',
        'text-warning': status === 'scheduled',
        'text-info': status === 'completed',
        'text-primary': status === 'pending'
      };
    }
  },
  emits: ['edit', 'delete']
});
</script>

<template>
  <BCard no-body class="card-height-100" :class="[getStatusClass(log.status), 'shadow-none', 'bg-opacity-10']">
    <BCardBody>
      <BDropdown variant="link" right toggle-class="text-decoration-none arrow-none p-0" class="float-end" no-caret>
        <template #button-content> 
          <span class="text-muted fs-18"><i class="mdi mdi-dots-vertical"></i></span>
        </template>
        <BDropdownItem @click="$emit('edit', log)">Edit</BDropdownItem>
        <BDropdownItem @click="$emit('delete', log)">Delete</BDropdownItem>
      </BDropdown>

      <div class="mb-4 pb-2">
        <div class="avatar-sm">
          <span class="avatar-title rounded-circle" :class="getStatusClass(log.status)">
            <i :class="[log.icon_class, 'fs-4', getIconClass(log.status)]"></i>
          </span>
        </div>
      </div>
      <BLink href="#!">
        <h6 class="fs-15 fw-semibold">
          {{ log.title }}
          <span class="badge rounded-pill ms-1" :class="getStatusBadgeClass(log.status)">
            {{ log.status.charAt(0).toUpperCase() + log.status.slice(1) }}
          </span>
        </h6>
      </BLink>
      <p class="text-muted mb-2">{{ log.description }}</p>
      <p class="text-muted mb-0 small">
        <i class="ri-calendar-line align-bottom me-1"></i> 
        {{ new Date(log.timestamp).toLocaleString('en-US', {
          month: 'numeric',
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        }) }}
      </p>
    </BCardBody>
  </BCard>
</template>

<style lang="scss" scoped>
.badge-soft-success {
  color: var(--vz-success);
  background-color: rgba(var(--vz-success-rgb), 0.1);
}

.badge-soft-warning {
  color: var(--vz-warning);
  background-color: rgba(var(--vz-warning-rgb), 0.1);
}

.badge-soft-info {
  color: var(--vz-info);
  background-color: rgba(var(--vz-info-rgb), 0.1);
}

.badge-soft-primary {
  color: var(--vz-primary);
  background-color: rgba(var(--vz-primary-rgb), 0.1);
}

.avatar-title {
  i {
    opacity: 1;
    font-weight: bold;
  }
}
</style>

