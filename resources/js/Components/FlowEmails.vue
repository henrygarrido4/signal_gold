<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'FlowEmails',
  emits: ['update:emails', 'refresh'],
  props: {
    selectedFlow: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showNewEmailModal: false,
      showEditEmailModal: false,
      showImagePreviewModal: false,
      editingEmail: null,
      newEmail: {
        name: '',
        subject: '',
        delay: '',
        template: 'default',
        workflow_name: '',
        workflow_url: '',
        campaign_id: '',
        email_link: '',
        send_list: '',
        suppression_lists: '',
        description: ''
      },
      errors: {
        name: '',
        subject: '',
        image: '',
        workflow_url: '',
        email_link: '',
      },
      selectedImage: null,
      imagePreview: null,
      previewImageUrl: null,
      previewImageTitle: '',
      currentPreviewEmailIndex: null,
      isSaving: false,
      isDeleting: false,
      imageZoom: 1,
      minZoom: 0.5,
      maxZoom: 3,
      isDragging: false,
      startX: 0,
      startY: 0,
      translateX: 0,
      translateY: 0,
      lastX: 0,
      lastY: 0,
      dragVelocity: { x: 0, y: 0 },
      isZoomed: false,
      zoomLevel: 2,
    }
  },
  computed: {
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
    defaultImage() {
      return '/images/email-templates/default.jpg';
    },
    currentPreviewEmail() {
      if (this.currentPreviewEmailIndex === null || !this.selectedFlow?.emails) return null;
      const email = this.selectedFlow.emails[this.currentPreviewEmailIndex];
      // console.log('Current Preview Email:', email);
      return email;
    },
    hasPreviousEmail() {
      return this.currentPreviewEmailIndex > 0;
    },
    hasNextEmail() {
      if (!this.selectedFlow?.emails) return false;
      return this.currentPreviewEmailIndex < (this.selectedFlow.emails.length - 1);
    },
    emailWorkflowName: {
      get() {
        return this.editingEmail ? this.editingEmail.workflow_name : this.newEmail.workflow_name;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.workflow_name = value;
        } else {
          this.newEmail.workflow_name = value;
        }
      }
    },
    emailWorkflowUrl: {
      get() {
        return this.editingEmail ? this.editingEmail.workflow_url : this.newEmail.workflow_url;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.workflow_url = value;
        } else {
          this.newEmail.workflow_url = value;
        }
      }
    },
    emailCampaignId: {
      get() {
        return this.editingEmail ? this.editingEmail.campaign_id : this.newEmail.campaign_id;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.campaign_id = value;
        } else {
          this.newEmail.campaign_id = value;
        }
      }
    },
    emailLink: {
      get() {
        return this.editingEmail ? this.editingEmail.email_link : this.newEmail.email_link;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.email_link = value;
        } else {
          this.newEmail.email_link = value;
        }
      }
    },
    emailSendList: {
      get() {
        return this.editingEmail ? this.editingEmail.send_list : this.newEmail.send_list;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.send_list = value;
        } else {
          this.newEmail.send_list = value;
        }
      }
    },
    emailSuppressionLists: {
      get() {
        return this.editingEmail ? this.editingEmail.suppression_lists : this.newEmail.suppression_lists;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.suppression_lists = value;
        } else {
          this.newEmail.suppression_lists = value;
        }
      }
    },
    emailDescription: {
      get() {
        return this.editingEmail ? this.editingEmail.description : this.newEmail.description;
      },
      set(value) {
        if (this.editingEmail) {
          this.editingEmail.description = value;
        } else {
          this.newEmail.description = value;
        }
      }
    }
  },
  methods: {
    addEmailToFlow() {
      this.resetEmailForm();
      this.clearFileInput();
      this.showNewEmailModal = true;
    },
    
    editEmail(email) {
      this.editingEmail = { ...email };
      this.clearFileInput();
      this.showEditEmailModal = true;
    },

    async saveEmail() {
      // console.log('Starting saveEmail method');
      // console.log('Current state:', {
      //   isEditing: !!this.editingEmail,
      //   emailData: this.editingEmail || this.newEmail,
      //   selectedFlow: this.selectedFlow,
      //   hasImage: !!this.selectedImage
      // });

      this.isSaving = true;
      const formData = new FormData();
      const emailData = this.editingEmail || this.newEmail;

      // Add more detailed logging
      // console.log('Email Data to be sent:', {
      //   name: emailData.name,
      //   subject: emailData.subject,
      //   delay: emailData.delay,
      //   flow_id: this.selectedFlow.id,
      //   hasImage: !!this.selectedImage
      // });

      formData.append('name', emailData.name);
      formData.append('subject', emailData.subject);
      formData.append('delay', emailData.delay);
      formData.append('flow_id', this.selectedFlow.id); // Make sure flow_id is included
      
      if (this.selectedImage) {
        // console.log('Image details:', {
        //   name: this.selectedImage.name,
        //   type: this.selectedImage.type,
        //   size: this.selectedImage.size
        // });
        formData.append('image', this.selectedImage);
      }

      // Only append non-empty URL values
      if (emailData.workflow_url?.trim()) {
        formData.append('workflow_url', emailData.workflow_url.trim());
      }
      if (emailData.email_link?.trim()) {
        formData.append('email_link', emailData.email_link.trim());
      }

      // Append other fields normally
      formData.append('workflow_name', emailData.workflow_name || '');
      formData.append('campaign_id', emailData.campaign_id || '');
      formData.append('send_list', emailData.send_list || '');
      formData.append('suppression_lists', emailData.suppression_lists || '');
      formData.append('description', emailData.description || '');

      // Log all FormData entries
      // console.log('Final FormData contents:');
      for (let pair of formData.entries()) {
        // console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      try {
        let response;
        const baseUrl = `/flows/${this.selectedFlow.id}/emails`;
        
        if (this.editingEmail) {
          const editUrl = `${baseUrl}/${this.editingEmail.id}`;
            // console.log('Updating existing email:', {
            //   url: editUrl,
            //   emailId: this.editingEmail.id
            // });
          
          formData.append('_method', 'PUT');
          response = await axios.post(editUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          // Update just the edited email in the list
          const updatedEmails = this.selectedFlow.emails.map(email => 
            email.id === response.data.id ? response.data : email
          );
          this.$emit('update:emails', updatedEmails);
        } else {
          // console.log('Creating new email:', {
          //   url: baseUrl
          // });
          
          response = await axios.post(baseUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          // Add new email to the list
          const updatedEmails = [...this.selectedFlow.emails, response.data];
          this.$emit('update:emails', updatedEmails);
        }

        // console.log('Server response:', response.data);
        // console.log('Emitted update:emails with updated list');

        this.showSuccessAlert(this.editingEmail ? 'Email updated successfully!' : 'Email added successfully!');
        this.resetEmailForm();

      } catch (error) {
        console.error('Error in saveEmail:', error);
        
        // Only handle name, subject, and image validation errors
        if (error.response?.data?.errors) {
          const { name, subject, image } = error.response.data.errors;
          this.errors = { name, subject, image };
        } else {
          this.showErrorAlert(
            error.response?.data?.message || 
            'Failed to save email. Please try again.'
          );
        }
      } finally {
        // console.log('Completing saveEmail method');
        this.isSaving = false;
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Preview the image
      this.selectedImage = file;
      this.imagePreview = URL.createObjectURL(file);
    },

    clearFileInput() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      this.selectedImage = null;
      this.imagePreview = null;
    },

    confirmDelete(email) {
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
          this.handleDelete(email);
        }
      });
    },

    async handleDelete(email) {
      if (this.isDeleting) return;
      this.isDeleting = true;
      
      try {
        const updatedEmails = this.selectedFlow.emails.filter(e => e.id !== email.id);
        this.$emit('update:emails', updatedEmails);

        await axios.delete(`/flows/${this.selectedFlow.id}/emails/${email.id}`);
        this.showSuccessAlert('Email deleted successfully');
      } catch (error) {
        console.error('Error deleting email:', error);
        this.showErrorAlert(error.response?.data?.message || 'Failed to delete email');
        this.$emit('refresh');
      } finally {
        this.isDeleting = false;
      }
    },

    viewEmailTemplate(email) {
      // console.log('Opening preview for email:', email);
      this.currentPreviewEmailIndex = this.selectedFlow.emails.findIndex(e => e.id === email.id);
      this.previewImageTitle = email.name;
      this.previewImageUrl = email.image_path 
        ? `/storage/${email.image_path}` 
        : this.defaultImage;
      this.showImagePreviewModal = true;
    },

    showPreviousEmail() {
      if (this.hasPreviousEmail) {
        this.resetZoom(); // Reset zoom when changing images
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
        this.resetZoom(); // Reset zoom when changing images
        this.currentPreviewEmailIndex++;
        const email = this.selectedFlow.emails[this.currentPreviewEmailIndex];
        this.previewImageTitle = email.name;
        this.previewImageUrl = email.image_path 
          ? `/storage/${email.image_path}` 
          : this.defaultImage;
      }
    },

    formatDelay(delay) {
      if (!delay) return '';
      return delay; // Simply return the delay text as-is
    },

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

    showErrorAlert(message) {
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        confirmButtonColor: "#34c38f",
        confirmButtonText: 'Ok'
      });
    },

    resetEmailForm() {
      // console.log('Resetting email form');
      // console.log('Before reset:', {
      //   showNewEmailModal: this.showNewEmailModal,
      //   showEditEmailModal: this.showEditEmailModal,
      //   editingEmail: this.editingEmail,
      //   newEmail: this.newEmail,
      //   errors: this.errors
      // });

      this.showNewEmailModal = false;
      this.showEditEmailModal = false;
      this.editingEmail = null;
      this.newEmail = {
        name: '',
        subject: '',
        delay: '',
        template: 'default',
        workflow_name: '',
        workflow_url: '',
        campaign_id: '',
        email_link: '',
        send_list: '',
        suppression_lists: '',
        description: ''
      };
      this.errors = {
        name: '',
        subject: '',
        image: '',
        workflow_url: '',
        email_link: '',
      };
      this.clearFileInput();

      // console.log('After reset:', {
      //   showNewEmailModal: this.showNewEmailModal,
      //   showEditEmailModal: this.showEditEmailModal,
      //   editingEmail: this.editingEmail,
      //   newEmail: this.newEmail,
      //   errors: this.errors
      // });
    },

    getImageName() {
      if (this.editingEmail?.image_path) {
        // If we have access to original name through API, use that
        if (this.editingEmail.original_name) {
          return this.editingEmail.original_name;
        }
        // Otherwise show a friendly name
        return 'Current template image';
      } else if (this.selectedImage) {
        return this.selectedImage.name;
      }
      return 'Choose an image';
    },

    toggleZoom() {
      this.isZoomed = !this.isZoomed;
      this.imageZoom = this.isZoomed ? this.zoomLevel : 1;
      if (!this.isZoomed) {
        this.resetPosition();
      }
    },

    resetZoom() {
      this.imageZoom = 1;
      this.resetPosition();
    },

    startDrag(event) {
      if (this.imageZoom <= 1) return;
      this.isDragging = true;
      this.startX = event.clientX - this.translateX;
      this.startY = event.clientY - this.translateY;
      
      // Add dragging styles
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      // Add smooth transition class
      this.$refs.previewImage.classList.add('dragging');
    },

    doDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      requestAnimationFrame(() => {
        const newX = event.clientX - this.startX;
        const newY = event.clientY - this.startY;

        // Calculate bounds
        const bounds = this.$refs.imageContainer.getBoundingClientRect();
        const image = this.$refs.previewImage.getBoundingClientRect();
        
        const maxX = (image.width * this.imageZoom - bounds.width) / 2;
        const maxY = (image.height * this.imageZoom - bounds.height) / 2;

        // Apply bounds with smooth clamping
        this.translateX = Math.max(Math.min(newX, maxX), -maxX);
        this.translateY = Math.max(Math.min(newY, maxY), -maxY);
      });
    },

    stopDrag() {
      if (!this.isDragging) return;
      this.isDragging = false;
      
      // Remove dragging styles
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      // Remove smooth transition class
      this.$refs.previewImage.classList.remove('dragging');
    },

    applyMomentum() {
      const friction = 0.95;
      const animate = () => {
        if (Math.abs(this.dragVelocity.x) < 0.1 && Math.abs(this.dragVelocity.y) < 0.1) return;

        this.dragVelocity.x *= friction;
        this.dragVelocity.y *= friction;

        const newX = this.translateX + this.dragVelocity.x;
        const newY = this.translateY + this.dragVelocity.y;

        // Apply bounds checking here too
        const bounds = this.$refs.imageContainer.getBoundingClientRect();
        const image = this.$refs.previewImage.getBoundingClientRect();
        const maxX = (image.width * this.imageZoom - bounds.width) / 2;
        const maxY = (image.height * this.imageZoom - bounds.height) / 2;

        this.translateX = Math.max(Math.min(newX, maxX), -maxX);
        this.translateY = Math.max(Math.min(newY, maxY), -maxY);

        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    },

    resetPosition() {
      this.translateX = 0;
      this.translateY = 0;
      this.lastX = 0;
      this.lastY = 0;
    },

    shouldShowField(value) {
      return value && 
             value !== 'null' && 
             value !== null && 
             value.toString().trim() !== '';
    }
  }
}
</script>

<template>
  <!-- Header -->
  <div class="d-flex align-items-center mb-4">
    <div class="flex-grow-1">
      <h5 class="card-title mb-0">{{ selectedFlow.name }} Flow</h5>
      <p class="text-muted mb-0">{{ selectedFlow.description }}</p>
    </div>
    <div class="flex-shrink-0">
      <BButton variant="soft-primary" size="sm" @click="addEmailToFlow">
        <i class="ri-mail-add-line align-middle me-1"></i> Add Email
      </BButton>
    </div>
  </div>

  <!-- Email cards grid -->
  <div class="flow-container">
    <BCol v-for="(email, index) in selectedFlow.emails" 
         :key="email.id" 
         class="email-step"
    >
      <BCard no-body class="card-animate">
        <BRow class="g-0">
          <BCol md="8">
            <BCardHeader>
              <div class="d-flex align-items-center">
                <span class="email-number me-2">{{ index + 1 }}</span>
                <h5 class="card-title mb-0">{{ email.name }}</h5>
              </div>
            </BCardHeader>
            <BCardBody>
              <p class="card-text mb-2">{{ email.subject || 'No subject' }}</p>
              <p class="card-text">
                <small class="text-muted">
                  <i class="ri-time-line align-middle me-1"></i>
                  Sends: {{ formatDelay(email.delay) }}
                </small>
              </p>
              <div class="d-flex align-items-center mt-auto">
                <BDropdown 
                  variant="link" 
                  drop-up
                  toggle-class="btn btn-soft-primary btn-sm arrow-none" 
                  menu-class="dropdown-menu-end"
                >
                  <template #button-content>
                    <i class="ri-more-2-fill"></i>
                  </template>
                  <BDropdownItem @click="viewEmailTemplate(email)">
                    <i class="ri-eye-line align-bottom me-2 text-muted"></i>View
                  </BDropdownItem>
                  <BDropdownItem @click="editEmail(email)">
                    <i class="ri-edit-line align-bottom me-2 text-muted"></i>Edit
                  </BDropdownItem>
                  <BDropdownItem 
                    @click="confirmDelete(email)"
                    :disabled="isDeleting"
                    class="text-danger"
                  >
                    <i class="ri-delete-bin-line align-bottom me-2 text-muted"></i>Delete
                  </BDropdownItem>
                </BDropdown>
              </div>
            </BCardBody>
          </BCol>
          <BCol md="4" class="email-image-col">
            <img 
              class="img-fluid"
              :src="email.image_path ? `/storage/${email.image_path}` : defaultImage"
              :alt="`${email.name} template preview`"
              @error="handleImageError"
            />
          </BCol>
        </BRow>
      </BCard>

      <!-- Arrow logic -->
      <div v-if="index < selectedFlow.emails.length - 1" 
        :class="[
          'flow-arrow',
          {
            'flow-arrow-down': (index + 1) % 4 === 0,
            'flow-arrow-right': (index + 1) % 4 !== 0 && Math.floor(index / 4) % 2 === 0,
            'flow-arrow-left': (index + 1) % 4 !== 0 && Math.floor(index / 4) % 2 === 1
          }
        ]"
      >
        <i class="bx" :class="{
          'bx-right-arrow-alt': (index + 1) % 4 !== 0 && Math.floor(index / 4) % 2 === 0,
          'bx-left-arrow-alt': (index + 1) % 4 !== 0 && Math.floor(index / 4) % 2 === 1,
          'bx-down-arrow-alt': (index + 1) % 4 === 0
        }"></i>
      </div>
    </BCol>
  </div>

  <!-- Add/Edit Email Modal -->
  <BModal
    :modelValue="showNewEmailModal || showEditEmailModal"
    :title="editingEmail ? 'Edit Email' : 'Add New Email'"
    @hide="resetEmailForm"
  >
    <BForm>
      <BFormGroup 
        label="Email Name*"
        class="mb-3"
      >
        <BFormInput
          v-model="emailName"
          placeholder="Enter email name"
          :state="errors.name ? false : null"
        />
        <BFormInvalidFeedback v-if="errors.name">
          {{ errors.name }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup 
        label="Subject Line*"
        class="mb-3"
      >
        <BFormInput
          v-model="emailSubject"
          placeholder="Enter subject line"
          :state="errors.subject ? false : null"
        />
        <BFormInvalidFeedback v-if="errors.subject">
          {{ errors.subject }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup 
        label="Send Delay*"
        class="mb-3"
      >
        <BFormInput
          v-model="emailDelay"
          placeholder="Enter when this email should be sent"
        />
        <small class="text-muted">
          Example: "Send immediately", "2 days after signup", "When user completes profile"
        </small>
      </BFormGroup>

      <BFormGroup label="Template Image">
        <div class="input-group">
          <input
            ref="fileInput"
            type="file"
            class="form-control"
            accept="image/*"
            @change="handleImageUpload"
            :state="errors.image ? false : null"
          />
          <span v-if="editingEmail?.image_path || selectedImage" class="input-group-text">
            {{ getImageName() }}
          </span>
        </div>
        <BFormInvalidFeedback v-if="errors.image">
          {{ errors.image }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <hr class="my-4">
      
      <!-- Additional Fields -->
      <BFormGroup class="mb-3" label="Workflow Name & URL">
        <div class="d-flex gap-2">
          <BFormInput
            v-model="emailWorkflowName"
            placeholder="Workflow Name"
          />
          <BFormInput
            v-model="emailWorkflowUrl"
            placeholder="Workflow URL"
            type="url"
          />
        </div>
        <BFormInvalidFeedback :state="!errors.workflow_url">
          {{ errors.workflow_url }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Campaign ID">
        <BFormInput
          v-model="emailCampaignId"
          placeholder="Campaign ID"
          type="text"
        />
      </BFormGroup>

      <BFormGroup class="mb-3" label="Email Link">
        <BFormInput
          v-model="emailLink"
          placeholder="Email URL"
          type="url"
        />
        <BFormInvalidFeedback :state="!errors.email_link">
          {{ errors.email_link }}
        </BFormInvalidFeedback>
      </BFormGroup>

      <BFormGroup class="mb-3" label="Send List">
        <BFormInput
          v-model="emailSendList"
          placeholder="Send List"
        />
      </BFormGroup>

      <BFormGroup class="mb-3" label="Suppression Lists">
        <BFormTextarea
          v-model="emailSuppressionLists"
          placeholder="Enter suppression lists"
          rows="2"
        />
      </BFormGroup>

      <BFormGroup class="mb-3" label="Description">
        <BFormTextarea
          v-model="emailDescription"
          placeholder="Enter description"
          rows="3"
        />
      </BFormGroup>
    </BForm>

    <template #footer>
      <BButton variant="secondary" @click="resetEmailForm">
        Cancel
      </BButton>
      <BButton 
        variant="primary" 
        @click="saveEmail"
        :disabled="isSaving"
      >
        {{ editingEmail ? 'Update' : 'Add' }}
      </BButton>
    </template>
  </BModal>

  <!-- Image Preview Modal -->
  <BModal
    v-model="showImagePreviewModal"
    size="xl"
    class="email-preview-modal"
    hide-footer
  >
    <template #header>
      <div class="email-preview-header w-100">
        <h5 class="modal-title">{{ previewImageTitle }}</h5>
        
        <!-- Additional Details Section -->
        <div class="preview-details bg-light p-3 rounded mt-3">
          <div class="row g-3">
            <!-- Subject Line -->
            <div class="col-12" v-if="currentPreviewEmail?.subject">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Subject Line</small>
                <span>{{ currentPreviewEmail.subject }}</span>
              </div>
            </div>

            <!-- Send Delay -->
            <div class="col-12" v-if="currentPreviewEmail?.delay">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Send Delay</small>
                <span>{{ formatDelay(currentPreviewEmail.delay) }}</span>
              </div>
            </div>

            <!-- Only show workflow if either name or URL exists -->
            <div class="col-md-6" v-if="currentPreviewEmail?.workflow_name || currentPreviewEmail?.workflow_url">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Workflow</small>
                <a 
                  v-if="currentPreviewEmail.workflow_url"
                  :href="currentPreviewEmail.workflow_url" 
                  target="_blank"
                  class="text-primary"
                >
                  {{ currentPreviewEmail.workflow_name || 'View Workflow' }}
                </a>
                <span v-else>{{ currentPreviewEmail.workflow_name }}</span>
              </div>
            </div>

            <div class="col-md-6" v-if="currentPreviewEmail?.campaign_id">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Campaign ID</small>
                <span>{{ currentPreviewEmail.campaign_id }}</span>
              </div>
            </div>

            <div class="col-md-6" v-if="currentPreviewEmail?.email_link">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Email Link</small>
                <a 
                  :href="currentPreviewEmail.email_link" 
                  target="_blank"
                  class="text-primary"
                >
                  View Email
                </a>
              </div>
            </div>

            <div class="col-md-6" v-if="currentPreviewEmail?.send_list && currentPreviewEmail.send_list !== 'null'">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Send List</small>
                <span>{{ currentPreviewEmail.send_list }}</span>
              </div>
            </div>

            <!-- Suppression Lists - Only show if value exists and is not null -->
            <div class="col-12" v-if="shouldShowField(currentPreviewEmail?.suppression_lists)">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Suppression Lists</small>
                <span>{{ currentPreviewEmail.suppression_lists }}</span>
              </div>
            </div>

            <!-- Description - Only show if value exists and is not null -->
            <div class="col-12" v-if="shouldShowField(currentPreviewEmail?.description)">
              <div class="preview-detail-item">
                <small class="text-muted d-block">Description</small>
                <p class="mb-0">{{ currentPreviewEmail.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <div 
      class="text-center position-relative preview-container" 
      tabindex="0" 
      @keyup.left="hasPreviousEmail && showPreviousEmail()"
      @keyup.right="hasNextEmail && showNextEmail()"
      @keyup.esc="showImagePreviewModal = false"
    >
      <div class="zoom-controls">
        <button class="btn btn-icon btn-soft-primary" @click="toggleZoom">
          <i :class="isZoomed ? 'ri-zoom-out-line' : 'ri-zoom-in-line'"></i>
        </button>
        <button class="btn btn-icon btn-soft-secondary" @click="resetZoom">
          <i class="ri-refresh-line"></i>
        </button>
      </div>

      <button 
        v-if="hasPreviousEmail"
        class="btn btn-icon btn-soft-light preview-nav-btn preview-nav-prev"
        @click="showPreviousEmail"
      >
        <i class="bx bx-chevron-left"></i>
      </button>

      <div 
        ref="imageContainer"
        class="image-container"
        :class="{ 'can-drag': imageZoom > 1 }"
        @mousedown="startDrag"
        @mousemove="doDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <img 
          ref="previewImage"
          :src="previewImageUrl" 
          class="preview-image"
          :style="{ 
            transform: `scale(${imageZoom}) translate3d(${translateX / imageZoom}px, ${translateY / imageZoom}px, 0)`,
            cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
          }"
          @error="handleImageError"
          :alt="previewImageTitle"
          draggable="false"
        />
      </div>

      <button 
        v-if="hasNextEmail"
        class="btn btn-icon btn-soft-light preview-nav-btn preview-nav-next"
        @click="showNextEmail"
      >
        <i class="bx bx-chevron-right"></i>
      </button>
    </div>
  </BModal>
</template>

<style scoped>
/* Container styles */
.flow-container {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin: 0 auto;
}

/* Only apply these styles for mobile */
@media (max-width: 767px) {
  .flow-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
    max-width: 100vw;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  .email-step {
    min-width: 0;
    margin-bottom: 0.75rem;
  }

  .email-step .card {
    height: auto;
    min-height: 120px;
    width: 100%;
    max-width: 100%;
  }

  .email-step .row {
    margin: 0;
    width: 100%;
    max-width: 100%;
  }

  /* Hide image column on mobile */
  .email-image-col {
    display: none;
  }

  /* Hide arrows on mobile */
  .flow-arrow {
    display: none;
  }

  /* Adjust text column width on mobile */
  .email-step .col-md-8 {
    width: 100%;
    flex: 0 0 100%;
    max-width: 100%;
    padding: 0.75rem;
  }
}

/* Card styles */
.email-step {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.card-animate {
  height: 100%;
  margin: 0; /* Remove any margin */
}

/* Make cards same height */
.email-step .card {
  height: 200px;
  border: 1px solid var(--vz-border-color);
}

.email-step .row {
  height: 100%;
  margin: 0;
}

/* Column sizing */
.email-step .col-md-8,
.email-step .col-md-4 {
  padding: 0;
  height: 100%;
}

.email-image-col {
  height: 100%;
  overflow: hidden;
}

.email-image-col img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Snake pattern layout */
@media (min-width: 1200px) {
  .email-step:nth-child(8n+5) { grid-column: 4; grid-row: 2; }
  .email-step:nth-child(8n+6) { grid-column: 3; grid-row: 2; }
  .email-step:nth-child(8n+7) { grid-column: 2; grid-row: 2; }
  .email-step:nth-child(8n+8) { grid-column: 1; grid-row: 2; }
  .email-step:nth-child(8n+9) { grid-column: 1; grid-row: 3; }
  .email-step:nth-child(8n+10) { grid-column: 2; grid-row: 3; }
  .email-step:nth-child(8n+11) { grid-column: 3; grid-row: 3; }
  .email-step:nth-child(8n+12) { grid-column: 4; grid-row: 3; }
  .email-step:nth-child(8n+13) { grid-column: 4; grid-row: 4; }
  .email-step:nth-child(8n+14) { grid-column: 3; grid-row: 4; }
  .email-step:nth-child(8n+15) { grid-column: 2; grid-row: 4; }
  .email-step:nth-child(8n+16) { grid-column: 1; grid-row: 4; }
}

/* Update responsive layout */
@media (max-width: 1199px) {
  .flow-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  /* Hide arrows and images */
  .flow-arrow,
  .flow-arrow::before,
  .email-image-col {
    display: none !important;
  }

  /* Adjust text column width */
  .email-step .col-md-8 {
    width: 100% !important;
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  /* Reset card height */
  .email-step .card {
    height: auto;
    min-height: 120px;
  }

  .email-step {
    margin-bottom: 1rem;
  }
}

/* Mobile screens */
@media (max-width: 767px) {
  .flow-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }

  .card-header,
  .card-body {
    padding: 0.75rem;
  }
}

.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* Email number styles */
.email-number {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--vz-primary);
}

/* Flow arrow styles */
.flow-arrow {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vz-primary);
  font-size: 1.5rem;
  z-index: 1;
}

.flow-arrow-right {
  right: -1.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.flow-arrow-left {
  left: -1.5rem;
  top: 50%;
  transform: translateY(-50%);
}

.flow-arrow-down {
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
}

.flow-arrow::before {
  content: '';
  position: absolute;
  background-color: var(--vz-primary);
  opacity: 0.3;
}

.flow-arrow-right::before {
  width: .5rem;
  height: 2px;
  right: 100%;
}

.flow-arrow-left::before {
  width: .5rem;
  height: 2px;
  left: 100%;
}

.flow-arrow-down::before {
  width: 2px;
  height: 1.5rem;
  bottom: 100%;
}

/* Preview modal styles */
.email-preview-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
}

.preview-container {
  overflow: hidden;
  position: relative;
  min-height: 300px;
  user-select: none;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container.can-drag {
  cursor: grab;
}

.image-container.can-drag:active {
  cursor: grabbing;
}

.preview-image {
  max-height: 70vh;
  max-width: 100%;
  width: auto;
  display: block;
  will-change: transform;
  transition: transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  transform-origin: center center;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  margin: 0;
}

.preview-image.dragging {
  transition: none;
}

.zoom-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 30;
}

.zoom-controls .btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.zoom-controls .btn i {
  font-size: 1.1rem;
}

.preview-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--vz-border-color);
  transition: all 0.3s ease;
  z-index: 20;
  cursor: pointer;
}

.preview-nav-btn:hover {
  background: var(--vz-primary);
  color: white;
  border-color: var(--vz-primary);
}

.preview-nav-prev {
  left: 1rem;
}

.preview-nav-next {
  right: 1rem;
}

.preview-detail-item {
  display: flex;
  flex-direction: column;
}

.preview-detail-item i {
  font-size: 1.1rem;
  color: var(--vz-primary);
}

.object-fit-cover {
  object-fit: cover;
}

/* Add these styles for the dropdown */
.btn.arrow-none::after {
  display: none;
}

.btn-soft-primary {
  color: var(--vz-primary);
  background-color: rgba(var(--vz-primary-rgb), 0.1);
  transition: all 0.3s ease;
}

.btn-soft-primary:hover {
  color: #fff;
  background-color: var(--vz-primary);
}

.email-preview-modal .modal-header {
  padding: 1rem;
  position: relative;
}

/* Remove custom btn-close styles and let Bootstrap handle it */
.btn-close {
  position: absolute;
  right: 1rem;
  top: 1rem;
}

/* Remove focus outline while keeping keyboard navigation */
.text-center:focus {
  outline: none;
}

/* Optional: Add a different visual indicator for keyboard focus */
.text-center:focus-visible {
  box-shadow: none;
}

/* Dropdown positioning and z-index fixes */
.d-flex.align-items-center.mt-auto {
  position: relative;
}

:deep(.dropdown-menu) {
  position: absolute !important;
  bottom: 100% !important;
  top: auto !important;
  transform: none !important;
}

:deep(.dropdown) {
  position: static;
}

/* Add these styles */
.preview-details {
  font-size: 0.9rem;
}

.preview-detail-item {
  margin-bottom: 0.5rem;
}

.preview-detail-item small {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.preview-detail-item a {
  text-decoration: none;
}

.preview-detail-item a:hover {
  text-decoration: underline;
}
</style> 