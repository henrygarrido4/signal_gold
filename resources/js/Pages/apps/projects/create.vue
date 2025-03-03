<script>
import { router } from '@inertiajs/vue3';
import { ref, watch } from "vue";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DropZone from "@/Components/widgets/dropZone.vue";
import useVuelidate from "@vuelidate/core";

import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

import Swal from "sweetalert2";
import axios from "axios";

class MyUploadAdapter {
    constructor(loader) {
        this.loader = loader;
    }

    upload() {
        return this.loader.file.then(file => {
            return new Promise((resolve, reject) => {
                // Add file size validation (2MB limit)
                const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
                if (file.size > maxFileSize) {
                    reject(`File size exceeds 2MB limit`);
                    return;
                }

                const formData = new FormData();
                formData.append('image', file);

                axios.post('/api/ckeditor/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    resolve({
                        default: response.data.url
                    });
                })
                .catch(error => {
                    reject(error);
                });
            });
        });
    }

    abort() {
        // Abort upload implementation
    }
}

function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
        return new MyUploadAdapter(loader);
    };
}

export default {
  props: {
    users: {
      type: Array,
      required: false,
      default: () => []
    },
    project: {
      type: Object,
      required: false,
      default: null
    },
    mode: {
      type: String,
      default: 'create'
    }
  },
  setup() {
    let files = ref([]);
    let dropzoneFile = ref("");
    let fileError = ref("");

    const validateFileSize = (file) => {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > 2) {
        fileError.value = `File ${file.name} exceeds 2MB limit`;
        return false;
      }
      return true;
    };

    const drop = (e) => {
      e.preventDefault();
      fileError.value = "";
      const droppedFiles = e.dataTransfer.files;
      for (let i = 0; i < droppedFiles.length; i++) {
        if (validateFileSize(droppedFiles[i])) {
          files.value.push(droppedFiles[i]);
        }
      }
    };

    const selectedFile = (e) => {
      fileError.value = "";
      const selectedFiles = e.target.files;
      for (let i = 0; i < selectedFiles.length; i++) {
        if (validateFileSize(selectedFiles[i])) {
          files.value.push(selectedFiles[i]);
        }
      }
    };

    watch(
      () => [...files.value],
      (currentValue) => {
        return currentValue;
      }
    );
    const deleteRecord = (index) => {
      files.value.splice(index, 1);
    };
    return { dropzoneFile, files, drop, selectedFile, v$: useVuelidate(), deleteRecord, fileError };
  },
  data() {
    return {
      value: this.project?.skills || ["HTML", "CSS", "Figma"],
      value1: this.project?.status ? [this.project?.status] : ["Completed"],
      value2: this.project?.priority ? [this.project?.priority] : ["High"],
      value3: this.project?.privacy ? [this.project?.privacy] : ["Private"],
      value4: this.project?.category 
        ? [this.project.category] 
        : ['Development'],
      value5: this.project?.team_lead || null,
      editor: ClassicEditor,
      editorConfig: {
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'indent',
          'outdent',
          '|',
          'imageUpload',
          'blockQuote',
          'insertTable',
          'undo',
          'redo'
        ],
        extraPlugins: [MyCustomUploadAdapterPlugin],
        image: {
          toolbar: [
            'imageStyle:inline',
            'imageStyle:block',
            'imageStyle:side',
            '|',
            'toggleImageCaption',
            'imageTextAlternative'
          ],
          upload: {
            types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff'],
          },
          styles: {
            options: [
              'block',
              'side'
            ]
          },
          resizeUnit: "%",
          resizeOptions: [ {
            name: 'resizeImage:original',
            value: null,
            label: 'Original'
          },
          {
            name: 'resizeImage:100',
            value: '100',
            label: '100%'
          }]
        },
        customUploadAdapter: (loader) => {
          return new MyUploadAdapter(loader);
        },
        uploadFailedMessage: 'Image upload failed: File size must be less than 2MB.'
      },
      editorData: this.project?.description || "<p></p>",
      content: "<h1>Some initial content</h1>",
      projectTitle: this.project?.title || "",
      projectThumbnail: null,
      date: this.project?.deadline || null,
      config: {
        enableTime: false,
        dateFormat: "Y-m-d",
      },
      thumbnailError: null,
      maxFileSize: 2,
      selectedTeamMembers: this.project?.team_members?.map(member => member.id) || [],
      errors: {
        projectTitle: '',
        description: '',
        priority: '',
        status: '',
        deadline: '',
        privacy: '',
        category: '',
        team_lead: '',
        team_members: '',
      },
      files: [],
      previewFiles: [],
      existingThumbnail: this.project?.thumbnail_url || '/images/sm-signal.png',
      existingThumbnailName: this.project?.thumbnail_name || 'default-thumbnail',
      existingFiles: this.project?.attached_files || [],
      submitUrl: this.mode === 'edit' 
        ? `/apps/projects/${this.project.id}` 
        : '/apps/projects-store',
      isSubmitting: false,
      showMembersModal: false,
      searchTerm: '',
      defaultThumbnailPath: '/images/sm-signal.png',
    };
  },
  computed: {
    userOptions() {
      return this.users?.map(user => {
        const avatarPath = user.profile_photo_path 
          ? window.location.origin + '/storage/' + user.profile_photo_path
          : null;
        
        return {
          value: user.id,
          label: user.name,
          email: user.email,
          avatar: avatarPath
        }
      }) || [];
    },
    selectedTeamMembersWithData() {
      if (!this.selectedTeamMembers || !this.users) {
        return [];
      }

      return this.selectedTeamMembers.map(memberId => {
        const user = this.users.find(u => u.id === memberId);
        if (!user) return null;

        return {
          value: user.id,
          label: user.name,
          email: user.email,
          avatar: user.profile_photo_path 
            ? window.location.origin + '/storage/' + user.profile_photo_path 
            : null
        };
      }).filter(Boolean); // Remove any null values
    },
    currentSubmitUrl() {
      return this.mode === 'edit' 
        ? `/projects/${this.project.id}` 
        : '/projects';
    },
    isPrivate() {
      const privacy = Array.isArray(this.value3) ? this.value3[0] : this.value3;
      return privacy === 'Private';
    },
    filteredUsers() {
      if (!this.searchTerm) return this.userOptions;
      const search = this.searchTerm.toLowerCase();
      return this.userOptions.filter(user => 
        user.label.toLowerCase().includes(search) || 
        user.email.toLowerCase().includes(search)
      );
    },
    displayCategory() {
      const categoryMap = {
        'D': 'Designing',
        'DV': 'Development'
      };
      return this.project?.category ? categoryMap[this.project.category] || this.project.category : 'Designing';
    },
    isDefaultThumbnail() {
      return this.existingThumbnail?.includes('sm-signal.png');
    }
  },
  methods: {
    validateThumbnail(file) {
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB > this.maxFileSize) {
        this.thumbnailError = `File size must be less than ${this.maxFileSize}MB`;
        this.projectThumbnail = null;
        return false;
      }
      this.thumbnailError = null;
      return true;
    },
    handleThumbnailChange(e) {
      const file = e.target.files[0];
      if (file) {
        if (this.validateThumbnail(file)) {
          this.projectThumbnail = file;
          // Create a preview URL for the new image
          this.existingThumbnail = URL.createObjectURL(file);
          this.existingThumbnailName = file.name;
        }
      }
    },
    validateForm() {
      let isValid = true;
      // Reset all errors
      Object.keys(this.errors).forEach(key => this.errors[key] = '');

      if (!this.projectTitle.trim()) {
        this.errors.projectTitle = 'Project title is required';
        isValid = false;
      }

      if (!this.editorData || this.editorData === '<p></p>') {
        this.errors.description = 'Project description is required';
        isValid = false;
      }

      if (!this.value2 || !this.value2.length) {
        this.errors.priority = 'Priority is required';
        isValid = false;
      }

      if (!this.value1 || !this.value1.length) {
        this.errors.status = 'Status is required';
        isValid = false;
      }

      if (!this.date) {
        this.errors.deadline = 'Deadline is required';
        isValid = false;
      }

      if (!this.value3 || !this.value3.length) {
        this.errors.privacy = 'Privacy setting is required';
        isValid = false;
      }

      if (!this.value4?.length) {
        this.errors.category = 'Category is required';
        isValid = false;
      }

      if (!this.isPrivate) {
        if (!this.value5) {
          this.errors.team_lead = 'Team lead is required';
          isValid = false;
        }
        
        // Add validation for team members
        if (!this.selectedTeamMembers.length) {
          this.errors.team_members = 'At least one team member is required';
          isValid = false;
        }
      }

      return isValid;
    },
    submitProject() {
      if (!this.validateForm()) {
        return;
      }

      const formData = new FormData();
      formData.append('title', this.projectTitle);
      formData.append('description', this.editorData);
      formData.append('priority', this.value2?.[0] || 'High');
      formData.append('status', this.value1?.[0] || 'In Progress');
      formData.append('deadline', this.date);
      
      // Get privacy value from this.value3
      const privacy = Array.isArray(this.value3) ? this.value3[0] : this.value3;
      formData.append('privacy', privacy || 'Private');
      
      const categoryValue = Array.isArray(this.value4) ? this.value4[0] : this.value4;
      // console.log('Submitting category:', categoryValue);  // Debug log
      formData.append('category', categoryValue);
      formData.append('skills', JSON.stringify(this.value || []));
      
      // Only append team lead and members if project is not private
      if (privacy !== 'Private') {
        formData.append('team_lead', this.value5);
        formData.append('team_members', JSON.stringify(this.selectedTeamMembers));
      } else {
        // For private projects, send empty values
        formData.append('team_lead', '');
        formData.append('team_members', JSON.stringify([]));
      }

      // Handle thumbnail
      if (this.projectThumbnail) {
        formData.append('thumbnail', this.projectThumbnail);
      } else if (this.isDefaultThumbnail) {
        formData.append('use_default_thumbnail', '1');
      }

      // Append existing files if any
      if (this.existingFiles.length > 0) {
        formData.append('existing_files', JSON.stringify(this.existingFiles));
      }

      // Append new files if any
      if (this.files.length > 0) {
        this.files.forEach(file => {
          formData.append('attached_files[]', file);
        });
      }

      // If in edit mode, use PUT method with _method field
      if (this.mode === 'edit' && this.project?.id) {
        formData.append('_method', 'PUT');
        router.post(`/apps/projects/${this.project.id}`, formData, {
          onSuccess: () => {
            router.visit('/apps/projects-list');
          },
          onError: (errors) => {
            this.handleErrors(errors);
          }
        });
      } else {
        // Create new project
        router.post('/apps/projects-store', formData, {
          onSuccess: () => {
            router.visit('/apps/projects-list');
          },
          onError: (errors) => {
            this.handleErrors(errors);
          }
        });
      }
    },
    handleErrors(errors) {
      console.error('Submission errors:', errors);
      this.errors = errors;
      Swal.fire({
        title: 'Error',
        text: 'Please check the form for errors',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonColor: "#34c38f",  // Match list.vue style
        confirmButtonText: 'Ok'
      });
    },
    initializeTooltips() {
      // Dispose existing tooltips
      const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltips.forEach(el => {
        const tooltip = bootstrap.Tooltip.getInstance(el);
        if (tooltip) {
          tooltip.dispose();
        }
      });

      // Initialize new tooltips with auto hide
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
        trigger: 'hover', // This makes it hide on mouse leave
        html: true,
        animation: true,
        delay: { show: 0, hide: 0 } // Remove any delay in hiding
      }));
    },
    handleFileSelect(event) {
      const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
      const newFiles = Array.from(event.target.files);
      const oversizedFiles = [];
      const validFiles = [];

      newFiles.forEach(file => {
        if (file.size > maxFileSize) {
          oversizedFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      });

      if (oversizedFiles.length > 0) {
        Swal.fire({
          title: 'Error!',
          text: `File(s) too large: ${oversizedFiles.join(', ')}. Maximum size is 2MB per file.`,
          icon: 'error',
          confirmButtonColor: "#34c38f",
          confirmButtonText: 'Ok'
        });
      }

      if (validFiles.length > 0) {
        this.files = [...this.files, ...validFiles];
        
        // Create preview data for valid files
        validFiles.forEach(file => {
          this.previewFiles.push({
            name: file.name,
            size: this.formatFileSize(file.size),
            type: file.type,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
          });
        });
      }

      // Reset the input
      event.target.value = '';
    },
    removeFile(index) {
      // If we're in edit mode and the file exists in existingFiles
      if (this.mode === 'edit' && index < (this.existingFiles?.length || 0)) {
          // Remove from existingFiles array
          this.existingFiles.splice(index, 1);
      } else {
          // For new files, adjust the index to account for existing files
          const newFileIndex = this.mode === 'edit' ? 
              index - (this.existingFiles?.length || 0) : 
              index;
              
          if (newFileIndex >= 0 && newFileIndex < this.files.length) {
              this.files.splice(newFileIndex, 1);
              this.previewFiles.splice(newFileIndex, 1);
          }
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    clearFileInput() {
      const fileInput = this.$refs.fileInput;
      if (fileInput) {
        fileInput.value = '';
      }
    },
    removeExistingThumbnail() {
      if (this.isDefaultThumbnail) {
        return;
      }
      // Set to default thumbnail
      this.existingThumbnail = '/images/sm-signal.png';
      this.existingThumbnailName = 'default-thumbnail';
      this.projectThumbnail = null; // Clear any selected file
    },
    removeExistingFile(index) {
      this.existingFiles.splice(index, 1);
    },
    async downloadFile(file) {
      try {
        const response = await fetch(file.download_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download error:', error);
        // Show error message to user
        Swal.fire({
          title: 'Error',
          text: 'Failed to download file. Please try again.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    },
    handleDownload(file) {
      // Debug logging
      // console.log('File object:', file);
      
      // Extract filename from path
      const filename = file.path.split('/').pop();
      // console.log('Extracted filename:', filename);
      
      // Use the route helper to generate the correct URL
      const downloadUrl = route('projects.download', {
          filename: filename,
          download: 1
      });
      
      // Debug logging
      // console.log('Download details:', {
      //     originalPath: file.path,
      //     extractedFilename: filename,
      //     constructedUrl: downloadUrl,
      //     routeDetails: route().current()
      // });
      
      // First try to verify the file exists
      fetch(downloadUrl)
          .then(async response => {
              if (!response.ok) {
                  const errorData = await response.json().catch(() => null);
                  throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
              }
              // If file exists, trigger download
              window.location.href = downloadUrl;
          })
          .catch(error => {
              console.error('Download failed:', error);
              Swal.fire({
                  title: 'Error',
                  text: `Failed to download file: ${error.message}`,
                  icon: 'error',
                  confirmButtonText: 'Ok'
              });
          });
    },
    // Add a method to confirm file deletion
    confirmFileRemoval(file) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to delete ${file.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: "#34c38f",
        cancelButtonColor: "#f46a6a",
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          // Check if this is an existing file
          const isExistingFile = this.existingFiles?.some(f => f.name === file.name);

          if (this.mode === 'edit' && this.project?.id && isExistingFile) {
            // Handle deletion of existing files in edit mode
            router.delete(route('projects.delete-file', { 
              project: this.project.id,
              filename: encodeURIComponent(file.name)
            }), {
              preserveScroll: true,
              preserveState: true,
              onSuccess: () => {
                // Find the exact index of the file to remove
                const fileIndex = this.existingFiles.findIndex(f => f.name === file.name);
                if (fileIndex !== -1) {
                  // Remove only this specific file
                  this.existingFiles = [
                    ...this.existingFiles.slice(0, fileIndex),
                    ...this.existingFiles.slice(fileIndex + 1)
                  ];
                }

                Swal.fire({
                  title: 'Deleted!',
                  text: 'File has been deleted successfully.',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500,
                  timerProgressBar: true
                });
              },
              onError: (errors) => {
                Swal.fire({
                  title: 'Error!',
                  text: errors?.message || 'Failed to delete file.',
                  icon: 'error',
                  confirmButtonColor: "#34c38f",
                  confirmButtonText: 'Ok'
                });
              }
            });
          } else {
            // Handle removal of newly added files
            const fileIndex = this.files.findIndex(f => f.name === file.name);
            const previewIndex = this.previewFiles.findIndex(f => f.name === file.name);

            if (fileIndex !== -1) {
              // Remove only this specific file
              this.files = [
                ...this.files.slice(0, fileIndex),
                ...this.files.slice(fileIndex + 1)
              ];
            }

            if (previewIndex !== -1) {
              // Remove only this specific preview
              this.previewFiles = [
                ...this.previewFiles.slice(0, previewIndex),
                ...this.previewFiles.slice(previewIndex + 1)
              ];
            }

            Swal.fire({
              title: 'Removed!',
              text: 'File has been removed from selection.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true
            });
          }
        }
      });
    },
    selectMember(member) {
      const index = this.selectedTeamMembers.indexOf(member.value);
      if (index === -1) {
        // Member not selected - add them
        this.selectedTeamMembers.push(member.value);
      } else {
        // Member already selected - remove them
        this.selectedTeamMembers.splice(index, 1);
      }
    },
    openMembersModal() {
      if (!this.isPrivate) {
        this.showMembersModal = true;
      }
    }
  },
  components: {
    DropZone,
    Layout,
    PageHeader,
    ckeditor: CKEditor.component,
    Multiselect,
    flatPickr
  },
  mounted() {
    this.initializeTooltips();
    if (this.mode === 'edit') {
      // console.log('Existing thumbnail:', this.existingThumbnail);
      // console.log('Existing files:', this.existingFiles);
    }
  },
  watch: {
    selectedTeamMembersWithData: {
      handler() {
        this.$nextTick(() => {
          this.initializeTooltips();
        });
      },
      deep: true
    },
    project: {
      handler(newVal) {
        if (newVal) {
          this.submitUrl = `/apps/projects/${newVal.id}`;
        }
      },
      immediate: true
    },
    value3: {
      handler(newValue) {
        const privacy = Array.isArray(newValue) ? newValue[0] : newValue;
        if (privacy === 'Private') {
          this.value5 = null;
          this.selectedTeamMembers = [];
        }
      },
      immediate: true
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="mode === 'edit' ? 'Edit Project' : 'Create Project'" pageTitle="Projects" />
    <BRow>
      <BCol lg="8">
        <BCard no-body>
          <BCardBody>
            <div class="mb-3">
              <label class="form-label" for="project-title-input">Project Title</label>
              <input type="text" class="form-control" id="project-title-input" v-model="projectTitle" placeholder="Enter project title" />
              <span v-if="errors.projectTitle" class="text-danger small">{{ errors.projectTitle }}</span>
            </div>

            <div class="mb-3">
              <label class="form-label">Project Thumbnail</label>
              
              <!-- Thumbnail Preview -->
              <div v-if="existingThumbnail" class="mb-3">
                <div class="position-relative d-inline-block">
                  <img 
                    :src="existingThumbnail" 
                    class="img-thumbnail max-width-75" 
                    :alt="existingThumbnailName"
                  >
                  
                  <!-- Only show delete button if it's not the default thumbnail -->
                  <button 
                    v-if="!isDefaultThumbnail"
                    @click="removeExistingThumbnail" 
                    class="btn btn-danger btn-sm p-1 fs-6 position-absolute top-0 end-0"
                    type="button"
                  >
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>

              <!-- Thumbnail Input -->
              <input
                type="file"
                class="form-control"
                @change="handleThumbnailChange"
                accept="image/*"
                :placeholder="isDefaultThumbnail ? 'Replace default thumbnail' : 'Choose thumbnail'"
              >
              <span v-if="thumbnailError" class="text-danger small">{{ thumbnailError }}</span>
            </div>

            <div class="mb-3">
              <label class="form-label">Project Description</label>
              <ckeditor 
                :editor="editor"
                v-model="editorData"
                :config="editorConfig"
                class="form-control p-0"
              />
              <span v-if="errors.description" class="text-danger small">{{ errors.description }}</span>
            </div>

            <BRow>
              <BCol lg="4">
                <div class="mb-3 mb-lg-0">
                  <label for="choices-priority-input" class="form-label">Priority</label>
                  <Multiselect v-model="value2" name="priority" :close-on-select="true" :searchable="true" :create-option="true"
                    :options="[
                      { value: 'High', label: 'High' },
                      { value: 'Medium', label: 'Medium' },
                      { value: 'Low', label: 'Low' },
                    ]" />
                  <span v-if="errors.priority" class="text-danger small">{{ errors.priority }}</span>
                </div>
              </BCol>
              <BCol lg="4">
                <div class="mb-3 mb-lg-0">
                  <label for="choices-status-input" class="form-label">Status</label>
                  <Multiselect v-model="value1" name="status" :close-on-select="true" :searchable="true" :create-option="true"
                    :options="[
                      { value: 'In Progress', label: 'In Progress' },
                      { value: 'Completed', label: 'Completed' },
                    ]" />
                  <span v-if="errors.status" class="text-danger small">{{ errors.status }}</span>
                </div>
              </BCol>
              <BCol lg="4">
                <div>
                  <label for="datepicker-deadline-input" class="form-label">Deadline</label>
                  <flat-pickr v-model="date" :config="config" class="form-control flatpickr-input"></flat-pickr>
                  <span v-if="errors.deadline" class="text-danger small">{{ errors.deadline }}</span>
                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>

        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Attached files</h5>
          </BCardHeader>
          <BCardBody>
            <div>
              <p class="text-muted">Add Attached files here.</p>

              <input
                type="file"
                ref="fileInput"
                multiple
                class="form-control"
                @change="handleFileSelect"
                accept="*/*"
              />
              <div v-if="fileError" class="alert alert-danger mt-2">{{ fileError }}</div>
              <div class="vstack gap-2">
                <div class="border rounded" v-for="(file, index) of files" :key="index">
                  <div class="d-flex align-items-center p-2">
                    <div class="flex-grow-1">
                      <div class="pt-1">
                        <h5 class="fs-14 mb-1" data-dz-name="">
                          {{ file.name }}
                        </h5>
                        <p class="fs-13 text-muted mb-0" data-dz-size="">
                          <strong>{{ file.size / 1024 }}</strong> KB
                        </p>
                        <strong class="error text-danger" data-dz-errormessage=""></strong>
                      </div>
                    </div>
                    <div class="flex-shrink-0 ms-3">
                      <BButton variant="danger" size="sm" data-dz-remove="" @click="confirmFileRemoval(file)">
                        Delete
                      </BButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BCardBody>
        </BCard>

        <!-- Existing Files Section -->
        <div v-if="mode === 'edit' && existingFiles.length > 0" class="mb-3">
            <h6>Existing Files:</h6>
            <div class="list-group">
                <div
                    v-for="(file, index) in existingFiles"
                    :key="index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <div class="d-flex align-items-center">
                        <i class="ri-file-text-line fs-17 me-2"></i>
                        <span class="fs-14">{{ file.name }}</span>
                    </div>
                    <div class="d-flex gap-2">
                        <!-- View button -->
                        <BButton 
                            variant="soft-primary" 
                            size="sm"
                            class="btn-icon waves-effect waves-light"
                            :href="file.url"
                            target="_blank"
                            :title="'View ' + file.name"
                        >
                            <i class="ri-eye-line"></i>
                        </BButton>

                        <!-- Download button -->
                        <BButton 
                            variant="soft-info" 
                            size="sm"
                            class="btn-icon waves-effect waves-light"
                            @click.prevent="handleDownload(file)"
                            :title="'Download ' + file.name"
                        >
                            <i class="ri-download-line"></i>
                        </BButton>

                        <!-- Delete button -->
                        <BButton 
                            variant="soft-danger" 
                            size="sm"
                            class="btn-icon waves-effect waves-light"
                            @click.prevent="confirmFileRemoval(file)"
                            :title="'Delete ' + file.name"
                        >
                            <i class="ri-delete-bin-5-line"></i>
                        </BButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Files Preview Section -->
        <div v-if="previewFiles.length > 0" class="mb-3">
            <h6>Selected Files:</h6>
            <div class="list-group">
                <div
                    v-for="(file, index) in previewFiles"
                    :key="'new-' + index"
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <div class="d-flex align-items-center">
                        <!-- Show image preview for image files -->
                        <img
                            v-if="file.preview"
                            :src="file.preview"
                            class="me-2"
                            style="width: 40px; height: 40px; object-fit: cover;"
                        />
                        <!-- Show icon for non-image files -->
                        <i
                            v-else
                            class="ri-file-text-line me-2"
                            style="font-size: 24px;"
                        ></i>
                        <div>
                            <div>{{ file.name }}</div>
                            <small class="text-muted">{{ file.size }}</small>
                        </div>
                    </div>
                    <!-- Delete button for new files -->
                    <BButton 
                        variant="danger" 
                        class="btn-icon waves-effect waves-light"
                        @click.prevent="confirmFileRemoval(file)"
                        :title="'Delete ' + file.name"
                    >
                        <i class="ri-delete-bin-5-line"></i>
                    </BButton>
                </div>
            </div>
        </div>

        <div class="text-end mb-4">
          <BButton 
            @click="submitProject" 
            type="button" 
            variant="success" 
            class="w-sm"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : (mode === 'edit' ? 'Update' : 'Create') }}
          </BButton>
        </div>
      </BCol>
      <BCol lg="4">
        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Privacy</h5>
          </BCardHeader>
          <BCardBody>
            <div>
              <label for="choices-privacy-status-input" class="form-label">Status</label>
              <Multiselect v-model="value3" name="privacy" :close-on-select="true" :searchable="true" :create-option="true" :options="[
                { value: 'Private', label: 'Private' },
                { value: 'Team', label: 'Team' },
                // { value: 'Public', label: 'Public' },
              ]" />
              <span v-if="errors.privacy" class="text-danger small">{{ errors.privacy }}</span>
            </div>
          </BCardBody>
        </BCard>

        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Tags</h5>
          </BCardHeader>
          <BCardBody>
            <div class="mb-3">
              <label for="choices-categories-input" class="form-label">Categories</label>
              <Multiselect 
                v-model="value4" 
                name="category" 
                :close-on-select="true" 
                :searchable="true" 
                :create-option="true" 
                :options="[
                    { value: 'Development', label: 'Development' },
                    { value: 'Designing', label: 'Designing' }
                ]" 
              />
              <span v-if="errors.category" class="text-danger small">{{ errors.category }}</span>
            </div>

            <div>
              <label for="choices-text-input" class="form-label">Skills</label>
              <Multiselect class="form-control" v-model="value" name="skills" mode="tags" :close-on-select="true" :searchable="true"
                :create-option="true" :options="[
                  { value: 'UI/UX', label: 'UI/UX' },
                  { value: 'Figma', label: 'Figma' },
                  { value: 'HTML', label: 'HTML' },
                  { value: 'CSS', label: 'CSS' },
                  { value: 'Javascript', label: 'Javascript' },
                  { value: 'C#', label: 'C#' },
                  { value: 'Nodejs', label: 'Nodejs' },
                ]" />
            </div>
          </BCardBody>
        </BCard>

        <BCard no-body>
          <BCardHeader>
            <h5 class="card-title mb-0">Members</h5>
          </BCardHeader>
          <BCardBody>
            <div class="mb-3">
              <label for="choices-lead-input" class="form-label">
                Team Lead
                <span v-if="isPrivate" class="text-muted">(Disabled for private projects)</span>
              </label>
              <Multiselect 
                v-model="value5" 
                name="team_lead" 
                :close-on-select="true" 
                :searchable="true" 
                :create-option="true" 
                :options="userOptions" 
                :custom-label="({ label, email }) => `${label} (${email})`"
                :disabled="isPrivate"
                :class="{ 'opacity-50': isPrivate }"
              />
              <span v-if="errors.team_lead && !isPrivate" class="text-danger small">{{ errors.team_lead }}</span>
            </div>

            <div>
              <label class="form-label">
                Team Members
                <span v-if="isPrivate" class="text-muted">(Disabled for private projects)</span>
              </label>
              <div class="avatar-group">
                <template v-if="selectedTeamMembersWithData.length">
                  <BLink
                    v-for="member in selectedTeamMembersWithData"
                    :key="member.value"
                    href="#"
                    class="avatar-group-item"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    :data-bs-title="member.label"
                  >
                    <div class="avatar-xs">
                      <template v-if="member.avatar">
                        <img
                          :src="member.avatar"
                          :alt="member.label"
                          class="rounded-circle img-fluid"
                        />
                      </template>
                      <template v-else>
                        <div class="avatar-title rounded-circle bg-secondary">
                          {{ member.label.charAt(0) }}
                        </div>
                      </template>
                    </div>
                  </BLink>
                </template>
                <BLink
                  v-if="!isPrivate"
                  href="#"
                  class="avatar-group-item"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Add Members"
                  @click.prevent="openMembersModal"
                >
                  <div class="avatar-xs">
                    <div class="avatar-title fs-16 rounded-circle bg-light border-dashed border text-primary">
                      +
                    </div>
                  </div>
                </BLink>
              </div>
              <!-- Add error message display -->
              <span v-if="errors.team_members && !isPrivate" class="text-danger small d-block mt-1">
                {{ errors.team_members }}
              </span>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <!-- Add the Modal -->
    <BModal 
      v-model="showMembersModal" 
      hide-footer 
      title="Select Team Members" 
      modal-class="fadeInRight" 
      class="v-modal-custom" 
      centered
    >
      <div class="p-3">
        <!-- Search input -->
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search users..."
            v-model="searchTerm"
          />
        </div>

        <!-- Users list -->
        <div class="user-list" style="max-height: 300px; overflow-y: auto;">
          <div 
            v-for="user in filteredUsers" 
            :key="user.value"
            class="d-flex align-items-center p-2 border-bottom cursor-pointer hover-bg-light"
            :class="{ 'bg-light': selectedTeamMembers.includes(user.value) }"
            @click="selectMember(user)"
            role="button"
            :title="selectedTeamMembers.includes(user.value) ? 'Click to remove' : 'Click to add'"
          >
            <!-- User avatar -->
            <div class="avatar-xs me-3">
              <template v-if="user.avatar">
                <img
                  :src="user.avatar"
                  :alt="user.label"
                  class="rounded-circle img-fluid"
                />
              </template>
              <template v-else>
                <div class="avatar-title rounded-circle bg-secondary">
                  {{ user.label.charAt(0) }}
                </div>
              </template>
            </div>

            <!-- User info -->
            <div>
              <h6 class="mb-0">{{ user.label }}</h6>
              <small class="text-muted">{{ user.email }}</small>
            </div>

            <!-- Selected indicator -->
            <div class="ms-auto">
              <i 
                :class="[
                  selectedTeamMembers.includes(user.value) 
                    ? 'ri-checkbox-circle-fill text-success' 
                    : 'ri-add-circle-line text-muted',
                  'fs-16'
                ]"
              ></i>
            </div>
          </div>
        </div>

        <!-- Done button -->
        <div class="text-end mt-3">
          <BButton 
            variant="primary" 
            @click="showMembersModal = false"
          >
            Done
          </BButton>
        </div>
      </div>
    </BModal>
  </Layout>
</template>

<style>
/* Remove scoped to allow styles to affect CKEditor content */
.ck-content .image {
  max-width: 100% !important;
  margin: 1em 0;
}

.ck-content .image img {
  max-width: 100% !important;
  height: auto !important;
  display: block;
  margin: 0 auto;
}

/* Handle image alignment if needed */
.ck-content .image.image-style-side {
  max-width: 50%;
  float: right;
  margin-left: 1.5em;
}

@media screen and (max-width: 768px) {
  .ck-content .image.image-style-side {
    max-width: 100%;
    float: none;
    margin: 1em 0;
  }
}

.max-width-75 {
  max-width: 75px;
  height: auto;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>