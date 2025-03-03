<script setup>
import { ref } from 'vue';
import { Link, router, useForm } from '@inertiajs/vue3';
import FormSection from '@/Components/FormSection.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import TextInput from '@/Components/TextInput.vue';
import Swal from 'sweetalert2';

const props = defineProps({
    user: Object,
});

// Split the full name into first and last name if not already provided
const names = props.user.name ? props.user.name.split(' ') : ['', ''];
const defaultFirstName = props.user.first_name || names[0] || '';
const defaultLastName = props.user.last_name || names.slice(1).join(' ') || '';

const form = useForm({
    _method: 'PUT',
    name: props.user.name,
    email: props.user.email,
    first_name: defaultFirstName,
    last_name: defaultLastName,
    photo: null,
});

const verificationLinkSent = ref(null);
const photoPreview = ref(null);
const photoInput = ref(null);

const updateProfileInformation = () => {
    if (photoInput.value) {
        form.photo = photoInput.value.files[0];
    }

    form.name = `${form.first_name} ${form.last_name}`.trim();

    form.post(route('user-profile-information.update'), {
        errorBag: 'updateProfileInformation',
        preserveScroll: true,
        onSuccess: () => {
            clearPhotoFileInput();
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
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update profile information.',
                confirmButtonText: 'Ok'
            });
        }
    });
};

const sendEmailVerification = () => {
    verificationLinkSent.value = true;
};

const selectNewPhoto = () => {
    photoInput.value.click();
};

const updatePhotoPreview = () => {
    const photo = photoInput.value.files[0];

    if (!photo) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        photoPreview.value = e.target.result;
    };

    reader.readAsDataURL(photo);
};

const deletePhoto = () => {
    router.delete(route('current-user-photo.destroy'), {
        preserveScroll: true,
        onSuccess: () => {
            photoPreview.value = null;
            clearPhotoFileInput();
        },
    });
};

const clearPhotoFileInput = () => {
    if (photoInput.value?.value) {
        photoInput.value.value = null;
    }
};
</script>

<template>
    <FormSection @submitted="updateProfileInformation" title="Profile Information" description="Update your account's profile information and email address.">

        <template #form>
            <!-- Profile Photo -->
            <div v-if="$page.props.jetstream.managesProfilePhotos" class="mb-3">
                <!-- Profile Photo File Input -->
                <div class="mb-2">
                    <input ref="photoInput" type="file" class="d-none form-control" @change="updatePhotoPreview">
                    <InputLabel for="photo" value="Photo" />
                </div>

                <div class="mb-2">
                    <!-- Current Profile Photo -->
                    <div v-show="!photoPreview">
                        <img :src="user.profile_photo_url" :alt="user.name" class="rounded-circle" width="100">
                    </div>

                    <!-- New Profile Photo Preview -->
                    <div v-show="photoPreview">
                        <span class="d-block rounded-circle w-25" :style="'background-image: url(\'' + photoPreview + '\');'" />
                    </div>
                </div>

                <BButton variant="primary" class="me-2 btn-sm" type="button" @click.prevent="selectNewPhoto">Select A New Photo</BButton>
                <BButton v-if="user.profile_photo_path" variant="danger" type="button" class="btn-sm" @click.prevent="deletePhoto">Remove Photo</BButton>

                <div class="text-danger mt-2">
                    <span>{{ form.errors.photo }}</span>
                </div>
            </div>

            <!-- Name -->
            <div class="mb-3">
                <div class="row">
                    <div class="col-md-6">
                        <InputLabel for="first_name" value="First Name" />
                        <TextInput 
                            id="first_name" 
                            v-model="form.first_name" 
                            type="text" 
                            required 
                            :class="{ 'is-invalid': form.errors.first_name }" 
                        />
                        <InputError :message="form.errors.first_name" class="mt-2" />
                    </div>
                    <div class="col-md-6">
                        <InputLabel for="last_name" value="Last Name" />
                        <TextInput 
                            id="last_name" 
                            v-model="form.last_name" 
                            type="text" 
                            required 
                            :class="{ 'is-invalid': form.errors.last_name }" 
                        />
                        <InputError :message="form.errors.last_name" class="mt-2" />
                    </div>
                </div>
            </div>

            <!-- Email -->
            <div class="mb-3">
                <InputLabel for="email" value="Email" />
                <TextInput id="email" v-model="form.email" type="email" required autocomplete="username" :class="{ 'is-invalid': form.errors.email }" />
                <InputError :message="form.errors.email" class="mt-2" />

                <div v-if="$page.props.jetstream.hasEmailVerification && user.email_verified_at === null">
                    <p class="text-sm mt-2 text-muted">
                        Your email address is unverified.

                        <Link :href="route('verification.send')" method="post" as="button" class="btn btn-sm btn-warning" @click.prevent="sendEmailVerification">
                        Click here to re-send the verification email.
                        </Link>
                    </p>

                    <div v-show="verificationLinkSent" class="alert alert-success text-success">
                        A new verification link has been sent to your email address.
                    </div>
                </div>
            </div>
        </template>

        <template #actions>
            <BButton variant="primary w-100" type="submit" :class="{ 'opacity-25': form.processing }" :disabled="form.processing">Save</BButton>
            <p v-if="form.recentlySuccessful" class="alert alert-info mt-3">Profile Saved.</p>
        </template>
    </FormSection>
</template>
