<script>
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import axios from 'axios';
import { router } from '@inertiajs/vue3';
import Swal from 'sweetalert2';
import FlowEmails from "@/Components/FlowEmails.vue";

export default {
  components: {
    Layout,
    PageHeader,
    FlowEmails
  },
  data() {
    return {
      searchTerm: '',
      selectedFlow: null,
      showNewFlowModal: false,
      showEditFlowModal: false,
      showNewEmailModal: false,
      showEditEmailModal: false,
      editingFlow: null,
      editingEmail: null,
      newFlow: {
        name: '',
        description: '',
        status: 'draft'
      },
      newEmail: {
        name: '',
        subject: '',
        delay: '',
        template: 'default'
      },
      flows: [],
      isLoading: false,
      isDeleting: false,
      isSaving: false,
      isProcessing: false,
      clickTimeout: null,
      itemToDelete: null,
      deleteType: null, // 'flow' or 'email'
      errors: {
        flow: {
          name: '',
          description: '',
          status: ''
        },
        email: {
          name: '',
          subject: '',
          delay: '',
          image: ''
        }
      },
      templateImages: {
        'default': '/images/email-templates/default.jpg',
        'welcome-template': '/images/email-templates/welcome.jpg',
        'product-intro': '/images/email-templates/product.jpg'
      },
      selectedImage: null,
      imagePreview: null,
      showImagePreviewModal: false,
      previewImageUrl: null,
      previewImageTitle: '',
      currentPreviewEmailIndex: null,
      currentPage: 1,
      perPage: 6,
    }
  },
  computed: {
    flowName: {
      get() {
        return this.editingFlow ? this.editingFlow.name : this.newFlow.name;
      },
      set(value) {
        if (this.editingFlow) {
          this.editingFlow.name = value;
        } else {
          this.newFlow.name = value;
        }
      }
    },
    flowDescription: {
      get() {
        return this.editingFlow ? this.editingFlow.description : this.newFlow.description;
      },
      set(value) {
        if (this.editingFlow) {
          this.editingFlow.description = value;
        } else {
          this.newFlow.description = value;
        }
      }
    },
    flowStatus: {
      get() {
        return this.editingFlow ? this.editingFlow.status : this.newFlow.status;
      },
      set(value) {
        if (this.editingFlow) {
          this.editingFlow.status = value;
        } else {
          this.newFlow.status = value;
        }
      }
    },
    emailName: {
      get() {
        return this.editingEmail ? this.editingEmail.name : this.newEmail.name;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.name = value;
        } else {
          this.newEmail.name = value;
        }
      }
    },
    emailSubject: {
      get() {
        return this.editingEmail ? this.editingEmail.subject : this.newEmail.subject;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.subject = value;
        } else {
          this.newEmail.subject = value;
        }
      }
    },
    emailDelay: {
      get() {
        return this.editingEmail ? this.editingEmail.delay : this.newEmail.delay;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.delay = value;
        } else {
          this.newEmail.delay = value;
        }
      }
    },
    emailTemplate: {
      get() {
        return this.editingEmail ? this.editingEmail.template : this.newEmail.template;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.template = value;
        } else {
          this.newEmail.template = value;
        }
      }
    },
    getTemplateImage() {
      return (template) => {
        return this.templateImages[template] || this.templateImages['default'];
      }
    },
    defaultImage() {
      return '/images/email-templates/default.jpg';
    },
    currentPreviewEmail() {
      if (this.currentPreviewEmailIndex === null) return null;
      return this.selectedFlow?.emails[this.currentPreviewEmailIndex];
    },
    hasPreviousEmail() {
      return this.currentPreviewEmailIndex > 0;
    },
    hasNextEmail() {
      return this.currentPreviewEmailIndex < (this.selectedFlow?.emails.length - 1);
    },
    filteredFlows() {
      if (!this.searchTerm) return this.flows;
      const searchLower = this.searchTerm.toLowerCase();
      return this.flows.filter(flow => {
        return flow.name.toLowerCase().includes(searchLower) ||
               flow.description?.toLowerCase().includes(searchLower) ||
               flow.status.toLowerCase().includes(searchLower);
      });
    },
    paginatedFlows() {
      if (this.searchTerm) return this.filteredFlows; // When searching, show all filtered results
      
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.flows.slice(start, end);
    },
    totalPages() {
      const totalItems = this.searchTerm ? this.filteredFlows.length : this.flows.length;
      return Math.ceil(totalItems / this.perPage);
    },
    showPagination() {
      return !this.searchTerm && this.flows.length > this.perPage;
    },
  },
  mounted() {
    this.refreshFlows();
  },
  methods: {
    // Prevent double clicks
    handleClick(action, ...args) {
      if (this.clickTimeout) return;
      
      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null;
      }, 300);

      return action.apply(this, args);
    },

    // Update selectFlow to be more efficient
    selectFlow(flow) {
      if (this.selectedFlow?.id === flow.id) return;
      this.selectedFlow = flow;
    },

    createFlow() {
      this.showNewFlowModal = true;
    },
    editFlow(flow) {
      this.editingFlow = { ...flow };
      this.showEditFlowModal = true;
    },
    async saveFlow() {
      // Reset errors
      this.errors.flow = {
        name: '',
        description: '',
        status: ''
      };

      // Validate
      if (!this.flowName.trim()) {
        this.errors.flow.name = 'Flow name is required';
        return;
      }

      try {
        const data = this.editingFlow ? this.editingFlow : this.newFlow;
        
        // Make sure all required fields are present
        const payload = {
            name: data.name,
            description: data.description || '',
            status: data.status || 'draft'
        };

        if (this.editingFlow) {
            // Update existing flow
            const response = await axios.put(`/flows/${this.editingFlow.id}`, payload);
            this.flows = this.flows.map(f => f.id === response.data.id ? response.data : f);
        } else {
            // Create new flow
            const response = await axios.post('/flows', payload);
            this.flows.push(response.data);
        }

        this.showNewFlowModal = false;
        this.showEditFlowModal = false;
        this.editingFlow = null;
        this.newFlow = {
            name: '',
            description: '',
            status: 'draft'
        };
      } catch (error) {
        if (error.response?.data?.errors) {
          this.errors.flow = error.response.data.errors;
        } else {
          console.error('Error saving flow:', error);
          alert(error.response?.data?.message || 'Failed to save flow');
        }
      }
    },
    // Update confirmDelete method
    confirmDelete(item, type) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.handleDelete(item, type);
        }
      });
    },
    // Update handleDelete method
    async handleDelete(item, type) {
      if (!item || !type) return;
      
      this.isDeleting = true;
      
      try {
        if (type === 'flow') {
          await axios.delete(`/flows/${item.id}`);
          
          if (this.selectedFlow?.id === item.id) {
            this.selectedFlow = null;
          }
          await this.refreshFlows();
          this.showSuccessAlert('Flow deleted successfully');
        } else if (type === 'email') {
          const updatedEmails = this.selectedFlow.emails.filter(
            e => e.id !== item.id
          );
          this.updateFlowEmails(updatedEmails);

          await axios.delete(`/flows/${this.selectedFlow.id}/emails/${item.id}`);
          this.showSuccessAlert('Email deleted successfully');
        }
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
        this.showErrorAlert(error.response?.data?.message || `Failed to delete ${type}`);
        
        if (type === 'email') {
          await this.refreshFlows();
        }
      } finally {
        this.isDeleting = false;
      }
    },
    // Update showSuccessAlert method
    showSuccessAlert(message) {
      Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
    },
    // Update showErrorAlert method
    showErrorAlert(message) {
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonColor: "#34c38f",
        confirmButtonText: 'Ok'
      });
    },
    // Update clearImage method with better error handling
    async clearImage() {
      if (this.editingEmail?.image_path) {
        try {
          await axios.post(`/flows/${this.selectedFlow.id}/emails/${this.editingEmail.id}/remove-image`);
          this.editingEmail.image_path = null;
        } catch (error) {
          console.error('Error removing image:', error);
          this.showErrorAlert(error.response?.data?.message || 'Failed to remove image');
          return;
        }
      }
      
      this.selectedImage = null;
      this.imagePreview = null;
      // Reset file input
      const fileInput = this.$refs.imageInput;
      if (fileInput) fileInput.value = '';
    },
    // Update saveEmail method
    async saveEmail() {
      if (this.isSaving) return;
      
      try {
        // Validate required fields first
        if (!this.emailName.trim()) {
          this.showErrorAlert('Email name is required');
          return;
        }
        if (!this.emailSubject.trim()) {
          this.showErrorAlert('Subject is required');
          return;
        }
        if (!this.emailDelay.trim()) {
          this.showErrorAlert('Delay is required');
          return;
        }

        // Update the delay validation
        if (!this.emailDelay.trim().match(/^(immediately|(\d+(-\d+)?\s+(hours?|days?)\s+after))$/)) {
          this.showErrorAlert('Delay must be in format "immediately", "X hours after", "X days after" or "X-Y days/hours after"');
          return;
        }

        this.isSaving = true;
        const formData = new FormData();
        
        // Ensure we're appending the correct values
        formData.append('name', this.emailName.trim());
        formData.append('subject', this.emailSubject.trim());
        formData.append('delay', this.emailDelay.trim());
        
        if (this.selectedImage) {
          formData.append('image', this.selectedImage);
        }

        const isEdit = Boolean(this.editingEmail);
        const url = `/flows/${this.selectedFlow.id}/emails${isEdit ? `/${this.editingEmail.id}` : ''}`;
        
        // Log the data being sent
        // console.log('Saving email with data:', {
        //   name: this.emailName,
        //   subject: this.emailSubject,
        //   delay: this.emailDelay,
        //   hasImage: Boolean(this.selectedImage),
        //   url: url,
        //   method: isEdit ? 'put' : 'post'
        // });

        let response;
        // For PUT requests, we need to append _method field
        if (isEdit) {
          formData.append('_method', 'PUT');
          response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        } else {
          response = await axios.post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }

        // Update local state
        const updatedEmails = isEdit
          ? this.selectedFlow.emails.map(e => e.id === this.editingEmail.id ? response.data : e)
          : [...this.selectedFlow.emails, response.data];

        this.updateFlowEmails(updatedEmails);
        this.resetEmailForm();
        
        this.showSuccessAlert(
          isEdit ? 'Email updated successfully' : 'Email added successfully',
          isEdit ? 'Updated!' : 'Added!'
        );
      } catch (error) {
        console.error('Error saving email:', error);
        
        // Log detailed error information
        // console.log('Detailed error:', {
        //   status: error.response?.status,
        //   statusText: error.response?.statusText,
        //   data: error.response?.data,
        //   headers: error.response?.headers,
        //   config: error.config
        // });

        const errorMessage = error.response?.data?.message 
          || error.response?.data?.error 
          || error.message
          || 'Failed to save email';
          
        this.showErrorAlert(`Error: ${errorMessage}`);
      } finally {
        this.isSaving = false;
      }
    },
    addEmailToFlow() {
      // Reset the form completely
      this.newEmail = {
        name: '',
        subject: '',
        delay: '',
        template: 'default'
      };
      this.editingEmail = null;
      this.errors.email = {
        name: '',
        subject: '',
        delay: '',
        template: ''
      };
      this.showNewEmailModal = true;
    },
    editEmail(email) {
      this.editingEmail = { ...email };
      this.showEditEmailModal = true;
    },
    handleImageSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Preview the image
      this.selectedImage = file;
      this.imagePreview = URL.createObjectURL(file);
    },
    handleImageError(e) {
      // Fallback to default image if loading fails
      e.target.src = this.defaultImage;
    },
    async deleteEmail(email) {
      if (this.isDeleting) return;
      if (!confirm('Are you sure you want to delete this email?')) return;

      this.isDeleting = true;
      const emailId = email.id;
      const flowId = this.selectedFlow.id;

      // Optimistic update
      const updatedEmails = this.selectedFlow.emails.filter(e => e.id !== emailId);
      this.updateFlowEmails(updatedEmails);

      try {
        await axios.delete(`/flows/${flowId}/emails/${emailId}`);
      } catch (error) {
        console.error('Error deleting email:', error);
        // Revert on error
        await this.refreshFlows();
        alert('Failed to delete email');
      } finally {
        this.isDeleting = false;
      }
    },
    async refreshFlows() {
      try {
        const response = await axios.get('/flows');
        this.flows = response.data;
        
        // Update selectedFlow if needed
        if (this.selectedFlow) {
          const updatedFlow = this.flows.find(f => f.id === this.selectedFlow.id);
          this.selectedFlow = updatedFlow || null;
        }
      } catch (error) {
        console.error('Error refreshing flows:', error);
        alert('Failed to load flows. Please refresh the page.');
      }
    },
    getEmailStats(email) {
      return email.stats || { sent: 0, opened: 0, clicked: 0 };
    },
    // Optimize updateFlowEmails
    updateFlowEmails(updatedEmails) {
      if (this.selectedFlow) {
        this.selectedFlow = { ...this.selectedFlow, emails: updatedEmails };
        this.flows = this.flows.map(f => 
          f.id === this.selectedFlow.id ? this.selectedFlow : f
        );
      }
    },
    // Helper method to reset email form
    resetEmailForm() {
      this.showNewEmailModal = false;
      this.showEditEmailModal = false;
      this.editingEmail = null;
      // Reset to default values
      this.newEmail = {
        name: '',
        subject: '',
        delay: '',
        template: 'default'
      };
      // Clear any errors
      this.errors.email = {
        name: '',
        subject: '',
        delay: '',
        template: ''
      };
      this.clearImage();
    },
    // Add a simple debounce helper
    debounce(fn, wait = 300) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          fn.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    viewEmailTemplate(email) {
      this.currentPreviewEmailIndex = this.selectedFlow.emails.findIndex(e => e.id === email.id);
      this.previewImageTitle = email.name;
      this.previewImageUrl = email.image_path 
        ? `/storage/${email.image_path}` 
        : this.defaultImage;
      this.showImagePreviewModal = true;
    },
    showPreviousEmail() {
      if (this.hasPreviousEmail) {
        this.currentPreviewEmailIndex--;
        const email = this.selectedFlow.emails[this.currentPreviewEmailIndex];
        this.previewImageTitle = email.name;
        this.previewImageUrl = email.image_path 
          ? `/storage/${email.image_path}` 
          : this.defaultImage;
      }
    },
    showNextEmail() {
      if (this.hasNextEmail) {
        this.currentPreviewEmailIndex++;
        const email = this.selectedFlow.emails[this.currentPreviewEmailIndex];
        this.previewImageTitle = email.name;
        this.previewImageUrl = email.image_path 
          ? `/storage/${email.image_path}` 
          : this.defaultImage;
      }
    },
    // Update the formatDelay method
    formatDelay(delay) {
      if (!delay) return '';
      
      try {
        // Handle immediate sends
        if (delay === 'immediately') {
          return 'Sends immediately';
        }

        // Check if delay contains a range (e.g., "12-18 days after")
        if (typeof delay === 'string' && delay.includes('-')) {
          const [start, rest] = delay.split('-');
          const [end, unit, ...timing] = rest.trim().split(' ');
          return `${unit.charAt(0).toUpperCase() + unit.slice(1)} ${start.trim()}-${end} ${timing.join(' ')}`;
        }
        
        // Handle single day/hour delay
        return delay;
      } catch (error) {
        console.error('Error formatting delay:', error);
        return delay;
      }
    },
    // Add back the handleFlowClick method
    handleFlowClick(flow) {
      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
        this.clickTimeout = null;
        return;
      }

      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null;
        this.selectedFlow = flow;
      }, 200);
    },
    changePage(page) {
      this.currentPage = page;
    },
  },
  created() {
    // Debounce the handlers that don't need immediate feedback
    this.debouncedRefreshFlows = this.debounce(this.refreshFlows);
  },
  watch: {
    searchTerm() {
      this.currentPage = 1; // Reset to first page when searching
    }
  }
}
</script>

<template>
  <Layout>
    <PageHeader title="Email Flows" pageTitle="Apps" />
    
    <!-- Update the BRow section for the buttons -->
    <BRow class="g-4 mb-3">
      <BCol sm="auto">
        <div class="d-flex gap-2">
          <BButton variant="primary" @click="showNewFlowModal = true">
            <i class="ri-add-line align-bottom me-1"></i> Add New Flow
          </BButton>
        </div>
      </BCol>
      <BCol sm>
        <div class="search-box">
          <BInputGroup>
            <BInputGroupPrepend>
              <BButton variant="primary">
                <i class="ri-search-line search-icon text-white"></i>
              </BButton>
            </BInputGroupPrepend>
            <BFormInput
              v-model="searchTerm"
              type="text"
              placeholder="Search flows..."
              class="search-input"
            />
          </BInputGroup>
        </div>
      </BCol>
    </BRow>

    <!-- Update the flow cards section -->
    <BRow class="mb-4">
      <BCol lg="12">
        <BCard no-body>
          <BCardBody>
            <div class="flow-cards-container">
              <div 
                v-for="flow in paginatedFlows" 
                :key="flow.id"
                class="ribbon-box cursor-pointer"
                @click="handleFlowClick(flow)"
              >
                <BCard no-body>
                  <div class="ribbon-two" :class="{
                    'ribbon-two-info': selectedFlow?.id !== flow.id,
                    'ribbon-two-secondary': selectedFlow?.id === flow.id
                  }">
                    <span>{{ flow.status }}</span>
                  </div>
                  <div class="p-4">
                    <div class="card-content">
                      <h5 class="fs-14 mb-3 text-end text-truncate">{{ flow.name }}</h5>
                      <p class="mb-0 description-text">{{ flow.description }}</p>
                      <div class="d-flex align-items-center justify-content-between mt-auto">
                        <div>
                          <i class="ri-mail-send-line me-2"></i>
                          <small class="text-muted">{{ flow.emails?.length || 0 }} emails in sequence</small>
                        </div>
                        <BDropdown 
                          variant="link" 
                          toggle-class="btn btn-soft-primary btn-sm arrow-none" 
                          menu-class="dropdown-menu-end"
                        >
                          <template #button-content>
                            <i class="ri-more-2-fill"></i>
                          </template>
                          <BDropdownItem @click.stop="editFlow(flow)">
                            <i class="ri-edit-line align-bottom me-2 text-muted"></i>Edit
                          </BDropdownItem>
                          <BDropdownItem 
                            @click.stop="confirmDelete(flow, 'flow')"
                            :disabled="isDeleting"
                            class="text-danger"
                          >
                            <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i>Delete
                          </BDropdownItem>
                        </BDropdown>
                      </div>
                    </div>
                  </div>
                </BCard>
              </div>
              
              <!-- Add empty state when no results found -->
              <div v-if="(searchTerm ? filteredFlows : paginatedFlows).length === 0" class="text-center w-100 py-5">
                <div class="avatar-lg mx-auto mb-4">
                  <div class="avatar-title text-primary display-5 rounded-circle">
                    <i class="ri-search-line"></i>
                  </div>
                </div>
                <h5>No flows found</h5>
                <p class="text-muted">
                  {{ searchTerm ? 'Try adjusting your search term' : 'Start by creating a new flow' }}
                </p>
              </div>
            </div>

            <!-- Add pagination -->
            <div v-if="showPagination" class="d-flex justify-content-center mt-4">
              <BPagination
                v-model="currentPage"
                :total-rows="flows.length"
                :per-page="perPage"
                align="center"
                class="mb-0"
              >
                <template #prev-text>
                  <i class="ri-arrow-left-s-line"></i>
                </template>
                <template #next-text>
                  <i class="ri-arrow-right-s-line"></i>
                </template>
              </BPagination>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Use FlowEmails component -->
    <FlowEmails
      v-if="selectedFlow"
      :selectedFlow="selectedFlow"
      @update:emails="updateFlowEmails"
      @refresh="refreshFlows"
    />

    <!-- Flow Modal -->
    <BModal
      :modelValue="showNewFlowModal || showEditFlowModal"
      :title="editingFlow ? 'Edit Flow' : 'Create New Flow'"
      @hide="showNewFlowModal = showEditFlowModal = false"
    >
      <BForm>
        <BFormGroup 
          label="Flow Name*"
          class="mb-4"
        >
          <BFormInput
            v-model="flowName"
            placeholder="Enter flow name"
            :state="errors.flow.name ? false : null"
          />
          <BFormInvalidFeedback v-if="errors.flow.name">
            {{ errors.flow.name }}
          </BFormInvalidFeedback>
        </BFormGroup>
        <BFormGroup 
          label="Description"
          class="mb-4"
        >
          <BFormTextarea
            v-model="flowDescription"
            placeholder="Enter flow description"
            :state="errors.flow.description ? false : null"
          />
          <BFormInvalidFeedback v-if="errors.flow.description">
            {{ errors.flow.description }}
          </BFormInvalidFeedback>
        </BFormGroup>
        <BFormGroup label="Status*">
          <BFormSelect
            v-model="flowStatus"
            :options="['draft', 'active']"
            :state="errors.flow.status ? false : null"
          />
          <BFormInvalidFeedback v-if="errors.flow.status">
            {{ errors.flow.status }}
          </BFormInvalidFeedback>
        </BFormGroup>
      </BForm>
      <template #footer>
        <BButton variant="secondary" @click="showNewFlowModal = showEditFlowModal = false">
          Cancel
        </BButton>
        <BButton variant="primary" @click="saveFlow">
          {{ editingFlow ? 'Update' : 'Create' }}
        </BButton>
      </template>
    </BModal>
  </Layout>
</template>

<style scoped>
/* Flow cards container */
.flow-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

/* Flow card styles */
.ribbon-box {
  position: relative;
  width: 100%;
  max-width: calc(33.333% - 1rem); /* Make it fit 3 in a row with gap consideration */
  flex: 0 0 calc(33.333% - 1rem); /* Prevent growing/shrinking */
}

/* Media queries for responsive behavior */
@media (max-width: 992px) {
  .ribbon-box {
    max-width: calc(50% - 0.75rem); /* 2 cards per row on medium screens */
    flex: 0 0 calc(50% - 0.75rem);
  }
}

@media (max-width: 576px) {
  .flow-cards-container {
    flex-direction: column;
  }
  
  .ribbon-box {
    max-width: 100%;
    margin-right: 0;
  }
}

.ribbon-box .card {
  margin-bottom: 0;
  height: 180px; /* Fixed height for all cards */
}

.ribbon-box .card .p-4 {
  height: 100%;
  padding-top: 2.5rem !important; /* Add more space at top for ribbon */
}

.ribbon-two {
  position: absolute;
  left: -5px;
  top: -5px;
  z-index: 1;
  overflow: hidden;
  width: 75px;
  height: 75px;
  text-align: right;
}

.ribbon-two-info span {
  font-size: 12px;
  color: #fff;
  text-transform: capitalize;
  text-align: center;
  line-height: 20px;
  transform: rotate(-45deg);
  width: 100px;
  display: block;
  background: var(--vz-info);
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  position: absolute;
  top: 19px;
  left: -21px;
}

.ribbon-two-secondary span {
  font-size: 12px;
  color: #fff;
  text-transform: capitalize;
  text-align: center;
  line-height: 20px;
  transform: rotate(-45deg);
  width: 100px;
  display: block;
  background: var(--vz-secondary);
  box-shadow: 0 0 8px rgba(0,0,0,0.1);
  position: absolute;
  top: 19px;
  left: -21px;
}

.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.cursor-pointer {
  cursor: pointer;
}

/* Add these styles for the dropdown */
.btn.arrow-none::after {
  display: none;
}

.btn-soft-secondary {
  color: var(--vz-secondary);
  background-color: rgba(var(--vz-secondary-rgb), 0.1);
}

/* Remove the absolute positioning for card actions */
.card-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

/* Add margin to the email count div if needed */
.mt-3 {
  margin-top: 1rem !important;
}

/* Text truncation styles */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 1rem;
}

/* Push the bottom content to the bottom */
.mt-auto {
  margin-top: auto !important;
}

/* Search box styles */
.search-box {
  max-width: 25%;
}

.search-box .search-input {
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  padding-left: 0.75rem;
}

.search-box .input-group-prepend button {
  border-end-end-radius: 0;
  border-start-end-radius: 0;
}

.search-icon {
  font-size: 16px;
  line-height: 1;
  left: 10px;
}

/* Empty state styles */
.avatar-lg {
  height: 4.5rem;
  width: 4.5rem;
}

.avatar-title {
  align-items: center;
  display: flex;
  font-weight: 500;
  height: 100%;
  justify-content: center;
  width: 100%;
}

.display-5 {
  font-size: 2.5rem;
}

/* Pagination styles */
.pagination {
  margin-bottom: 0;
}

.page-item.active .page-link {
  background-color: var(--vz-primary);
  border-color: var(--vz-primary);
}

.page-link {
  color: var(--vz-primary);
  margin: 0 2px;
  border-radius: 4px;
}

.page-link:hover {
  color: var(--vz-primary);
  background-color: rgba(var(--vz-primary-rgb), 0.1);
}

.page-item:first-child .page-link,
.page-item:last-child .page-link {
  border-radius: 4px;
}
</style>
