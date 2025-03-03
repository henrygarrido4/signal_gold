<script>
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { useForm, router } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import Swal from 'sweetalert2';
import defaultCover from '@assets/images/profile-bg.jpg';
import axios from 'axios';

export default {
  props: {
    auth: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      value: this.parseSkills(this.auth.user?.skills),
      value1: '',
      value2: '',
      date: null,
      form: useForm({
        _method: 'PUT',
        name: this.auth.user?.name || '',
        email: this.auth.user?.email || '',
        photo: null,
        first_name: this.auth.user?.first_name || '',
        last_name: this.auth.user?.last_name || '',
        phone: this.auth.user?.phone || '',
        joining_date: this.auth.user?.created_at || '',
        skills: this.parseSkills(this.auth.user?.skills),
        designation: this.auth.user?.designation || '',
        website: this.auth.user?.website || '',
        city: this.auth.user?.city || '',
        country: this.auth.user?.country || '',
        zipcode: this.auth.user?.zipcode || '',
        description: this.auth.user?.description || '',
        github_username: this.auth.user?.github_username || '',
        dribbble_username: this.auth.user?.dribbble_username || '',
        pinterest_username: this.auth.user?.pinterest_username || '',
      }),
      photoPreview: null,
      photoInput: null,
      verificationLinkSent: false,
      passwordForm: useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
        username: this.auth.user?.email || '',
      }),
      photoForm: useForm({
        photo: null,
        _method: 'POST'
      }),
      coverForm: useForm({
        cover: null,
        _method: 'POST'
      }),
      coverPreview: null,
    };
  },
  components: {
    Layout,
    Multiselect,
    flatPickr
  },
  mounted() {
    this.initializeFormData();
  },
  methods: {
    parseSkills(skills) {
      if (!skills) return [];
      if (Array.isArray(skills)) return skills;
      try {
        return JSON.parse(skills);
      } catch (e) {
        if (typeof skills === 'string') {
          return skills.split(',').map(skill => skill.trim()).filter(Boolean);
        }
        console.error('Error parsing skills:', e);
        return [];
      }
    },
    initializeFormData() {
      if (this.auth.user) {
        this.form.name = this.auth.user.name || '';
        this.form.email = this.auth.user.email || '';
        this.form.first_name = this.auth.user.first_name || this.auth.user.name?.split(' ')[0] || '';
        this.form.last_name = this.auth.user.last_name || this.auth.user.name?.split(' ').slice(1).join(' ') || '';
        this.form.phone = this.auth.user.phone || '';
        this.form.joining_date = this.formattedJoiningDate;
        const skills = this.parseSkills(this.auth.user.skills);
        this.form.skills = skills;
        this.form.designation = this.auth.user.designation || '';
        this.form.website = this.auth.user.website || '';
        this.form.city = this.auth.user.city || '';
        this.form.country = this.auth.user.country || '';
        this.form.zipcode = this.auth.user.zipcode || '';
        this.form.description = this.auth.user.description || '';
        this.date = this.formattedJoiningDate;
        this.form.github_username = this.auth.user.github_username || '';
        this.form.dribbble_username = this.auth.user.dribbble_username || '';
        this.form.pinterest_username = this.auth.user.pinterest_username || '';
        this.value = skills;
      }
    },
    changepass() {
      this.passwordForm.put(route('user-password.update'), {
        errorBag: 'updatePassword',
        preserveScroll: true,
        onSuccess: () => {
          this.passwordForm.reset();
          Swal.fire({
            title: 'Success!',
            text: 'Password has been changed successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        onError: (errors) => {
          console.error('Password change error:', errors);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errors.password || errors.current_password || 'Failed to change password. Please try again.',
            confirmButtonText: 'Ok'
          });
        }
      });
    },
    updatedata() {
      this.form.post(route('user-profile-information.update'), {
        preserveScroll: true,
        onSuccess: () => {
          Swal.fire({
            title: 'Success!',
            text: 'Profile information updated successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        onError: (errors) => {
          console.error('Profile update error:', errors);
          const errorMessage = Object.values(errors).flat().join('\n');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage || 'Failed to update profile information.',
            confirmButtonText: 'Ok'
          });
        }
      });
    },
    updateProfileInformation() {
      if (this.photoInput) {
        this.form.photo = this.photoInput.files[0];
      }

      this.form.post(route('user-profile-information.update'), {
        errorBag: 'updateProfileInformation',
        preserveScroll: true,
        onSuccess: () => this.clearPhotoFileInput(),
      });
    },
    selectNewPhoto() {
      this.$refs.photoInput.click();
    },
    updatePhotoPreview() {
      const input = this.$refs.photoInput;
      const photo = input?.files?.[0];
      
      if (!photo) {
        console.error('No photo selected');
        return;
      }

      if (photo.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Profile photo must be less than 2MB in size.',
          confirmButtonText: 'Ok'
        });
        this.clearPhotoFileInput();
        return;
      }

      if (!photo.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
          confirmButtonText: 'Ok'
        });
        this.clearPhotoFileInput();
        return;
      }

      this.photoForm.photo = photo;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target.result;
      };
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to read the selected file.',
          confirmButtonText: 'Ok'
        });
      };
      reader.readAsDataURL(photo);
    },
    updateProfilePhoto() {
      if (!this.photoForm.photo) {
        console.error('No photo to upload');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select a photo first.',
          confirmButtonText: 'Ok'
        });
        return;
      }

      this.photoForm.post(
        route('api.profile-photo.update'),
        {
          preserveScroll: true,
          onSuccess: () => {
            this.photoPreview = null;
            this.clearPhotoFileInput();
            Swal.fire({
              title: 'Success!',
              text: 'Profile photo has been updated successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            });
            
            this.$inertia.reload();
          },
          onError: (errors) => {
            console.error('Upload error:', errors);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errors.photo || 'Failed to update profile photo. Please try again.',
              confirmButtonText: 'Ok'
            });
          }
        }
      );
    },
    deletePhoto() {
      router.delete(
        route('api.profile-photo.destroy'),
        {
          preserveScroll: true,
          onSuccess: () => {
            this.photoPreview = null;
            this.clearPhotoFileInput();
            
            this.$inertia.reload();
          },
        }
      );
    },
    clearPhotoFileInput() {
      const input = this.$refs.photoInput;
      if (input) {
        input.value = '';
        this.photoPreview = null;
        this.photoForm.photo = null;
        this.photoForm.reset();
      }
    },
    updateCoverPreview() {
      const input = this.$refs.coverInput;
      const cover = input?.files?.[0];
      
      if (!cover) {
        console.error('No cover image selected');
        return;
      }

      if (cover.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Cover photo must be less than 2MB in size.',
          confirmButtonText: 'Ok'
        });
        this.clearCoverFileInput();
        return;
      }

      if (!cover.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File',
          text: 'Please select an image file.',
          confirmButtonText: 'Ok'
        });
        this.clearCoverFileInput();
        return;
      }

      this.coverForm.cover = cover;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreview = e.target.result;
      };
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to read the selected file.',
          confirmButtonText: 'Ok'
        });
      };
      reader.readAsDataURL(cover);
    },
    updateCoverPhoto() {
      if (!this.coverForm.cover) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please select a cover image first.',
          confirmButtonText: 'Ok'
        });
        return;
      }

      const form = new FormData();
      form.append('_method', 'PUT');
      form.append('cover', this.coverForm.cover);

      this.$inertia.post(
        route('api.cover-photo.update'),
        form,
        {
          forceFormData: true,
          preserveScroll: true,
          onSuccess: () => {
            this.coverPreview = null;
            this.clearCoverFileInput();
            Swal.fire({
              title: 'Success!',
              text: 'Cover photo has been updated successfully.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500,
              timerProgressBar: true,
            }).then(() => {
              window.location.reload();
            });
          },
          onError: (errors) => {
            console.error('Cover upload error:', errors);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: errors.cover || 'Failed to update cover photo. Please try again.',
              confirmButtonText: 'Ok'
            });
          }
        }
      );
    },
    clearCoverFileInput() {
      const input = this.$refs.coverInput;
      if (input) {
        input.value = '';
        this.coverPreview = null;
        this.coverForm.cover = null;
        this.coverForm.reset();
      }
    },
    updateSkills(newSkills) {
      const skills = Array.isArray(newSkills) ? newSkills : [];
      this.form.skills = skills;
      this.value = skills;
    },
    updatePortfolio() {
      this.form.post(route('user-profile-information.update'), {
        preserveScroll: true,
        onSuccess: () => {
          Swal.fire({
            title: 'Success!',
            text: 'Profile information updated successfully.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
          });
        },
        onError: (errors) => {
          console.error('Profile update error:', errors);
          const errorMessage = Object.values(errors).flat().join('\n');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage || 'Failed to update profile information.',
            confirmButtonText: 'Ok'
          });
        }
      });
    },
  },
  computed: {
    profilePhotoUrl() {
      return this.auth.user?.profile_photo_url;
    },
    userName() {
      return this.auth.user?.name;
    },
    userFirstName() {
      return this.auth.user?.first_name || this.auth.user?.name?.split(' ')[0] || '';
    },
    userLastName() {
      return this.auth.user?.last_name || this.auth.user?.name?.split(' ').slice(1).join(' ') || '';
    },
    userEmail() {
      return this.auth.user?.email;
    },
    userDesignation() {
      return this.auth.user?.designation || 'Lead Designer / Developer';
    },
    formattedJoiningDate() {
      if (!this.auth.user?.created_at) return '';
      return new Date(this.auth.user.created_at).toISOString().split('T')[0];
    },
    coverPhotoUrl() {
      return this.auth.user?.cover_photo_path 
        ? `/storage/${this.auth.user.cover_photo_path}`
        : defaultCover;
    },
    profileCompletionPercentage() {
      const fields = [
        this.auth.user?.profile_photo_path,
        this.auth.user?.first_name,
        this.auth.user?.last_name,
        this.auth.user?.email,
        this.auth.user?.phone,
        this.auth.user?.skills?.length > 0,
        this.auth.user?.designation,
        this.auth.user?.website,
        this.auth.user?.city,
        this.auth.user?.country,
        this.auth.user?.zipcode,
        this.auth.user?.description,
        this.auth.user?.github_username,
        this.auth.user?.dribbble_username,
        this.auth.user?.pinterest_username
      ];
      
      const filledFields = fields.filter(field => field).length;
      const totalFields = fields.length;
      
      return Math.round((filledFields / totalFields) * 100);
    },
    completionColor() {
      if (this.profileCompletionPercentage < 30) return 'danger';
      if (this.profileCompletionPercentage < 70) return 'warning';
      return 'success';
    }
  },
  watch: {
    value(newVal) {
      this.updateSkills(newVal);
    }
  }
};
</script>

<template>
  <Layout>
    <div class="position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg profile-setting-img">
        <img 
          :src="coverPreview || coverPhotoUrl" 
          class="profile-wid-img" 
          alt="Profile Cover" 
        />
        <div class="overlay-content">
          <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input 
                ref="coverInput"
                type="file"
                class="profile-foreground-img-file-input" 
                accept="image/*"
                @change="updateCoverPreview"
                style="display: none;"
              />
              <label 
                class="profile-photo-edit btn btn-light"
                @click="$refs.coverInput.click()"
              >
                <i class="ri-image-edit-line align-bottom me-1"></i> Change Cover
              </label>
                  <button 
                    v-if="coverPreview" 
                    class="btn btn-success ms-2 mb-2"
                    @click="updateCoverPhoto"
                  >
                Save Cover
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BRow>
      <BCol xxl="3">
        <BCard no-body class="mt-n5">
          <BCardBody class="p-4">
            <div class="text-center">
              <div class="profile-user position-relative d-inline-block mx-auto mb-4">
                <form @submit.prevent="updateProfilePhoto" enctype="multipart/form-data">
                  <img 
                    :src="photoPreview || profilePhotoUrl" 
                    class="rounded-circle avatar-xl img-thumbnail user-profile-image" 
                    :alt="userName"
                  />
                  <div class="avatar-xs p-0 rounded-circle profile-photo-edit">
                    <input
                      ref="photoInput"
                      type="file"
                      id="profile-img-file-input"
                      class="profile-img-file-input"
                      @change="updatePhotoPreview"
                      accept="image/*"
                      name="photo"
                      style="display: none;"
                    />
                    <label 
                      for="profile-img-file-input" 
                      class="profile-photo-edit avatar-xs cursor-pointer"
                      style="cursor: pointer;"
                    >
                      <span class="avatar-title rounded-circle bg-light text-body">
                        <i class="ri-camera-fill"></i>
                      </span>
                    </label>
                  </div>
                  <div v-if="photoPreview" class="mt-2">
                    <BButton
                      type="submit"
                      variant="success"
                      size="sm"
                      class="me-2"
                      :disabled="photoForm.processing"
                    >
                      {{ photoForm.processing ? 'Saving...' : 'Save Photo' }}
                    </BButton>
                    <BButton
                      type="button"
                      variant="danger"
                      size="sm"
                      @click="clearPhotoFileInput"
                    >
                      Cancel
                    </BButton>
                  </div>
                </form>
              </div>
              <h5 class="fs-16 mb-1">{{ userName }}</h5>
              <p class="text-muted mb-0">{{ userDesignation }}</p>
            </div>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardBody>
            <div class="d-flex align-items-center mb-5">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">Complete Your Profile</h5>
              </div>
            </div>

            <BProgress class="animated-progress custom-progress progress-label">
              <BProgressBar 
                :value="profileCompletionPercentage" 
                :variant="completionColor"
              >
                <div class="label">{{ profileCompletionPercentage }}%</div>
              </BProgressBar>
            </BProgress>
            <div class="mt-2 text-muted small">
              <template v-if="profileCompletionPercentage < 100">
                Complete your profile by filling in:
                <ul class="mt-1">
                  <li v-if="!auth.user?.profile_photo_path">Profile photo</li>
                  <li v-if="!auth.user?.first_name || !auth.user?.last_name">Full name</li>
                  <li v-if="!auth.user?.phone">Phone number</li>
                  <li v-if="!auth.user?.skills?.length">Skills</li>
                  <li v-if="!auth.user?.designation">Designation</li>
                  <li v-if="!auth.user?.website">Website</li>
                  <li v-if="!auth.user?.city || !auth.user?.country || !auth.user?.zipcode">Location details</li>
                  <li v-if="!auth.user?.description">Description</li>
                  <li v-if="!auth.user?.github_username">GitHub username</li>
                  <li v-if="!auth.user?.dribbble_username">Dribbble username</li>
                  <li v-if="!auth.user?.pinterest_username">Pinterest username</li>
                </ul>
              </template>
              <template v-else>
                <div class="text-success">
                  <i class="ri-checkbox-circle-line me-1"></i>
                  Your profile is complete!
                </div>
              </template>
            </div>
          </BCardBody>
        </BCard>
        <BCard no-body>
          <BCardBody>
            <div class="d-flex align-items-center mb-4">
              <div class="flex-grow-1">
                <h5 class="card-title mb-0">Portfolio</h5>
              </div>
            </div>
            <form @submit.prevent="updatePortfolio">
              <div class="mb-3 d-flex">
                <div class="avatar-xs d-block flex-shrink-0 me-3">
                  <span class="avatar-title rounded-circle fs-16 bg-body text-body">
                    <i class="ri-github-fill"></i>
                  </span>
                </div>
                <input 
                  type="text" 
                  class="form-control" 
                  id="gitUsername" 
                  placeholder="Username" 
                  v-model="form.github_username"
                />
              </div>
              <div class="mb-3 d-flex">
                <div class="avatar-xs d-block flex-shrink-0 me-3">
                  <span class="avatar-title rounded-circle fs-16 bg-primary">
                    <i class="ri-global-fill"></i>
                  </span>
                </div>
                <input 
                  type="text" 
                  class="form-control" 
                  id="websiteInput" 
                  placeholder="www.example.com"
                  v-model="form.website"
                />
              </div>
              <div class="mb-3 d-flex">
                <div class="avatar-xs d-block flex-shrink-0 me-3">
                  <span class="avatar-title rounded-circle fs-16 bg-success">
                    <i class="ri-dribbble-fill"></i>
                  </span>
                </div>
                <input 
                  type="text" 
                  class="form-control" 
                  id="dribbleName" 
                  placeholder="Username" 
                  v-model="form.dribbble_username"
                />
              </div>
              <div class="d-flex">
                <div class="avatar-xs d-block flex-shrink-0 me-3">
                  <span class="avatar-title rounded-circle fs-16 bg-danger">
                    <i class="ri-pinterest-fill"></i>
                  </span>
                </div>
                <input 
                  type="text" 
                  class="form-control" 
                  id="pinterestName" 
                  placeholder="Username" 
                  v-model="form.pinterest_username"
                />
              </div>
              <div class="mt-3 text-end">
                <BButton type="submit" variant="primary" size="sm" :disabled="form.processing">
                  {{ form.processing ? 'Saving...' : 'Save Portfolio' }}
                </BButton>
              </div>
            </form>
          </BCardBody>
        </BCard>
      </BCol>
      <BCol xxl="9">
        <BCard no-body class="mt-xxl-n5">
          <BCardBody class="p-4 pt-2">
            <BTabs nav-class="nav-tabs-custom rounded border-bottom-0" >
              <BTab class="nav-item" title="Personal Details" active>
                <form @submit.prevent="updatedata">
                  <BRow class="pt-4">
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="firstnameInput" class="form-label">First Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="firstnameInput"
                          placeholder="Enter your firstname"
                          v-model="form.first_name"
                        />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="lastnameInput" class="form-label">Last Name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="lastnameInput"
                          placeholder="Enter your lastname"
                          v-model="form.last_name"
                        />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="phonenumberInput" class="form-label">Phone Number</label>
                        <input
                          type="text"
                          class="form-control"
                          id="phonenumberInput"
                          placeholder="Enter your phone number"
                          v-model="form.phone"
                        />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input
                          type="email"
                          class="form-control"
                          id="emailInput"
                          placeholder="Enter your email"
                          v-model="form.email"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="mb-3">
                        <label for="JoiningdateInput" class="form-label">Date Joined</label>
                        <div class="form-control" id="JoiningdateInput">
                          {{ new Date(auth.user.created_at).toLocaleDateString() }}
                        </div>
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="mb-3">
                        <label for="skillsInput" class="form-label">Skills</label>
                        <Multiselect 
                          v-model="value" 
                          id="skillsinput" 
                          mode="tags" 
                          :close-on-select="false"
                          :searchable="true" 
                          :create-option="true" 
                          :options="[
                            'Illustrator',
                            'Photoshop',
                            'CSS',
                            'HTML',
                            'JavaScript',
                            'Python',
                            'PHP',
                            'Vue.js',
                            'Laravel',
                            'React',
                            'Node.js'
                          ]"
                          @update:modelValue="updateSkills"
                        />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="designationInput" class="form-label">Designation</label>
                        <input
                          type="text"
                          class="form-control"
                          id="designationInput"
                          placeholder="Designation"
                          v-model="form.designation"
                        />
                      </div>
                    </BCol>
                    <BCol lg="6">
                      <div class="mb-3">
                        <label for="websiteInput1" class="form-label">Website</label>
                        <input
                          type="text"
                          class="form-control"
                          id="websiteInput1"
                          placeholder="www.example.com"
                          v-model="form.website"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="cityInput" class="form-label">City</label>
                        <input
                          type="text"
                          class="form-control"
                          id="cityInput"
                          placeholder="City"
                          v-model="form.city"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="countryInput" class="form-label">Country</label>
                        <input
                          type="text"
                          class="form-control"
                          id="countryInput"
                          placeholder="Country"
                          v-model="form.country"
                        />
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div class="mb-3">
                        <label for="zipcodeInput" class="form-label">Zip Code</label>
                        <input
                          type="text"
                          class="form-control"
                          minlength="5"
                          maxlength="6"
                          id="zipcodeInput"
                          placeholder="Enter zipcode"
                          v-model="form.zipcode"
                        />
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="mb-3 pb-2">
                        <label for="exampleFormControlTextarea" class="form-label">Description</label>
                        <textarea
                          class="form-control"
                          id="exampleFormControlTextarea"
                          placeholder="Enter your description"
                          rows="3"
                          v-model="form.description"
                        ></textarea>
                      </div>
                    </BCol>
                    <BCol lg="12">
                      <div class="hstack gap-2 justify-content-end">
                        <BButton
                          type="submit"
                          variant="secondary"
                          :disabled="form.processing"
                        >
                          {{ form.processing ? 'Saving...' : 'Update' }}
                        </BButton>
                        <BButton type="button" variant="soft-danger">
                          Cancel
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
              <BTab title="Change Password">
                <form @submit.prevent="changepass" class="password-form">
                  <input type="hidden" name="_method" value="PUT">
                  <input 
                    type="text" 
                    name="username" 
                    :value="auth.user?.email"
                    autocomplete="username" 
                    style="display: none;"
                  />
                  <BRow class="g-2 pt-4">
                    <BCol lg="4">
                      <div>
                        <label for="oldpasswordInput" class="form-label">Old Password*</label>
                        <input 
                          type="password" 
                          class="form-control" 
                          id="oldpasswordInput"
                          v-model="passwordForm.current_password"
                          autocomplete="current-password"
                          placeholder="Enter current password" 
                        />
                        <div v-if="passwordForm.errors.current_password" class="text-danger mt-1">
                          {{ passwordForm.errors.current_password }}
                        </div>
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div>
                        <label for="newpasswordInput" class="form-label">New Password*</label>
                        <input 
                          type="password" 
                          class="form-control" 
                          id="newpasswordInput"
                          v-model="passwordForm.password"
                          autocomplete="new-password"
                          placeholder="Enter new password" 
                        />
                        <div v-if="passwordForm.errors.password" class="text-danger mt-1">
                          {{ passwordForm.errors.password }}
                        </div>
                      </div>
                    </BCol>
                    <BCol lg="4">
                      <div>
                        <label for="confirmpasswordInput" class="form-label">Confirm Password*</label>
                        <input 
                          type="password" 
                          class="form-control" 
                          id="confirmpasswordInput"
                          v-model="passwordForm.password_confirmation"
                          autocomplete="new-password"
                          placeholder="Confirm password" 
                        />
                      </div>
                    </BCol>
               
                    <BCol lg="12">
                      <div class="text-end">
                        <BButton 
                          type="submit" 
                          variant="secondary"
                          :disabled="passwordForm.processing"
                        >
                          {{ passwordForm.processing ? 'Changing Password...' : 'Change Password' }}
                        </BButton>
                      </div>
                    </BCol>
                  </BRow>
                </form>
              </BTab>
            </BTabs>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <div v-if="false" class="debug">
        Current skills: {{ value }}
        Form skills: {{ form.skills }}
    </div>
  </Layout>
</template>

