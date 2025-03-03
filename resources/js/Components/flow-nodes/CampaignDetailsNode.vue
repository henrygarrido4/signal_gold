<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  emits: ['connection-start', 'connection-end']
}
</script>

<template>
  <div class="campaign-node">
    <div class="card">
      <div class="card-body">
        <div class="d-flex align-items-center">
          <div class="flex-shrink-0">
            <div class="avatar-sm">
              <div class="avatar-title bg-primary-subtle text-primary rounded-3">
                <i class="ri-mail-line"></i>
              </div>
            </div>
          </div>
          <div class="flex-grow-1 ms-3">
            <input v-model="data.configurable.name" 
                   class="form-control form-control-sm mb-2" 
                   placeholder="Campaign Name">
            <input v-model="data.configurable.subject" 
                   class="form-control form-control-sm" 
                   placeholder="Subject Line">
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 