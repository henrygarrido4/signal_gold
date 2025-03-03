<script>
import Layout from "@/Layouts/main.vue";

export default {
    components: {
        Layout
    },
};
</script>

<template>
    <Layout>
        <BRow>
            <BCol lg="12">
                <BCard no-body class="rounded-0 bg-success-subtle mx-n4 mt-n4 border-top">
                    <div class="px-4">
                        <BRow>
                            <BCol xxl="5" class="align-self-center">
                                <div class="py-4">
                                    <h4 class="display-6 coming-soon-text">Frequently asked questions</h4>
                                    <p class="text-success fs-15 mt-3">If you can not find answer to your question in
                                        our FAQ, you can always contact us or email us. We will answer you shortly!</p>
                                    <div class="hstack flex-wrap gap-2">
                                        <BButton 
                                            pill 
                                            variant="primary" 
                                            type="button" 
                                            class="btn-label"
                                            :href="'https://mail.google.com/mail/?view=cm&fs=1&to=hgarrido@carscommerce.inc&su=Support Request&body=Hello, I need assistance...'"
                                            target="_blank"
                                        >
                                            <i class="ri-mail-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                            Email Us
                                        </BButton>
                                        <BButton 
                                            :href="'https://slack.com/app_redirect?channel=U07HZ2KJYG0'"
                                            pill 
                                            variant="info" 
                                            type="button" 
                                            class="btn-label" 
                                            target="_blank"
                                        >
                                            <i class="ri-slack-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                            Message Us on Slack
                                        </BButton>
                                    </div>
                                </div>
                            </BCol>
                            <BCol xxl="3" class="ms-auto">
                                <div class="mb-n5 pb-1 faq-img d-none d-xxl-block">
                                    <img src="@assets/images/faq-img.png" alt="" class="img-fluid">
                                </div>
                            </BCol>
                        </BRow>
                    </div>
                </BCard>

                <BRow class="justify-content-evenly mb-4">
                    <BCol lg="4">
                        <div class="mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-shrink-0 me-1">
                                    <i class="ri-question-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-16 mb-0 fw-semibold">General Questions</h5>
                                </div>
                            </div>

                            <BAccordion class="accordion-border-box" id="genques-accordion">
                                <BAccordionItem title="How do our email campaign metrics compare over time?" visible>
                                    Our system tracks Month-over-Month (MoM), Week-over-Week (WoW), and Year-over-Year (YoY) performance for key metrics like volume sent, visits, leads, and conversions. Users can filter data dynamically to identify trends, seasonal changes, and anomalies in performance.
                                </BAccordionItem>
                                <BAccordionItem title="Which email campaign performed the best and why?">
                                    The dashboard compares campaigns using engagement KPIs like open rates, click-through rates (CTR), conversion rates, and revenue generated. It provides side-by-side comparisons of similar campaigns and identifies patterns that contributed to success, such as subject lines, send times, or audience segmentation.
                                </BAccordionItem>
                                <BAccordionItem title="How can we track project status and pending tasks related to campaigns?">
                                    A built-in task management module allows teams to assign tasks, set due dates, and monitor progress on campaigns. Users can categorize tasks by priority, campaign type, or assignee, ensuring alignment across teams working on email marketing initiatives.
                                </BAccordionItem>
                                <BAccordionItem title="Can we retrieve past campaign data even if it wasn't previously saved?">
                                    Yes, the system pulls historical campaign data through APIs and database lookups to reconstruct past performance. If an email campaign wasn't manually tracked, the system can still retrieve data from Iterable or other email platforms, allowing retroactive comparisons.
                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCol>

                    <BCol lg="4">
                        <div class="mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-shrink-0 me-1">
                                    <i class="ri-user-settings-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-16 mb-0 fw-semibold">Manage Account</h5>
                                </div>
                            </div>

                            <BAccordion class="accordion-border-box" id="manageaccount-accordion">
                                <BAccordionItem title="How can users update their personal information?">
                                    Users can edit their name, email, profile picture, and preferences in the Account Settings section. All changes are updated in real-time and securely stored in PostgreSQL, ensuring data integrity.
                                </BAccordionItem>
                                <BAccordionItem title="What happens when a user deletes their account?" visible>
                                    When an account is deleted, all personal data is removed permanently, except for anonymized campaign-related data needed for reporting. Users receive a confirmation email before final deletion, and once confirmed, the action cannot be undone.
                                </BAccordionItem>
                                <BAccordionItem title="How is password security handled?">
                                    Passwords are hashed using Laravel's bcrypt hashing algorithm, ensuring they are never stored in plaintext. Users can reset their passwords via a secure, time-limited email link if needed. Multi-Factor Authentication (MFA) is also available for extra security.
                                </BAccordionItem>
                                <BAccordionItem title="Can users customize dashboard preferences?">
                                    Yes, users can customize theme settings, email notification preferences, and default campaign filters. These settings are stored in the PostgreSQL database and applied automatically each time the user logs in.
                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCol>

                    <BCol lg="4">
                        <div class="mt-3">
                            <div class="d-flex align-items-center mb-2">
                                <div class="flex-shrink-0 me-1">
                                    <i class="ri-shield-keyhole-line fs-24 align-middle text-success me-1"></i>
                                </div>
                                <div class="flex-grow-1">
                                    <h5 class="fs-16 mb-0 fw-semibold">Privacy &amp; Security</h5>
                                </div>
                            </div>

                            <BAccordion class="accordion-border-box" id="privacy-accordion">
                                <BAccordionItem title="How does Signal Dashboard ensure account security?" visible>
                                    Security is a top priority. We implement Two-Factor Authentication (2FA) using Google Authenticator or any personal authenticator app, requiring a unique time-based code for login. Additionally, all passwords are hashed using Laravel's bcrypt algorithm, ensuring they are never stored in plaintext.
                                </BAccordionItem>
                                <BAccordionItem title="Is my personal data private and secure?">
                                    Yes, all personal data, including name, email, and preferences, is securely stored in a PostgreSQL database and encrypted where necessary. We follow strict data protection policies to ensure user information is never shared, sold, or accessed without authorization.
                                </BAccordionItem>
                                <BAccordionItem title="What happens if I lose access to my 2FA device?">
                                    If you lose access to your 2FA device, you can use backup codes provided during setup. If no backup codes are available, you must go through a manual identity verification process by contacting support to regain access securely.
                                </BAccordionItem>
                                <BAccordionItem title="How does Signal Dashboard protect data from breaches?">
                                    We use industry-standard security practices, including SSL encryption, regular security audits, and strict role-based access control (RBAC). Additionally, login attempts are monitored and logged, and users receive instant notifications of any suspicious activity.
                                </BAccordionItem>
                            </BAccordion>
                        </div>
                    </BCol>
                </BRow>
            </BCol>
        </BRow>
    </Layout>
</template>
