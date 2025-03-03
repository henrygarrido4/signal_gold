<script setup>
import { Head } from '@inertiajs/vue3';

defineProps({
    terms: String,
});
</script>

<template>
    <Head title="Terms of Service" />

    <BContainer>
        <BRow class="justify-content-center">
            <BCol col lg="10">
                <BCard no-body>
                    <div class="bg-warning-subtle position-relative">
                        <BCardBody class="p-5">
                            <div class="text-center">
                                <h3>Terms & Conditions</h3>
                                <p class="mb-0 text-muted">Last update: 02/08/2025</p>
                            </div>
                        </BCardBody>
                        <div class="shape">
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="1440" height="60" preserveAspectRatio="none" viewBox="0 0 1440 60">
                                <g mask="url(&quot;#SvgjsMask1001&quot;)" fill="none">
                                    <path d="M 0,4 C 144,13 432,48 720,49 C 1008,50 1296,17 1440,9L1440 60L0 60z" style="fill: var(--vz-secondary-bg);"></path>
                                </g>
                                <defs>
                                    <mask id="SvgjsMask1001">
                                        <rect width="1440" height="60" fill="#ffffff"></rect>
                                    </mask>
                                </defs>
                            </svg>
                        </div>
                    </div>
                    <BCardBody class="p-4">
                        <div>
                            <h5>Welcome to Signal Dashboard!</h5>
                            <p class="text-muted">By accessing or using our platform, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree with any part of these Terms, please do not use our services.</p>
                        </div>

                        <div>
                            <h5>1. Account Creation</h5>
                            <ul class="text-muted vstack gap-2">
                                <li>Users may create an account to access certain features.</li>
                                <li>You are responsible for maintaining the confidentiality of your account and password.</li>
                                <li>You agree to provide accurate and complete information when registering.</li>
                            </ul>
                        </div>

                        <div>
                            <h5>2. User Content</h5>
                            <p class="text-muted">Users may create or upload content, including text and images ("User Content").</p>
                            <ul class="text-muted vstack gap-2">
                                <li>You retain ownership of your User Content.</li>
                                <li>You are solely responsible for the content you upload and must ensure it does not violate any laws or rights of third parties.</li>
                                <li>We do not claim ownership over your content, and you control how it is used within the platform.</li>
                            </ul>
                        </div>

                        <div>
                            <h5>3. Prohibited Activities</h5>
                            <p class="text-muted">Users may not:</p>
                            <ul class="text-muted vstack gap-2">
                                <li>Upload content that is unlawful, infringing, defamatory, obscene, or otherwise inappropriate.</li>
                                <li>Engage in fraudulent, deceptive, or misleading activities.</li>
                                <li>Attempt to interfere with the platform's functionality or security.</li>
                                <li>Use the platform to distribute malware, spam, or other harmful content.</li>
                            </ul>
                        </div>

                        <div>
                            <h5>Contact Information</h5>
                            <p class="text-muted">For any questions or concerns regarding these Terms, you may contact us at:</p>
                            <ul class="text-muted vstack gap-2">
                                <li>Website: http://www.carsignal.app/</li>
                                <li>Email: hgarrido@carscommerce.inc</li>
                            </ul>
                        </div>

                        <div class="text-end">
                            <BLink href="/" class="btn btn-success me-1">Accept</BLink>
                            <BLink href="/" class="btn btn-outline-danger"><i class="ri-close-line align-bottom me-1"></i> Decline </BLink>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>
