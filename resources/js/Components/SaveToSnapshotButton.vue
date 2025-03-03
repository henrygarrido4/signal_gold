<script setup>
import { ref, computed } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Swal from 'sweetalert2';

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({})
  },
  source: {
    type: String,
    default: 'campaign',
    validator: value => ['analytics', 'campaign'].includes(value)
  },
  campaignName: {
    type: String,
    required: true
  }
});

const showModal = ref(false);
const isLoading = ref(false);
const form = ref({
  name: '',
  notes: ''
});

const canSave = computed(() => {
  return props.metrics && 
         Object.keys(props.metrics).length > 0 && 
         props.campaignName;
});

const resetForm = () => {
  form.value = {
    name: '',
    notes: ''
  };
};

const showSuccessAlert = (message) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  });
};

const showErrorAlert = (message) => {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonColor: "#34c38f",
    confirmButtonText: 'Ok'
  });
};

const showWarningAlert = (message) => {
  Swal.fire({
    title: 'Warning',
    text: message,
    icon: 'warning',
    confirmButtonColor: "#34c38f",
    confirmButtonText: 'Ok'
  });
};

const saveSnapshot = async () => {
  if (!props.metrics || Object.keys(props.metrics).length === 0) {
    showWarningAlert('No metrics data available to save');
    return;
  }

  if (!props.campaignName) {
    showWarningAlert('Campaign name is required');
    return;
  }
  
  isLoading.value = true;
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Create new snapshot
    const response = await axios.post('/api/campaign-snapshots', {
      name: form.value.name || `${props.campaignName} Snapshot`,
      notes: form.value.notes,
      campaign_id: props.metrics.campaign_id,
      period_type: 'daily',
      metrics_data: props.metrics,
    });
    
    showModal.value = false;
    resetForm();
    showSuccessAlert('Snapshot saved successfully');
  } catch (error) {
    console.error('Failed to save snapshot:', error);
    console.log('Validation errors:', error.response?.data?.errors);
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat();
      showErrorAlert(errorMessages.join('\n'));
    } else {
      const errorMessage = error.response?.data?.message || 'Failed to save snapshot';
      showErrorAlert(errorMessage);
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <BButton
      variant="soft-primary"
      size="sm"
      @click="showModal = true"
      :disabled="!canSave"
    >
      <i class="ri-save-line align-middle me-1"></i>
      Save Snapshot
    </BButton>

    <BModal
      v-model="showModal"
      title="Save Campaign Snapshot"
      @hidden="resetForm"
    >
      <BForm @submit.prevent="saveSnapshot">
        <BFormGroup
          label="Name"
          label-for="snapshot-name"
        >
          <BFormInput
            id="snapshot-name"
            v-model="form.name"
            required
            placeholder="Enter snapshot name"
          />
        </BFormGroup>

        <BFormGroup
          label="Notes"
          label-for="snapshot-notes"
        >
          <BFormTextarea
            id="snapshot-notes"
            v-model="form.notes"
            rows="3"
            placeholder="Optional notes about this snapshot"
          />
        </BFormGroup>
      </BForm>

      <template #footer>
        <BButton
          variant="secondary"
          @click="showModal = false"
        >
          Cancel
        </BButton>
        <BButton
          variant="primary"
          @click="saveSnapshot"
          :disabled="isLoading || !form.name"
        >
          <BSpinner small v-if="isLoading" class="me-1" />
          {{ isLoading ? 'Saving...' : 'Save Snapshot' }}
        </BButton>
      </template>
    </BModal>
  </div>
</template>

<style>
.flatpickr-input {
  background-color: white !important;
}
</style> 