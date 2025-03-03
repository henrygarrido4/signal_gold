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
      timeUnits: [
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' }
      ]
    }
  }
}
</script>

<template>
  <div class="time-delay-node">
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <div class="avatar-sm">
              <div class="avatar-title bg-warning-subtle text-warning rounded-3">
                <i class="ri-time-line"></i>
              </div>
            </div>
          </div>
          <div class="flex-grow-1 ms-3">
            <div class="d-flex gap-2">
              <input v-model="data.configurable.delay" 
                     type="number"
                     class="form-control form-control-sm" 
                     placeholder="Delay">
              <select v-model="data.configurable.unit" 
                      class="form-select form-select-sm">
                <option v-for="unit in timeUnits" 
                        :key="unit.value" 
                        :value="unit.value">
                  {{ unit.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 