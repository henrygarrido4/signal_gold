<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      actions: [
        { value: 'track', label: 'Track Bounces' },
        { value: 'remove', label: 'Remove Bounced' },
        { value: 'retry', label: 'Retry Delivery' }
      ]
    }
  }
}
</script>

<template>
  <div class="bounce-tracking-node">
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <div class="avatar-sm">
              <div class="avatar-title bg-danger-subtle text-danger rounded-3">
                <i class="ri-arrow-go-back-line"></i>
              </div>
            </div>
          </div>
          <div class="flex-grow-1 ms-3">
            <select v-model="data.configurable.action" 
                    class="form-select form-select-sm">
              <option v-for="action in actions" 
                      :key="action.value" 
                      :value="action.value">
                {{ action.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 