<script setup>
import { Head } from '@inertiajs/vue3';

defineProps({
    policy: String,
});
</script>

<script>
import { CheckCircleIcon } from "@zhuowenli/vue-feather-icons";
export default {
    components: {
        CheckCircleIcon
    }
}
</script>

<template>
    <Head title="Privacy Policy" />
    <BContainer>
        <BRow class="justify-content-center">
            <BCol col lg="10">
                <BCard no-body>
                    <div class="bg-primary-subtle position-relative">
                        <BCardBody class="p-5">
                            <div class="text-center">
                                <h3>Privacy Policy</h3>
                                <p class="mb-0 text-muted">Last updated: February 09, 2025</p>
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
                        <div class="privacy-content">
                            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                            
                            <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>

                            <h4>Interpretation and Definitions</h4>
                            <h5>Interpretation</h5>
                            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

                            <h5>Definitions</h5>
                            <p>For the purposes of this Privacy Policy:</p>
                            <ul>
                                <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                                <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Signal Dashboard.</li>
                                <li><strong>Service</strong> refers to the Website.</li>
                                <li><strong>Website</strong> refers to Signal Dashboard, accessible from <a href="http://www.carsignal.app/" rel="external nofollow noopener" target="_blank">http://www.carsignal.app/</a></li>
                            </ul>

                            <!-- Add more sections as needed -->

                            <h4>Contact Us</h4>
                            <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                            <ul>
                                <li>By email: hgarrido@carscommerce.inc</li>
                            </ul>
                        </div>

                        <div class="text-end">
                            <BLink href="/" class="btn btn-primary">I Understand</BLink>
                        </div>
                    </BCardBody>
                </BCard>
            </BCol>
        </BRow>
    </BContainer>
</template>

<style scoped>
.privacy-content {
    h4 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: var(--vz-heading-color);
    }
    h5 {
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--vz-heading-color);
    }
    p {
        color: var(--vz-body-color);
        margin-bottom: 1rem;
    }
    ul {
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
    }
    li {
        color: var(--vz-body-color);
        margin-bottom: 0.5rem;
    }
}
</style>
