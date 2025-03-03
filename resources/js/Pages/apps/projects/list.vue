<script>
import { Head, Link, router } from '@inertiajs/vue3';
import {
  MoreHorizontalIcon
} from "@zhuowenli/vue-feather-icons";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import Swal from "sweetalert2";
import { BTooltip } from "bootstrap-vue-next";
import moment from 'moment';
import debounce from 'lodash/debounce';
import axios from 'axios';

import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import animationData from "@/Components/widgets/gsqxdxog.json";

import Lottie from "@/Components/widgets/lottie.vue";
import { projectWidgets1, projectWidgets2, projectWidgets3 } from "@/common/data/projects";

export default {
  props: {
    projects: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      default: () => ({})
    },
    success: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      defaultOptions: { animationData: animationData },
      removeProjectModal: false,
      projectListWidgets1: projectWidgets1,
      projectListWidgets2: projectWidgets2,
      projectListWidgets3: projectWidgets3,
      search: this.$page.props.filters?.search || '',
      dateFilter: 'All',
      localSuccess: null,
      form: {
        search: this.$page.props.filters?.search || '',
      },
      showBookmarked: this.$page.props.filters?.bookmarked || false,
    };
},
  components: {
    Layout,
    PageHeader,
    Multiselect,
    MoreHorizontalIcon,
    lottie: Lottie,
    Head, Link,
    BTooltip
  },
  watch: {
    success: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.localSuccess = newValue;
          this.showSuccessMessage(newValue);
          this.$inertia.replace(route('projects.index'));
        }
      }
    },
    'form.search'(value) {
      this.performSearch(value);
    }
  },
  mounted() {
    // console.log('Component mounted with props:', {
    //   success: this.success,
    //   allProps: this.$props
    // });
    
    if (this.success) {
      // console.log('Showing initial success message:', this.success);
      this.showSuccessMessage(this.success);
    }
  },
  methods: {
    toggleFavourite(ele) {
      ele.target.closest('.favourite-btn').classList.toggle("active");
    },

    removeProject() {
      this.removeProjectModal = true;
      document.getElementById("removeProjectModal");
      addEventListener("click", (e) => {
        document
          .getElementById("remove-project")
          .addEventListener("click", () => {
            if (e.target.closest('.project-card')) {
              e.target.closest('.project-card').remove();
            }
            this.removeProjectModal = false;
          });
      });
    },

    deleteProject(projectId) {
        this.$inertia.delete(route('projects.destroy', projectId), {
            preserveScroll: true,
            onBefore: () => {
                // console.log('Starting delete for project:', projectId);
            },
            onSuccess: () => {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Project has been deleted.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    timerProgressBar: true,
                });
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errors.error || 'Failed to delete project. Please try again.',
                    confirmButtonText: 'Ok'
                });
            }
        });
    },

    confirmRemove(projectId) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#34c38f",
            cancelButtonColor: "#f46a6a",
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                this.deleteProject(projectId);
            }
        });
    },

    formatDate(date) {
        if (!date) return '';
        
        // For deadline dates, keep the MM-DD-YYYY format
        if (date.includes('00:00:00') || !date.includes('T')) {
            const [year, month, day] = date.split('-');
            return `${month}-${day}-${year}`;
        }

        // For updated_at and created_at, use relative time
        return moment(date).fromNow();
    },

    formatDateTime(date) {
        if (!date) return '';
        return moment(date).format('MMM D, YYYY h:mm A');
    },

    getPriorityClass(priority) {
      switch(priority?.toLowerCase()) {
        case 'high':
          return 'bg-danger-subtle text-danger';
        case 'medium':
          return 'bg-warning-subtle text-warning';
        case 'low':
          return 'bg-success-subtle text-success';
        default:
          return 'bg-primary-subtle text-primary';
      }
    },

    stripHtml(html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html || '';
      return tmp.textContent || tmp.innerText || '';
    },

    truncateDescription(text) {
      if (!text) return '';
      return text.length > 80 ? text.substring(0, 80) + '...' : text;
    },

    getCategoryClass(category) {
      switch(category?.toLowerCase()) {
        case 'designing':
          return 'bg-info-subtle text-info';
        case 'development':
          return 'bg-success-subtle text-success';
        default:
          return 'bg-primary-subtle text-primary';
      }
    },

    getProjectColor(projectId) {
      // Array of available color combinations (bg-{color}-subtle)
      const colors = [
        'primary',
        'success',
        'info',
        'warning',
        'danger',
        'secondary'
      ];
      
      // Use project ID to consistently select a color
      const colorIndex = projectId % colors.length;
      return colors[colorIndex];
    },

    isWithinDateRange(projectDate) {
      const date = new Date(projectDate);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      switch(this.dateFilter) {
        case 'Today':
          return date.toDateString() === today.toDateString();
        
        case 'Yesterday':
          return date.toDateString() === yesterday.toDateString();
        
        case 'Last 7 Days':
          const last7Days = new Date(today);
          last7Days.setDate(today.getDate() - 7);
          return date >= last7Days;
        
        case 'Last 30 Days':
          const last30Days = new Date(today);
          last30Days.setDate(today.getDate() - 30);
          return date >= last30Days;
        
        case 'This Month':
          return date.getMonth() === today.getMonth() && 
                 date.getFullYear() === today.getFullYear();
        
        case 'Last Year':
          return date.getFullYear() === today.getFullYear() - 1;
        
        default: // 'All'
          return true;
      }
    },

    showSuccessMessage(message) {
      Swal.fire({
        title: 'Success!',
        text: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didClose: () => {
          this.localSuccess = null;
        }
      });
    },

    performSearch: debounce(function (value) {
      router.get(
        route('projects.index'),
        { search: value },
        { 
          preserveState: true,
          preserveScroll: true,
          replace: true 
        }
      );
    }, 300),

    toggleBookmark(project) {
      axios.post(route('projects.bookmark', project.id))
        .then(response => {
          project.is_bookmarked = response.data.bookmarked;
        })
        .catch(error => {
          console.error('Error toggling bookmark:', error);
        });
    },

    toggleBookmarkedFilter() {
      this.showBookmarked = !this.showBookmarked;
      router.get(
        route('projects.index'),
        { 
          search: this.search,
          bookmarked: this.showBookmarked 
        },
        { 
          preserveState: true,
          preserveScroll: true,
          replace: true 
        }
      );
    }
  },
  computed: {
    filteredProjects() {
        let filtered = this.projects.data; // Access the data property of paginated results
        
        // Apply search filter
        if (this.search) {
            const searchTerm = this.search.toLowerCase();
            filtered = filtered.filter(project => {
                return (
                    project.title?.toLowerCase().includes(searchTerm) ||
                    project.status?.toLowerCase().includes(searchTerm) ||
                    project.priority?.toLowerCase().includes(searchTerm) ||
                    this.stripHtml(project.description)?.toLowerCase().includes(searchTerm) ||
                    project.users?.some(member => 
                        member.name?.toLowerCase().includes(searchTerm)
                    )
                );
            });
        }
        
        // Apply date filter
        if (this.dateFilter !== 'All') {
            filtered = filtered.filter(project => {
                return this.isWithinDateRange(project.created_at) || 
                       this.isWithinDateRange(project.updated_at);
            });
        }
        
        return filtered;
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Project List" pageTitle="Projects" />
    
 

    <BRow class="g-4 mb-3">
      <BCol sm="auto">
        <div class="d-flex gap-2">
          <Link href="/apps/projects-create" class="btn btn-primary">
            <i class="ri-add-line align-bottom me-1"></i> Add New
          </Link>
          <BButton 
            variant="soft-warning" 
            :class="{ active: showBookmarked }"
            @click="toggleBookmarkedFilter"
          >
            <i class="ri-star-fill me-1"></i> Favorites
          </BButton>
        </div>
      </BCol>
      <BCol sm>
        <div class="d-flex justify-content-sm-end gap-2">
          <div class="search-box ms-2">
            <input type="text" class="form-control" placeholder="Search projects..." v-model="form.search" />
            <i class="ri-search-line search-icon"></i>
          </div>

          <Multiselect 
            class="multiselect form-control w-lg w-auto m-0" 
            v-model="dateFilter" 
            :close-on-select="true"
            :searchable="true"
            :options="[
              { value: 'All', label: 'All' },
              { value: 'Today', label: 'Today' },
              { value: 'Yesterday', label: 'Yesterday' },
              { value: 'Last 7 Days', label: 'Last 7 Days' },
              { value: 'Last 30 Days', label: 'Last 30 Days' },
              { value: 'This Month', label: 'This Month' },
              { value: 'Last Year', label: 'Last Year' },
            ]"
          />
        </div>
      </BCol>
    </BRow>

    <BRow>
      <BCol xxl="3" sm="6" class="project-card" v-for="item in filteredProjects" :key="item.id">
        <BCard no-body>
          <BCardBody>
            <!-- Colored Header Section -->
            <div class="p-3 mt-n3 mx-n3 bg rounded-top" 
                 :class="`bg-${getProjectColor(item.id)}-subtle`">
              <div class="d-flex gap-1 align-items-center justify-content-end my-n2">
                <BButton 
                  type="button" 
                  variant="transparent" 
                  class="btn avatar-xs p-0 favourite-btn"
                  :class="{ 'active': item.is_bookmarked }"
                  @click="toggleBookmark(item)"
                >
                  <span class="avatar-title bg-transparent fs-15">
                    <i class="ri-star-fill"></i>
                  </span>
                </BButton>
                <BDropdown 
                    variant="link" 
                    toggle-class="btn btn-soft-secondary btn-sm arrow-none" 
                    menu-class="dropdown-menu-end"
                >
                    <template #button-content>
                        <i class="ri-more-2-fill"></i>
                    </template>
                    
                    <!-- View option always shows -->
                    <BDropdownItem :href="route('projects.show', item.id)">
                        <i class="ri-eye-fill align-bottom me-2 text-muted"></i>View
                    </BDropdownItem>

                    <!-- Edit option only shows for project creator -->
                    <BDropdownItem 
                        v-if="item.user_id === $page.props.auth.user.id"
                        :href="route('projects.edit', item.id)"
                    >
                        <i class="ri-pencil-fill align-bottom me-2 text-muted"></i>Edit
                    </BDropdownItem>

                    <!-- Delete option only shows for project creator -->
                    <BDropdownItem 
                        v-if="item.user_id === $page.props.auth.user.id"
                        href="#" 
                        @click.prevent="confirmRemove(item.id)"
                    >
                        <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>Delete
                    </BDropdownItem>
                </BDropdown>
              </div>
              <div class="text-center pb-3">
                <img :src="item.thumbnail && item.thumbnail !== 'images/default-project.png' 
                       ? `/storage/${item.thumbnail}` 
                       : '/images/sm-signal.png'" 
                     :alt="item.title" 
                     height="32"
                     class="project-thumbnail"
                     @error="(e) => {
                       e.target.src = '/images/sm-signal.png';
                     }" />
              </div>
            </div>

            <!-- Project Details Section -->
            <div class="py-3">
              <h5 class="fs-14 mb-3">
                <Link :href="`/apps/projects/${item.id}`" class="text-body">{{ item.title }}</Link>
              </h5>
              <BRow class="gy-3">
                <BCol cols="6">
                  <div>
                    <p class="text-muted mb-1">Status</p>
                    <div :class="`badge fs-12 ${item.status_class}`">
                      {{ item.status }}
                    </div>
                  </div>
                </BCol>
                <BCol cols="6">
                  <div>
                    <p class="text-muted mb-1">Deadline</p>
                    <h5 class="fs-14">{{ formatDate(item.deadline) }}</h5>
                  </div>
                </BCol>
              </BRow>

              <!-- Team Members Section -->
              <div class="d-flex align-items-center mt-3">
                <p class="text-muted mb-0 me-2">Team:</p>
                <div v-if="item.users && item.users.length > 0" class="avatar-group">
                  <div v-for="(member, index) in item.users" 
                       :key="index"
                       class="avatar-group-item">
                    <div class="d-inline-block"
                         :id="`member-${item.id}-${index}`">
                      <div class="avatar-xxs">
                        <img v-if="member.profile_photo_url" 
                             :src="member.profile_photo_url" 
                             :alt="member.name"
                             class="rounded-circle img-fluid" 
                             @error="$event.target.src = '/images/users/avatar-1.jpg'" />
                        <span v-else 
                              class="avatar-title rounded-circle bg-primary text-white">
                          {{ member.name ? member.name.charAt(0).toUpperCase() : 'U' }}
                        </span>
                      </div>
                    </div>
                    <BTooltip 
                      :target="`member-${item.id}-${index}`" 
                      placement="top"
                      :delay="{ show: 50, hide: 50 }"
                      class="text-nowrap">
                      {{ member.name }}
                    </BTooltip>
                  </div>
                </div>
                <span v-else class="text-muted">Private</span>
              </div>
            </div>

            <!-- Progress Section -->
            <div>
              <div class="d-flex mb-2">
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center">
                    <div class="me-2">Priority:</div>
                    <div :class="`badge fs-12 ${item.priority_class}`">
                      {{ item.priority }}
                    </div>
                  </div>
                </div>
                <div class="text-end ms-3">
                    <p class="text-muted mb-1" 
                       :title="formatDateTime(item.updated_at)">
                        Last Updated: {{ formatDate(item.updated_at) }}
                    </p>
                </div>
              </div>
            </div>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>

    <BRow class="g-0 text-center text-sm-start align-items-center mb-4">
      <BCol sm="6">
        <div>
          <p class="mb-sm-0 text-muted">
            Showing <span class="fw-semibold">{{ projects.from }}</span> to
            <span class="fw-semibold">{{ projects.to }}</span> of
            <span class="fw-semibold text-decoration-underline">{{ projects.total }}</span>
            entries
          </p>
        </div>
      </BCol>
      <BCol sm="6">
        <ul class="pagination pagination-separated justify-content-center justify-content-sm-end mb-sm-0">
          <li :class="['page-item', { disabled: !projects.prev_page_url }]">
            <Link :href="projects.prev_page_url || '#'" class="page-link">Previous</Link>
          </li>
          
          <template v-for="(link, i) in projects.links" :key="i">
            <li v-if="link.url && !link.label.includes('Previous') && !link.label.includes('Next')"
                :class="['page-item', { active: link.active }]">
              <Link :href="link.url" class="page-link" v-html="link.label" />
            </li>
          </template>

          <li :class="['page-item', { disabled: !projects.next_page_url }]">
            <Link :href="projects.next_page_url || '#'" class="page-link">Next</Link>
          </li>
        </ul>
      </BCol>
    </BRow>

    <b-modal v-model="removeProjectModal" id="removeProjectModal" hide-footer class="v-modal-custom" modal-class="zoomIn"
      centered>
      <div class="mt-2 text-center">
        <lottie class="avatar-xl" colors="primary:#f7b84b,secondary:#f06548" :options="defaultOptions" :height="100"
          :width="100" />
        <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
          <h4>Are you Sure ?</h4>
          <p class="text-muted mx-4 mb-0">Are you Sure You want to Remove this Project ?</p>
        </div>
      </div>
      <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
        <BButton type="button" variant="light" class="w-sm" @click="removeProjectModal = false">Close</BButton>
        <BButton type="button" variant="danger" class="w-sm" id="remove-project">Yes, Delete It!</BButton>
      </div>
    </b-modal>

</Layout></template>

<style>
.favourite-btn.active .avatar-title i {
  color: #f7b84b !important;
}
</style>

