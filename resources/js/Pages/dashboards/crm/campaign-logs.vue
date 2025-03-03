<script>
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import { Head } from '@inertiajs/vue3';
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Swal from 'sweetalert2';
import EventCard from "@/Components/EventCard.vue";
import Multiselect from '@vueform/multiselect'
import '@vueform/multiselect/themes/default.css'

export default {
  components: {
    Layout,
    PageHeader,
    Head,
    flatPickr,
    EventCard,
    Multiselect
  },
  setup() {
    const logs = ref([]);
    const loading = ref(false);
    const filters = ref({
      campaign_id: '',
      event_type: '',
      date_from: '',
      date_to: ''
    });

    const eventTypes = [
      { value: '', text: 'All Events' },
      { value: 'ab_test', text: 'A/B Tests' },
      { value: 'campaign_launch', text: 'Campaigns' },
      { value: 'subject_test', text: 'Subject Tests' },
      { value: 'automation', text: 'Automations' }
    ];

    const showEventModal = ref(false);
    const isEditing = ref(false);
    const selectedLog = ref(null);

    const newEvent = ref({
      title: '',
      description: '',
      timestamp: '',
      status: 'scheduled',
      event_type: ''
    });

    const dateConfig = {
      enableTime: true,
      dateFormat: "Y-m-d h:i K",
      time_24hr: false,
      allowInput: true,
      altFormat: "F j, Y at h:i K",
      altInput: true,
      minuteIncrement: 1,
      defaultHour: new Date().getHours(),
      defaultMinute: new Date().getMinutes(),
      amPM: true
    };

    const formErrors = ref({});

    const fetchLogs = async () => {
      loading.value = true;
      try {
        const response = await axios.get('/api/campaign-logs', {
          params: filters.value,
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        logs.value = response.data.data;
      } catch (error) {
        console.error('Failed to fetch logs:', error);
        if (error.response?.status === 401) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
        }
      } finally {
        loading.value = false;
      }
    };

    const getStatusClass = (status) => ({
      'bg-success-subtle text-success': status === 'running',
      'bg-warning-subtle text-warning': status === 'scheduled',
      'bg-info-subtle text-info': status === 'completed',
      'bg-primary-subtle text-primary': status === 'pending'
    });

    const resetForm = () => {
      newEvent.value = {
        title: '',
        description: '',
        timestamp: '',
        status: 'scheduled',
        event_type: ''
      };
      isEditing.value = false;
      selectedLog.value = null;
    };

    const openEditModal = (log) => {
      // console.log('Opening edit modal with log:', log);
      selectedLog.value = log;
      const timestamp = new Date(log.timestamp);
      // console.log('Parsed edit timestamp:', timestamp);
      
      newEvent.value = {
        ...log,
        timestamp
      };
      // console.log('New event data:', newEvent.value);
      isEditing.value = true;
      showEventModal.value = true;
    };

    const deleteEvent = async (log) => {
      try {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'Cancel!',
          confirmButtonColor: "#34c38f",
          cancelButtonColor: "#f46a6a"
        });

        if (result.isConfirmed) {
          await axios.delete(`/api/campaign-logs/${log.id}`);
          await fetchLogs();
          Swal.fire({
            title: 'Deleted!',
            text: 'Event has been deleted.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          });
        }
      } catch (error) {
        console.error('Failed to delete event:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete event',
          confirmButtonText: 'Ok',
          confirmButtonColor: "#34c38f"
        });
      }
    };

    const handleSubmit = async () => {
      formErrors.value = {};
      
      // Validate required fields
      if (!newEvent.value.title?.trim()) {
        formErrors.value.title = 'Title is required';
      }
      if (!newEvent.value.description?.trim()) {
        formErrors.value.description = 'Description is required';
      }
      if (!newEvent.value.timestamp) {
        formErrors.value.timestamp = 'Date & Time is required';
      }
      if (!newEvent.value.status) {
        formErrors.value.status = 'Status is required';
      }
      if (!newEvent.value.event_type) {
        formErrors.value.event_type = 'Event Type is required';
      }

      // If there are validation errors, don't submit
      if (Object.keys(formErrors.value).length > 0) {
        return;
      }

      try {
        loading.value = true;
        
        // Log the raw timestamp
        // console.log('Raw timestamp:', newEvent.value.timestamp);
        
        // Format the timestamp properly for 12-hour format
        const date = new Date(newEvent.value.timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');
        
        const formattedTimestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${formattedHours}:${formattedMinutes} ${ampm}`;
        
        // console.log('Formatted timestamp:', formattedTimestamp);
        
        const formattedData = {
          title: newEvent.value.title.trim(),
          description: newEvent.value.description.trim(),
          timestamp: formattedTimestamp,
          status: newEvent.value.status?.value || newEvent.value.status,
          event_type: newEvent.value.event_type?.value || newEvent.value.event_type
        };

        // console.log('Sending data:', formattedData);

        try {
          if (isEditing.value) {
            const response = await axios.put(`/api/campaign-logs/${selectedLog.value.id}`, formattedData);
            // console.log('Update response:', response.data);
          } else {
            const response = await axios.post('/api/campaign-logs', formattedData);
            // console.log('Create response:', response.data);
          }
        } catch (error) {
          console.error('API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            error: error.message
          });
          throw error;
        }

        showEventModal.value = false;
        resetForm();
        await fetchLogs();
      } catch (error) {
        console.error('Failed to save event:', error);
        if (error.response?.data) {
          console.error('Error response data:', error.response.data);
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to save event',
          confirmButtonText: 'Ok',
          confirmButtonColor: "#34c38f"
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchLogs);

    return {
      logs,
      loading,
      filters,
      fetchLogs,
      eventTypes,
      getStatusClass,
      showEventModal,
      newEvent,
      dateConfig,
      handleSubmit,
      openEditModal,
      deleteEvent,
      isEditing,
      resetForm,
      formErrors
    };
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Campaign Activity Logs" pageTitle="Marketing CRM" />
    
    <BCard class="mb-4">
      <BCardBody class="d-flex align-items-center p-3">
        <div class="flex-grow-1">
          <h5 class="card-title mb-0">Campaign Events</h5>
        </div>
        <div class="flex-shrink-0 d-flex gap-2">
          <BButton 
            variant="primary" 
            size="sm"
            @click="showEventModal = true"
          >
            <i class="ri-add-line align-bottom me-1"></i> New Event
          </BButton>

          <BDropdown
            variant="soft-primary"
            size="sm"
          >
            <template #button-content>
              <i class="ri-filter-line me-1"></i> 
              {{ filters.event_type ? eventTypes.find(t => t.value === filters.event_type)?.text : 'Filter Events' }}
            </template>
            <BDropdownItem
              v-for="type in eventTypes"
              :key="type.value"
              @click="filters.event_type = type.value; fetchLogs()"
              :active="filters.event_type === type.value"
            >
              {{ type.text }}
            </BDropdownItem>
          </BDropdown>
          
          <BButton 
            variant="soft-primary" 
            size="sm"
            @click="fetchLogs"
          >
            <i class="ri-refresh-line align-bottom"></i> Refresh
          </BButton>
        </div>
      </BCardBody>
    </BCard>

    <BRow>
      <BCol 
        v-for="log in logs" 
        :key="log.id"
        xl="3" 
        md="6"
      >
        <EventCard 
          :log="log"
          @edit="openEditModal"
          @delete="deleteEvent"
        />
      </BCol>

      <BCol v-if="loading || logs.length === 0" cols="12" class="text-center">
        <BSpinner v-if="loading" class="align-middle"></BSpinner>
        <strong v-if="loading" class="ms-2">Loading...</strong>
        <p v-else class="text-muted mb-0">No events found</p>
      </BCol>
    </BRow>

    <BModal
      v-model="showEventModal"
      :title="isEditing ? 'Edit Event' : 'Create New Event'"
      hide-footer
      class="v-modal-custom"
      modal-class="zoomIn"
      centered
      header-class="p-3 bg-success-subtle"
    >
      <BForm @submit.prevent="handleSubmit">
        <BFormGroup label="Event Title" class="mb-3">
          <BFormInput
            v-model="newEvent.title"
            required
            placeholder="Enter event title"
            :class="{ 'is-invalid': formErrors.title }"
          />
          <div class="invalid-feedback" v-if="formErrors.title">
            {{ formErrors.title }}
          </div>
        </BFormGroup>

        <BFormGroup label="Description" class="mb-3">
          <BFormTextarea
            v-model="newEvent.description"
            placeholder="Enter event description"
            rows="3"
            :class="{ 'is-invalid': formErrors.description }"
          />
          <div class="invalid-feedback" v-if="formErrors.description">
            {{ formErrors.description }}
          </div>
        </BFormGroup>

        <BFormGroup label="Date & Time" class="mb-3">
          <flat-pickr
            v-model="newEvent.timestamp"
            :config="dateConfig"
            class="form-control"
            :class="{ 'is-invalid': formErrors.timestamp }"
            placeholder="Select date and time"
          />
          <div class="invalid-feedback" v-if="formErrors.timestamp">
            {{ formErrors.timestamp }}
          </div>
        </BFormGroup>

        <BFormGroup label="Status" class="mb-3">
          <div class="position-relative">
            <Multiselect
              v-model="newEvent.status"
              :options="[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'running', label: 'Running' },
                { value: 'completed', label: 'Completed' },
                { value: 'pending', label: 'Pending' }
              ]"
              track-by="value"
              label="label"
              placeholder="Select status"
              :searchable="false"
              :class="{ 'is-invalid': formErrors.status }"
            />
            <div class="invalid-feedback" v-if="formErrors.status">
              {{ formErrors.status }}
            </div>
          </div>
        </BFormGroup>

        <BFormGroup label="Event Type" class="mb-3">
          <div class="position-relative">
            <Multiselect
              v-model="newEvent.event_type"
              :options="eventTypes.filter(t => t.value !== '').map(t => ({
                value: t.value,
                label: t.text
              }))"
              track-by="value"
              label="label"
              placeholder="Select event type"
              :searchable="false"
              :class="{ 'is-invalid': formErrors.event_type }"
            />
            <div class="invalid-feedback" v-if="formErrors.event_type">
              {{ formErrors.event_type }}
            </div>
          </div>
        </BFormGroup>

        <div class="hstack gap-2 justify-content-end">
          <BButton 
            variant="light" 
            @click="showEventModal = false"
          >
            Cancel
          </BButton>
          <BButton 
            type="submit" 
            variant="primary"
            :disabled="loading"
          >
            {{ isEditing ? 'Update' : 'Create' }}
          </BButton>
        </div>
      </BForm>
    </BModal>
  </Layout>
</template>

<style lang="scss" scoped>

.row {
  --bs-gutter-y: 1rem;
}

.dropdown-item {
  cursor: pointer;
  padding: 0.5rem 1rem;
  color: var(--vz-dropdown-link-color);
  
  &:hover {
    background-color: var(--vz-dropdown-link-hover-bg);
    color: var(--vz-dropdown-link-hover-color);
  }
  
  &.active {
    background-color: var(--vz-dropdown-link-active-bg);
    color: var(--vz-dropdown-link-active-color);
  }
}

:deep(.btn-soft-primary) {
  &:not(:hover) {
    background-color: var(--vz-light);
    border-color: var(--vz-border-color);
  }
}

.invalid-feedback {
  display: block;
  color: var(--vz-danger);
  margin-top: 0.25rem;
}

.is-invalid {
  border-color: var(--vz-danger);
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);

  &:focus {
    border-color: var(--vz-danger);
    box-shadow: 0 0 0 0.25rem rgba(var(--vz-danger-rgb), 0.25);
  }
}

:deep(.multiselect-dropdown) {
  border: 1px solid var(--vz-border-color);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

:deep(.multiselect-option) {
  padding: 0.5rem 1rem;
  color: var(--vz-body-color);

  &.is-selected {
    background: var(--vz-primary);
    color: white;
  }

  &.is-pointed {
    background: var(--vz-light);
    color: var(--vz-body-color);
  }
}

:deep(.multiselect-single-label) {
  color: var(--vz-body-color);
}

:deep(.multiselect-placeholder) {
  color: var(--vz-input-placeholder-color);
}

:deep(.multiselect) {
  &.is-invalid {
    border-color: var(--vz-danger);
    
    &:hover {
      border-color: var(--vz-danger);
    }
    
    .multiselect-placeholder {
      color: var(--vz-danger);
    }
  }
}

.position-relative {
  position: relative;
  
  .invalid-feedback {
    display: block;
  }
}
</style> 