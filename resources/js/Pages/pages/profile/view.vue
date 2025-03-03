<script>
import { Head } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import sImg12 from "@assets/images/profile-bg.jpg";

export default {
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            defaultCover: sImg12,
            defaultAvatar: '/images/sm-signal.png',
            activeTab: 'personalDetails'
        };
    },
    components: {
        Layout,
        PageHeader,
        Head
    }
};
</script>

<template>
    <Layout>
        <Head :title="`${user.name}'s Profile`" />
        <PageHeader :title="`${user.name}'s Profile`" pageTitle="Pages" />

        <BRow>
            <BCol xxl="12">
                <BCard>
                    <BCardBody>
                        <div class="profile-bg position-relative mb-5">
                            <img 
                                :src="user.cover_photo_path || defaultCover" 
                                class="profile-bg-img" 
                                @error="$event.target.src = defaultCover"
                            />
                            <div class="bg-overlay"></div>
                            <div class="profile-info p-4">
                                <div class="profile-user position-relative d-inline-block">
                                    <img 
                                        :src="user.profile_photo_path || defaultAvatar" 
                                        class="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                        :alt="user.name"
                                        @error="$event.target.src = defaultAvatar"
                                    />
                                </div>
                                <h3 class="text-white mb-1">{{ user.name }}</h3>
                                <p class="text-white-75">{{ user.designation || 'No designation set' }}</p>
                            </div>
                        </div>

                        <BTabs v-model="activeTab" nav-class="nav-tabs-custom rounded card-header-tabs border-bottom-0 ">
                            <BTab title="Personal Details" value="personalDetails">
                                <div class="pt-5">
                                    <div class="table-responsive">
                                        <table class="table table-borderless mb-0">
                                            <tbody>
                                                <tr>
                                                    <th class="ps-0" scope="row">First Name :</th>
                                                    <td class="text-muted">{{ user.first_name || 'Not provided' }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="ps-0" scope="row">Last Name :</th>
                                                    <td class="text-muted">{{ user.last_name || 'Not provided' }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="ps-0" scope="row">Phone :</th>
                                                    <td class="text-muted">{{ user.phone || 'Not provided' }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="ps-0" scope="row">E-mail :</th>
                                                    <td class="text-muted">{{ user.email }}</td>
                                                </tr>
                                                <tr>
                                                    <th class="ps-0" scope="row">Location :</th>
                                                    <td class="text-muted">
                                                        {{ [user.city, user.country].filter(Boolean).join(', ') || 'Not provided' }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th class="ps-0" scope="row">Joining Date :</th>
                                                    <td class="text-muted">{{ user.joining_date }}</td>
                                                </tr>
                                                <tr v-if="user.website">
                                                    <th class="ps-0" scope="row">Website :</th>
                                                    <td class="text-muted">{{ user.website }}</td>
                                                </tr>
                                                <tr v-if="user.description">
                                                    <th class="ps-0" scope="row">Description :</th>
                                                    <td class="text-muted">{{ user.description }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </BTab>

                            <BTab title="Skills" value="skills">
                                <div class="pt-5">
                                    <div class="d-flex flex-wrap gap-2 fs-15">
                                        <BLink 
                                            v-for="skill in user.skills" 
                                            :key="skill"
                                            href="javascript:void(0);" 
                                            class="badge bg-primary-subtle text-primary"
                                        >
                                            {{ skill }}
                                        </BLink>
                                        <p v-if="!user.skills?.length" class="text-muted mb-0">No skills listed</p>
                                    </div>
                                </div>
                            </BTab>

                            <BTab title="Projects" value="projects">
                                <div class="pt-5">
                                    <div class="d-flex flex-wrap gap-4">
                                        <div class="text-center">
                                            <h5 class="fs-15 mb-1">{{ user.projects_count }}</h5>
                                            <p class="text-muted mb-0">Total Projects</p>
                                        </div>
                                        <div class="text-center">
                                            <h5 class="fs-15 mb-1">{{ user.active_projects_count }}</h5>
                                            <p class="text-muted mb-0">Active Projects</p>
                                        </div>
                                    </div>
                                </div>
                            </BTab>
                        </BTabs>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </Layout>
</template>

