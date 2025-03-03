<script>
import { Head, Link } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";
import 'swiper/css/navigation';

export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            Autoplay,
            Navigation
        };
    },
    components: {
        Layout,
        Swiper,
        SwiperSlide,
        Head,
        Link
    },
    computed: {
        coverPhotoUrl() {
            return this.user?.cover_photo_path 
                ? `/storage/${this.user.cover_photo_path}`
                : '/images/profile-bg.jpg';
        }
    },
    methods: {
        getInitials(name) {
            if (!name) return '';
            return name.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2); // Limit to 2 characters
        }
    }
};
</script>

<template>
    <Layout>
        <div class="profile-foreground position-relative mx-n4 mt-n4">
            <div class="profile-wid-bg">
                <img 
                    :src="coverPhotoUrl" 
                    alt="" 
                    class="profile-wid-img" 
                />
            </div>
        </div>
        <div class="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <BRow class="g-4">
                <BCol cols="auto">
                    <div class="avatar-lg">
                        <div v-if="user.profile_photo_path" class="img-thumbnail rounded-circle">
                            <img 
                                :src="`/storage/${user.profile_photo_path}`"
                                :alt="user.name" 
                                class="img-thumbnail rounded-circle" 
                            />
                        </div>
                        <div 
                            v-else 
                            class="img-thumbnail rounded-circle bg-primary-subtle text-primary d-flex justify-content-center align-items-center"
                            style="width: 100%; height: 100%;"
                        >
                            {{ user.nickname || getInitials(user.name) }}
                        </div>
                    </div>
                </BCol>
                <BCol>
                    <div class="p-2">
                        <h3 class="text-white mb-1">{{ user.name }}</h3>
                        <p class="text-white text-opacity-75">{{ user.designation || 'Member' }}</p>
                        <div class="hstack text-white-50 gap-1">
                            <div v-if="user.location" class="me-2">
                                <i class="ri-map-pin-user-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                                {{ user.location }}
                            </div>
                            <div v-if="user.company">
                                <i class="ri-building-line me-1 text-white text-opacity-75 fs-16 align-middle"></i>
                                {{ user.company }}
                            </div>
                        </div>
                    </div>
                </BCol>
            </BRow>
        </div>

        <BRow>
            <BCol xxl="3">
                <BCard no-body>
                    <BCardBody>
                        <h5 class="card-title mb-3">Info</h5>
                        <div class="table-responsive">
                            <table class="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th class="ps-0" scope="row">Full Name:</th>
                                        <td class="text-muted">{{ user.name }}</td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Email:</th>
                                        <td class="text-muted">{{ user.email }}</td>
                                    </tr>
                                    <tr v-if="user.phone">
                                        <th class="ps-0" scope="row">Phone:</th>
                                        <td class="text-muted">{{ user.phone }}</td>
                                    </tr>
                                    <tr v-if="user.designation">
                                        <th class="ps-0" scope="row">Designation:</th>
                                        <td class="text-muted">{{ user.designation }}</td>
                                    </tr>
                                    <tr v-if="user.location">
                                        <th class="ps-0" scope="row">Location:</th>
                                        <td class="text-muted">{{ user.city }} {{ user.country ? `, ${user.country}` : '' }}</td>
                                    </tr>
                                    <tr>
                                        <th class="ps-0" scope="row">Joining Date:</th>
                                        <td class="text-muted">{{ new Date(user.created_at).toLocaleDateString() }}</td>
                                    </tr>
                              
                                </tbody>
                            </table>
                        </div>
                    </BCardBody>
                </BCard>

                <!-- Skills Card -->
                <BCard no-body v-if="user.skills?.length">
                    <BCardBody>
                        <h5 class="card-title mb-4">Skills</h5>
                        <div class="d-flex flex-wrap gap-2 fs-15">
                            <BLink 
                                v-for="skill in user.skills" 
                                :key="skill"
                                href="javascript:void(0);" 
                                class="badge bg-primary-subtle text-primary"
                            >
                                {{ skill }}
                            </BLink>
                        </div>
                    </BCardBody>
                </BCard>

                <!-- Portfolio Links -->
                <BCard no-body class="mt-4">
                    <BCardBody>
                        <h5 class="card-title mb-4">Portfolio</h5>
                        <div class="d-flex flex-column gap-3">
                            <a 
                                v-if="user.github_username"
                                :href="`https://github.com/${user.github_username}`"
                                target="_blank"
                                rel="noopener"
                                class="d-flex align-items-center"
                            >
                                <div class="avatar-xs me-3">
                                    <div class="avatar-title rounded-circle bg-light text-dark">
                                        <i class="ri-github-fill"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-14 mb-0">Github</h5>
                                    <small class="text-muted">@{{ user.github_username }}</small>
                                </div>
                            </a>

                            <a 
                                v-if="user.dribbble_username"
                                :href="`https://dribbble.com/${user.dribbble_username}`"
                                target="_blank"
                                rel="noopener"
                                class="d-flex align-items-center"
                            >
                                <div class="avatar-xs me-3">
                                    <div class="avatar-title rounded-circle bg-light text-danger">
                                        <i class="ri-dribbble-fill"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-14 mb-0">Dribbble</h5>
                                    <small class="text-muted">@{{ user.dribbble_username }}</small>
                                </div>
                            </a>

                            <a 
                                v-if="user.pinterest_username"
                                :href="`https://pinterest.com/${user.pinterest_username}`"
                                target="_blank"
                                rel="noopener"
                                class="d-flex align-items-center"
                            >
                                <div class="avatar-xs me-3">
                                    <div class="avatar-title rounded-circle bg-light text-danger">
                                        <i class="ri-pinterest-fill"></i>
                                    </div>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-14 mb-0">Pinterest</h5>
                                    <small class="text-muted">@{{ user.pinterest_username }}</small>
                                </div>
                            </a>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>

            <BCol xxl="9">
                <BCard no-body>
                    <BCardBody>
                        <h5 class="card-title mb-3">About</h5>
                        <p v-if="user.description">{{ user.description }}</p>
                        <p v-else class="text-muted">No bio available.</p>

                        <BRow>
                            <BCol v-if="user.designation" cols="6" md="4">
                                <div class="d-flex mt-4">
                                    <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                                        <div class="avatar-title bg-light rounded-circle fs-16 text-primary">
                                            <i class="ri-user-2-fill"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1 overflow-hidden">
                                        <p class="mb-1">Designation:</p>
                                        <h6 class="text-truncate mb-0">{{ user.designation }}</h6>
                                    </div>
                                </div>
                            </BCol>
                            <BCol v-if="user.website" cols="6" md="4">
                                <div class="d-flex mt-4">
                                    <div class="flex-shrink-0 avatar-xs align-self-center me-3">
                                        <div class="avatar-title bg-light rounded-circle fs-16 text-primary">
                                            <i class="ri-global-line"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1 overflow-hidden">
                                        <p class="mb-1">Website:</p>
                                        <BLink :href="user.website" class="fw-semibold">{{ user.website }}</BLink>
                                    </div>
                                </div>
                            </BCol>
                        </BRow>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

