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
        { value: 'remove', label: 'Remove from List' },
        { value: 'tag', label: 'Add Unsubscribed Tag' },
        { value: 'feedback', label: 'Request Feedback' }
      ]
    }
  }
}
</script>

<template>
  <div class="unsubscribed-node">
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <div class="avatar-sm">
              <div class="avatar-title bg-secondary-subtle text-secondary rounded-3">
                <i class="ri-user-unfollow-line"></i>
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