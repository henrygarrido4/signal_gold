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
      sources: [
        { value: 'all', label: 'All Sources' },
        { value: 'form', label: 'Form Signup' },
        { value: 'import', label: 'CSV Import' },
        { value: 'api', label: 'API Integration' }
      ]
    }
  }
}
</script>

<template>
  <div class="subscribers-node">
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <div class="avatar-sm">
              <div class="avatar-title bg-success-subtle text-success rounded-3">
                <i class="ri-user-add-line"></i>
              </div>
            </div>
          </div>
          <div class="flex-grow-1 ms-3">
            <select v-model="data.configurable.source" 
                    class="form-select form-select-sm">
              <option v-for="source in sources" 
                      :key="source.value" 
                      :value="source.value">
                {{ source.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 