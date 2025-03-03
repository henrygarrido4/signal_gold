<script>
import { Head, Link } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import Swal from "sweetalert2";
import { onBeforeUnmount, onMounted, nextTick } from 'vue';


// Remove all image imports and use static paths instead
export default {
  props: {
    users: {
      type: Array,
      required: true,
      default: () => []
    },
    auth_id: {
      type: Number,
      required: true
    },
    debug: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      modalShow: false,
      searchQuery: '',
      defaultAvatar: 'https://ui-avatars.com/api/?name=User&color=7F9CF5&background=EBF4FF',
      defaultCover: '/images/profile-bg.jpg',
      buttonGroups: null,
      handleButtonGroupClick: null,
      showDebug: true
    };
  },
  computed: {
    filteredUsers() {
      const users = this.users || [];
      let filtered = users;

      // Apply search filter if query exists
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = users.filter(user => 
          (user.memberName || '').toLowerCase().includes(query) ||
          (user.position || '').toLowerCase().includes(query)
        );
      }

      // Sort users: authenticated user first, then alphabetically by name
      return filtered.sort((a, b) => {
        // If a is the authenticated user, it should come first
        if (a.id === this.auth_id) return -1;
        // If b is the authenticated user, it should come first
        if (b.id === this.auth_id) return 1;
        
        // For all other cases, sort alphabetically by name
        return (a.memberName || '').localeCompare(b.memberName || '');
      });
    },
  },
  methods: {
    deletefolder(event) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#f46a6a",
        confirmButtonColor: "#34c38f",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.users.splice(this.users.indexOf(event), 1);
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    },
    toggleFavourite(ele) {
      ele.target.closest('.favourite-btn').classList.toggle("active");
    },
    handleImageError(e) {
      // Use different fallbacks for different image types
      if (e.target.classList.contains('profile-img') || e.target.classList.contains('member-img')) {
        e.target.src = this.defaultAvatar;
      } else {
        e.target.src = this.defaultCover;
      }
    },
    getUserCoverPhoto(user) {
      // If no cover_photo_path or if it contains 'cars-banner', use the default
      if (!user?.cover_photo_path || user.cover_photo_path.includes('cars-banner')) {
        return this.defaultCover;
      }
      return user.cover_photo_path;
    }
  },
  setup() {
    let buttonGroups = null;
    let handleButtonGroupClick = null;

    onMounted(() => {
      nextTick(() => {
        buttonGroups = document.querySelectorAll('.filter-button');
        const listViewBtn = document.getElementById("list-view-button");
        const gridViewBtn = document.getElementById("grid-view-button");
        const list = document.querySelectorAll(".team-list");
        
        if (!buttonGroups?.length || !listViewBtn || !gridViewBtn || !list?.length) {
          console.warn('Required DOM elements not found');
          return;
        }

        handleButtonGroupClick = (event) => {
          if (event.target.id === 'list-view-button' || event.target.parentElement.id === 'list-view-button') {
            listViewBtn.classList.add("active");
            gridViewBtn.classList.remove("active");
            list.forEach((el) => {
              el.classList.add("list-view-filter");
              el.classList.remove("grid-view-filter");
            });
          } else {
            gridViewBtn.classList.add("active");
            listViewBtn.classList.remove("active");
            list.forEach((el) => {
              el.classList.remove("list-view-filter");
              el.classList.add("grid-view-filter");
            });
          }
        };

        buttonGroups.forEach(btn => {
          if (btn) {
            btn.addEventListener('click', handleButtonGroupClick);
          }
        });
      });
    });

    onBeforeUnmount(() => {
      if (buttonGroups?.length && handleButtonGroupClick) {
        buttonGroups.forEach(btn => {
          if (btn) {
            btn.removeEventListener('click', handleButtonGroupClick);
          }
        });
      }
    });

    return {
    };
  },
  components: {
    Layout,
    PageHeader,
    Head, Link
  },
  mounted() {
    // console.log('Team component mounted with props:', this.$props);
    // console.log('First user data:', this.users[0]);
    // console.log('Debug info:', this.debug);
    
    if (!this.users?.length) {
      console.warn('No users data received from server');
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader title="Team" pageTitle="Pages" />

    <BCard no-body>
      <BCardBody>
        <BRow class="g-2">
          <BCol sm="4">
            <div class="search-box">
              <input 
                type="text" 
                class="form-control" 
                v-model="searchQuery"
                placeholder="Search for name or designation..."
              >
              <i class="ri-search-line search-icon"></i>
            </div>
          </BCol>
          <BCol sm="auto" class="ms-auto">
            <div class="list-grid-nav hstack gap-1">
              <BButton type="button" id="grid-view-button"
                class="btn btn-soft-info nav-link btn-icon fs-14 active filter-button"><i class="ri-grid-fill"></i>
              </BButton>
              <BButton type="button" id="list-view-button"
                class="btn btn-soft-info nav-link  btn-icon fs-14 filter-button"><i class="ri-list-unordered"></i>
              </BButton>
            </div>
          </BCol>
        </BRow>
      </BCardBody>
    </Bcard>

    <BRow>
      <BCol lg="12">
        <div>
          <div id="teamlist">
            <BRow class="team-list grid-view-filter" id="team-member-list">
              <BCol v-for="user in filteredUsers" :key="user.id">
                <BCard no-body class="team-box">
                  <div class="team-cover">
                    <img 
                      :src="getUserCoverPhoto(user)"
                      :alt="`${user.memberName}'s Cover`" 
                      class="img-fluid cover-img" 
                      @error="handleImageError"
                    />
                  </div>
                  <BCardBody class="p-4">
                    <BRow class="align-items-center team-row">
                      <BCol class="team-settings">
                        <BRow>
                          <BCol>
                            <div class="flex-shrink-0 me-2">
                              <!-- Empty space for consistency -->
                            </div>
                          </BCol>

                          <!-- Replace the conditional dropdown with a consistent empty space -->
                          <div class="col text-end" style="min-height: 10px;">
                            <!-- Empty placeholder for consistent spacing -->
                          </div>

                        </BRow>
                      </BCol>
                      <BCol lg="4" class="col">
                        <div class="team-profile-img">
                          <div v-if="user.memberImg" class="avatar-lg img-thumbnail rounded-circle flex-shrink-0">
                            <img 
                              :src="user.memberImg || defaultAvatar" 
                              :alt="user.memberName" 
                              class="member-img img-fluid d-block rounded-circle"
                              @error="handleImageError"
                            />
                          </div>
                          <div 
                            v-else 
                            class="avatar-lg img-thumbnail rounded-circle flex-shrink-0 bg-primary-subtle text-primary d-flex justify-content-center align-items-center"
                          >
                            {{ user.nickname }}
                          </div>
                          <div class="team-content">
                            <Link class="member-name" :href="`/profile/${user.id}`">
                              <h5 class="fs-16 mb-1">{{ user.memberName }}</h5>
                            </Link>
                            <p class="text-muted member-designation mb-0">{{ user.position }}</p>
                          </div>
                        </div>
                      </BCol>
                      <BCol col lg="2">
                        <div class="text-end">
                          <Link 
                            :href="`/pages/profile/${user.id}`" 
                            class="btn btn-light view-btn"
                          >
                            View Profile
                          </Link>
                        </div>
                      </BCol>
                    </BRow>
                  </BCardBody>
                </BCard>
              </BCol>
            </BRow>
         
          </div>
          <div class="py-4 mt-4 text-center" id="noresult" v-show="filteredUsers.length === 0">
            <div class="avatar-lg mx-auto">
                <div class="avatar-title bg-light text-secondary rounded-circle fs-24">
                    <i class="ri-search-line"></i>
                </div>
            </div>
            <h5 class="mt-4">Sorry! No Results Found</h5>
          </div>
          <!-- Modal -->

          <BModal v-model="modalShow" hide-footer hide-header hide-header-close content-class="border-0"
            class="v-modal-custom" centered>
            <form autocomplete="off" id="memberlist-form" class="needs-validation" novalidate>
              <BRow>
                <BCol lg="12">
                  <input type="hidden" id="memberid-input" class="form-control" value="">
                  <div class="px-1 pt-1">
                    <div class="modal-team-cover position-relative mb-0 mt-n4 mx-n4 rounded-top overflow-hidden">
                      <img 
                        src="https://placehold.co/1200x400/EBF4FF/7F9CF5?text=Cover+Image" 
                        alt="Cover" 
                        id="cover-img" 
                        class="img-fluid" 
                      />
                      <div class="d-flex position-absolute start-0 end-0 top-0 p-3">
                        <div class="flex-grow-1">
                          <h5 class="modal-title text-white" id="createMemberLabel">Add New Members</h5>
                        </div>
                        <div class="flex-shrink-0">
                          <div class="d-flex gap-3 align-items-center">
                            <div>
                              <label for="cover-image-input" class="mb-0" data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Select Cover Image">
                                <div class="avatar-xs">
                                  <div class="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                    <i class="ri-image-fill"></i>
                                  </div>
                                </div>
                              </label>
                              <input class="form-control d-none" value="" id="cover-image-input" type="file"
                                accept="image/png, image/gif, image/jpeg">
                            </div>
                            <BButton type="button" class="btn-close btn-close-white" id="createMemberBtn-close"
                              @click="modalShow = !modalShow"></BButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center mb-4 mt-n5 pt-2">
                    <div class="position-relative d-inline-block">
                      <div class="position-absolute bottom-0 end-0">
                        <label for="member-image-input" class="mb-0" data-bs-toggle="tooltip" data-bs-placement="right"
                          title="Select Member Image">
                          <div class="avatar-xs">
                            <div class="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                              <i class="ri-image-fill"></i>
                            </div>
                          </div>
                        </label>
                        <input class="form-control d-none" value="" id="member-image-input" type="file"
                          accept="image/png, image/gif, image/jpeg">
                      </div>
                      <div class="avatar-lg">
                        <div class="avatar-title bg-light rounded-circle">
                          <img 
                            src="https://ui-avatars.com/api/?name=New+User&color=7F9CF5&background=EBF4FF" 
                            id="member-img"
                            class="avatar-md rounded-circle h-auto" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="teammembersName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="teammembersName" placeholder="Enter name" required>
                    <div class="invalid-feedback">Please Enter a member name.</div>
                  </div>

                  <div class="mb-4">
                    <label for="designation" class="form-label">Designation</label>
                    <input type="text" class="form-control" id="designation" placeholder="Enter designation" required>
                    <div class="invalid-feedback">Please Enter a designation.</div>
                  </div>
                  <input type="hidden" id="project-input" class="form-control" value="">
                  <input type="hidden" id="task-input" class="form-control" value="">

                  <div class="hstack gap-2 justify-content-end">
                    <BButton type="button" variant="light" @click="modalShow = false">Close</BButton>
                    <BButton type="submit" variant="success" id="addNewMember">Add Member</BButton>
                  </div>
                </BCol>
              </BRow>
            </form>
          </BModal>

          <div class="offcanvas offcanvas-end border-0" tabindex="-1" id="member-overview">
            <div class="offcanvas-body profile-offcanvas p-0">
              <div class="team-cover">
                <img 
                  :src="defaultCover"
                  alt="Member Cover" 
                  class="img-fluid"
                  @error="handleImageError" 
                />
              </div>
              <div class="p-3">
                <div class="team-settings">
                  <BRow>
                    <BCol>
                      <button type="button" class="btn btn-light btn-icon rounded-circle btn-sm favourite-btn "> <i
                          class="ri-star-fill fs-14"></i> </button>
                    </BCol>
                    <BCol class="text-end dropdown">
                      <BLink href="javascript:void(0);" id="dropdownMenuLink14" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="ri-more-fill fs-17"></i>
                      </BLink>
                      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink14">
                        <li><BLink class="dropdown-item" href="javascript:void(0);"><i
                              class="ri-star-line me-2 align-middle"></i>Favorites</BLink></li>
                        <li><BLink class="dropdown-item" href="javascript:void(0);"><i
                              class="ri-delete-bin-5-line me-2 align-middle"></i>Delete</BLink></li>
                      </ul>
                    </BCol>
                  </BRow>
                </div>
              </div>
              <div class="p-3 text-center">
                <img 
                  src="/images/users/iterable.png" 
                  alt=""
                  class="avatar-lg img-thumbnail rounded-circle mx-auto profile-img"
                >
                <div class="mt-3">
                  <h5 class="fs-15 profile-name">Nancy Martino</h5>
                  <p class="text-muted profile-designation">Team Leader & HR</p>
                </div>
                <div class="hstack gap-2 justify-content-center mt-4">
                  <div class="avatar-xs">
                    <BLink href="javascript:void(0);" class="avatar-title bg-secondary-subtle text-secondary rounded fs-16">
                      <i class="ri-slack-fill"></i>
                    </BLink>
                  </div>
                  <div class="avatar-xs">
                    <BLink href="javascript:void(0);" class="avatar-title bg-info-subtle text-info rounded fs-16">
                      <i class="ri-linkedin-fill"></i>
                    </BLink>
                  </div>
                  <div class="avatar-xs">
                    <BLink href="javascript:void(0);" class="avatar-title bg-danger-subtle text-danger rounded fs-16">
                      <i class="ri-dribbble-fill"></i>
                    </BLink>
                  </div>
                </div>
              </div>
              <BRow class="g-0 text-center">
                <BCol cols="6">
                  <div class="p-3 border border-dashed border-start-0">
                    <h5 class="mb-1 profile-project">124</h5>
                    <p class="text-muted mb-0">Projects</p>
                  </div>
                </BCol>
                <BCol cols="6">
                  <div class="p-3 border border-dashed border-start-0">
                    <h5 class="mb-1 profile-task">81</h5>
                    <p class="text-muted mb-0">Tasks</p>
                  </div>
                </BCol>
              </BRow>
              <div class="p-3">
                <h5 class="fs-15 mb-3">Personal Details</h5>
                <div class="mb-3">
                  <p class="text-muted text-uppercase fw-semibold fs-12 mb-2">Number</p>
                  <h6>+(256) 2451 8974</h6>
                </div>
                <div class="mb-3">
                  <p class="text-muted text-uppercase fw-semibold fs-12 mb-2">Email</p>
                  <h6>nancymartino@email.com</h6>
                </div>
                <div>
                  <p class="text-muted text-uppercase fw-semibold fs-12 mb-2">Location</p>
                  <h6 class="mb-0">Carson City - USA</h6>
                </div>
              </div>
              <div class="p-3 border-top">
                <h5 class="fs-15 mb-4">File Manager</h5>
                <div class="d-flex mb-3">
                  <div class="flex-shrink-0 avatar-xs">
                    <div class="avatar-title bg-danger-subtle text-danger rounded fs-16">
                      <i class="ri-image-2-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-1"><BLink href="javascript:void(0);">Images</BLink></h6>
                    <p class="text-muted mb-0">4469 Files</p>
                  </div>
                  <div class="text-muted">
                    12 GB
                  </div>
                </div>
                <div class="d-flex mb-3">
                  <div class="flex-shrink-0 avatar-xs">
                    <div class="avatar-title bg-secondary-subtle text-secondary rounded fs-16">
                      <i class="ri-file-zip-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-1"><BLink href="javascript:void(0);">Documents</BLink></h6>
                    <p class="text-muted mb-0">46 Files</p>
                  </div>
                  <div class="text-muted">
                    3.46 GB
                  </div>
                </div>
                <div class="d-flex mb-3">
                  <div class="flex-shrink-0 avatar-xs">
                    <div class="avatar-title bg-success-subtle text-success rounded fs-16">
                      <i class="ri-live-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-1"><BLink href="javascript:void(0);">Media</BLink></h6>
                    <p class="text-muted mb-0">124 Files</p>
                  </div>
                  <div class="text-muted">
                    4.3 GB
                  </div>
                </div>
                <div class="d-flex">
                  <div class="flex-shrink-0 avatar-xs">
                    <div class="avatar-title bg-primary-subtle text-primary rounded fs-16">
                      <i class="ri-error-warning-line"></i>
                    </div>
                  </div>
                  <div class="flex-grow-1 ms-3">
                    <h6 class="mb-1"><BLink href="javascript:void(0);">Others</BLink></h6>
                    <p class="text-muted mb-0">18 Files</p>
                  </div>
                  <div class="text-muted">
                    846 MB
                  </div>
                </div>
              </div>
            </div>
            <div class="offcanvas-foorter border p-3 hstack gap-3 text-center position-relative">
              <BButton variant="light" class="w-100"><i class="ri-question-answer-fill align-bottom ms-1"></i> Send
                Message</BButton>
              <Link href="/pages/profile" class="btn btn-primary w-100"><i class="ri-user-3-fill align-bottom ms-1"></i>
                View Profile</Link>
            </div>
          </div>
        </div>
      </BCol>
    </BRow>
  </Layout>
</template>
