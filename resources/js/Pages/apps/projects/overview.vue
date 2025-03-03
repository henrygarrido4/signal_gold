<script>
import { Head, Link, router } from '@inertiajs/vue3';
import Layout from "@/Layouts/main.vue";
import PageHeader from "@/Components/page-header.vue";
import moment from 'moment';
import Swal from 'sweetalert2';
import Simplebar from 'simplebar-vue';
import CommentAttachment from "@/Components/CommentAttachment.vue";
import CommentForm from '@/Components/CommentForm.vue';

export default {
    props: {
        project: {
            type: Object,
            required: true
        }
    },
    components: {
        Layout,
        PageHeader,
        Head,
        Link,
        Simplebar,
        CommentAttachment,
        CommentForm
    },
    data() {
        return {
            showFullDescription: false,
            showFilePreview: false,
            selectedFile: null,
            errors: {},
            form: {
                content: '',
                parent_id: null,
                processing: false,
                attachments: []
            },
            editingComment: null,
            replyingTo: null,
            replyForm: {
                content: ''
            },
            showImagePreview: false,
            previewImage: null,
            acceptedFileTypes: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif'
        }
    },
    computed: {
        truncatedDescription() {
            if (this.project.description.length <= 629) {
                return this.project.description;
            }
            return this.project.description.substring(0, 629) + '...';
        }
    },
    methods: {
        formatDate(date) {
            return moment(date).fromNow();
        },
        viewFile(file) {
            // For common file types that can be previewed in browser
            const previewableTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
            
            if (previewableTypes.includes(file.type)) {
                this.selectedFile = file;
                this.showFilePreview = true;
            } else {
                // For other file types, try to download
                window.open(file.url, '_blank');
            }
        },
        deleteFile(file) {
            Swal.fire({
                title: 'Are you sure?',
                text: `You want to delete ${file.name}?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: "#34c38f",
                cancelButtonColor: "#f46a6a",
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
                showCloseButton: true
            }).then((result) => {
                if (result.isConfirmed) {
                    router.delete(route('projects.delete-file', { 
                        project: this.project.id, 
                        filename: encodeURIComponent(file.name)
                    }), {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
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
                }
            });
        },
        handleFileUpload(event) {
            const files = event.target.files;
            if (!files.length) return;

            // Only take the first file
            const file = files[0];
            const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes

            // Check file size
            if (file.size > maxFileSize) {
                Swal.fire({
                    title: 'Error!',
                    text: `File ${file.name} exceeds the 2MB size limit`,
                    icon: 'error',
                    confirmButtonColor: "#34c38f",
                    confirmButtonText: 'Ok'
                });
                event.target.value = '';
                return;
            }

            const formData = new FormData();
            formData.append('attached_files[]', file);

            router.post(route('projects.upload-files', { project: this.project.id }), formData, {
                preserveScroll: true,
                onSuccess: () => {
                    Swal.fire({
                        title: 'Success!',
                        text: `Successfully uploaded ${file.name}`,
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 1500,
                        timerProgressBar: true
                    });
                    event.target.value = '';
                },
                onError: (errors) => {
                    Swal.fire({
                        title: 'Error!',
                        text: errors?.message || 'Failed to upload file',
                        icon: 'error',
                        confirmButtonColor: "#34c38f",
                        confirmButtonText: 'Ok'
                    });
                    event.target.value = '';
                }
            });
        },
        switchToDocumentsTab() {
            // Find the Documents tab and click it
            const tabButtons = document.querySelectorAll('.nav-tabs button');
            const documentsTab = Array.from(tabButtons).find(tab => tab.textContent.includes('Documents'));
            if (documentsTab) {
                documentsTab.click();
            }
        },
        submitComment(formData) {
            // If it's FormData, use it directly
            if (formData instanceof FormData) {
                this.form.processing = true;
                router.post(route('projects.comments.store', this.project.id), formData, {
                    preserveScroll: true,
                    onSuccess: () => {
                        // console.log('Comment submitted successfully');
                        this.form.processing = false;
                    },
                    onError: (errors) => {
                        console.error('Comment submission error:', errors);
                        this.form.processing = false;
                    }
                });
                return;
            }

            // If it's a regular object with content, convert it to FormData
            if (typeof formData === 'object' && formData.content) {
                const fd = new FormData();
                fd.append('content', formData.content.trim());
                if (formData.parent_id) {
                    fd.append('parent_id', String(formData.parent_id));
                }
                
                this.submitComment(fd); // Recursively call with new FormData
                return;
            }

            // If we get here, it's probably just a component update, not a submission
            // So we'll silently ignore it instead of showing an error
        },
        startEdit(comment) {
            this.editingComment = {
                id: comment.id,
                content: comment.content
            };
        },
        cancelEdit() {
            this.editingComment = null;
        },
        updateComment(commentId) {
            router.put(route('projects.comments.update', commentId), {
                content: this.editingComment.content
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    this.editingComment = null;
                }
            });
        },
        deleteComment(commentId) {
            if (confirm('Are you sure you want to delete this comment?')) {
                router.delete(route('projects.comments.destroy', commentId), {
                    preserveScroll: true
                });
            }
        },
        startReply(comment) {
            this.replyingTo = comment;
            this.replyForm.content = '';
        },
        cancelReply() {
            this.replyingTo = null;
            this.replyForm.content = '';
        },
        submitReply(commentId) {
            const formData = new FormData();
            formData.append('content', this.replyForm.content.trim());
            formData.append('parent_id', String(commentId));

            this.submitComment(formData);
            this.cancelReply();
        },
        handleFileAttachment(event) {
            const maxFileSize = 10 * 1024 * 1024; // 10MB
            const newFiles = Array.from(event.target.files).filter(file => {
                if (file.size > maxFileSize) {
                    this.$bvToast.toast(`File ${file.name} exceeds 10MB limit`, {
                        title: 'File too large',
                        variant: 'warning'
                    });
                    return false;
                }
                return true;
            });
            
            this.form.attachments = [...(this.form.attachments || []), ...newFiles];
        },
        removeAttachment(index) {
            this.form.attachments.splice(index, 1);
        },
        formatFileSize(bytes) {
            if (!bytes) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        previewAttachment(attachment) {
            if (attachment.type.startsWith('image/')) {
                this.previewImage = {
                    url: route('comments.attachment.download', attachment.id),
                    name: attachment.name
                };
                this.showImagePreview = true;
            }
        },
        isImage(type) {
            return type?.startsWith('image/');
        },
        canPreview(type) {
            const previewableTypes = [
                'image/jpeg', 
                'image/png', 
                'image/gif', 
                'application/pdf', 
                'text/plain'
            ];
            return previewableTypes.includes(type);
        },
        getFileIcon(fileType) {
            // Image files
            if (fileType?.startsWith('image/')) {
                return 'ri-image-fill';
            }
            // PDF files
            if (fileType === 'application/pdf') {
                return 'ri-file-pdf-fill';
            }
            // Word documents
            if (fileType === 'application/msword' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return 'ri-file-word-fill';
            }
            // Excel files
            if (fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                return 'ri-file-excel-fill';
            }
            // Text files
            if (fileType === 'text/plain') {
                return 'ri-file-text-fill';
            }
            // Default icon for other types
            return 'ri-file-fill';
        }
    },
    mounted() {
        // Check if we have a tab parameter in the URL
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');
        if (tab === 'documents') {
            // Select the documents tab
            this.$nextTick(() => {
                this.$refs.tabs.select('documents');
            });
        }
    }
};
</script>

<template>
    <Layout>
        <!-- Project Header Card -->
        <BRow>
            <BCol lg="12">
                <BCard no-body class="mt-n4">
                    <div class="bg-primary-subtle">
                        <BCardBody class="pb-0 px-4">
                            <BRow class="mb-3">
                                <BCol md>
                                    <BRow class="align-items-center g-3">
                                        <BCol md="auto">
                                            <div class="avatar-md">
                                                <div class="avatar-title bg-white rounded-circle">
                                                    <img 
                                                        :src="project.thumbnail_url" 
                                                        :alt="project.title"
                                                        class="avatar-xs"
                                                    />
                                                </div>
                                            </div>
                                        </BCol>
                                        <BCol md>
                                            <div>
                                                <h4 class="fw-bold">{{ project.title }}</h4>
                                                <div class="hstack gap-3 flex-wrap">
                                                    <div>
                                                        <i class="ri-building-line align-bottom me-1"></i> 
                                                        {{ project.category }}
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Created: <span class="fw-medium">{{ formatDate(project.created_at) }}</span>
                                                    </div>
                                                    <div class="vr"></div>
                                                    <div>
                                                        Due Date: <span class="fw-medium">{{ new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
                                                    </div>
                                                    <div class="vr"></div>
                                                    <BBadge 
                                                        :class="{
                                                            'bg-success fs-12': project.status === 'Completed',
                                                            'bg-warning fs-12': project.status === 'In Progress',
                                                            'bg-danger fs-12': project.status === 'Not Started',
                                                            'bg-info fs-12': project.status === 'On Hold'
                                                        }"
                                                    >
                                                        {{ project.status }}
                                                    </BBadge>
                                                    <BBadge 
                                                        :class="{
                                                            'bg-danger fs-12': project.priority === 'High',
                                                            'bg-warning fs-12': project.priority === 'Medium',
                                                            'bg-success fs-12': project.priority === 'Low'
                                                        }"
                                                    >
                                                        {{ project.priority }}
                                                    </BBadge>
                                                </div>
                                            </div>
                                        </BCol>
                                    </BRow>
                                </BCol>
                                <BCol md="auto pt-md-3 pt-4">
                                    <!-- Only show edit button if user is the creator -->
                                    <Link 
                                        v-if="project.user_id === $page.props.auth.user.id"
                                        :href="route('projects.edit', project.id)" 
                                        class="btn btn-primary"
                                    >
                                        Edit Project
                                    </Link>
                                </BCol>
                            </BRow>
                        </BCardBody>
                    </div>
                </BCard>
            </BCol>
        </BRow>

        <!-- Tabs Section -->
        <BRow>
            <BCol lg="12">
                <BTabs ref="tabs" variant="link" nav-class="nav-tabs-custom border-bottom-0">
                    <BTab title="Overview" active class="fw-semibold pt-2">
                        <BRow>
                            <BCol xxl="9">
                                <!-- Summary Card -->
                                <BCard no-body class="mb-4">
                                    <BCardBody>
                                        <div class="text-muted">
                                            <h6 class="mb-3 fw-semibold text-uppercase">Summary</h6>
                                            <div class="project-description">
                                                <div v-if="!showFullDescription" v-html="truncatedDescription"></div>
                                                <div v-else v-html="project.description"></div>
                                                
                                                <BButton 
                                                    v-if="project.description.length > 629"
                                                    variant="link" 
                                                    class="p-0 mt-1"
                                                    @click="showFullDescription = !showFullDescription"
                                                >
                                                    {{ showFullDescription ? 'Show Less' : 'Read More' }}
                                                </BButton>
                                            </div>
                                        </div>

                                        <div class="pt-3 border-top border-top-dashed mt-4">
                                            <BRow>
                                                <BCol lg="3" sm="6">
                                                    <div>
                                                        <p class="mb-2 text-uppercase fw-medium">Created Date :</p>
                                                        <h5 class="fs-15 mb-0">{{ formatDate(project.created_at) }}</h5>
                                                    </div>
                                                </BCol>
                                                <BCol lg="3" sm="6">
                                                    <div>
                                                        <p class="mb-2 text-uppercase fw-medium">Due Date :</p>
                                                     
                                                            <h5 class="fs-15 mb-0">{{ new Date(project.deadline).toLocaleDateString() }}</h5>
                                                    </div>
                                                </BCol>
                                                <BCol lg="3" sm="6">
                                                    <div>
                                                        <p class="mb-2 text-uppercase fw-medium">Priority :</p>
                                                        <BBadge 
                                                            :class="{
                                                                'bg-danger fs-12': project.priority === 'High',
                                                                'bg-warning fs-12': project.priority === 'Medium',
                                                                'bg-success fs-12': project.priority === 'Low'
                                                            }"
                                                        >
                                                            {{ project.priority }}
                                                        </BBadge>
                                                    </div>
                                                </BCol>
                                                <BCol lg="3" sm="6">
                                                    <div>
                                                        <p class="mb-2 text-uppercase fw-medium">Status :</p>
                                                        <BBadge 
                                                            :class="{
                                                                'bg-success fs-12': project.status === 'Completed',
                                                                'bg-warning fs-12': project.status === 'In Progress',
                                                                'bg-danger fs-12': project.status === 'Not Started',
                                                                'bg-info fs-12': project.status === 'On Hold'
                                                            }"
                                                        >
                                                            {{ project.status }}
                                                        </BBadge>
                                                    </div>
                                                </BCol>
                                            </BRow>

                                            <div v-if="project.attached_files?.length" class="pt-3 border-top border-top-dashed mt-4">
                                                <h6 class="mb-3 fw-semibold text-uppercase">Attached Files</h6>
                                                <div class="vstack gap-2">
                                                    <div v-for="file in project.attached_files" 
                                                         :key="file.path" 
                                                         class="d-flex align-items-center gap-2 bg-light p-2 rounded">
                                                        <!-- File Icon or Image Preview -->
                                                        <template v-if="isImage(file.type)">
                                                            <div class="position-relative">
                                                                <img 
                                                                    :src="file.url" 
                                                                    class="attachment-thumbnail cursor-pointer"
                                                                    @click="viewFile(file)"
                                                                    :alt="file.name"
                                                                />
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <i class="ri-file-text-line fs-20"></i>
                                                        </template>

                                                        <!-- File Details -->
                                                        <div class="flex-grow-1 text-truncate">
                                                            <h6 class="mb-0 fs-14 text-truncate">
                                                                {{ file.display_name || file.name }}
                                                            </h6>
                                                            <small class="text-muted">{{ formatFileSize(file.size) }}</small>
                                                        </div>

                                                        <!-- Action Buttons -->
                                                        <div class="flex-shrink-0 ms-2">
                                                            <div class="d-flex gap-1">
                                                                <BButton 
                                                                    v-if="canPreview(file.type)"
                                                                    variant="soft-primary" 
                                                                    size="sm" 
                                                                    class="btn-icon" 
                                                                    @click="viewFile(file)"
                                                                >
                                                                    <i class="ri-eye-line"></i>
                                                                </BButton>
                                                                <BButton 
                                                                    variant="soft-info" 
                                                                    size="sm" 
                                                                    class="btn-icon"
                                                                    :href="file.url"
                                                                    download   
                                                                >
                                                                    <i class="ri-download-2-line"></i>
                                                                </BButton>
                                                                <BButton 
                                                                    v-if="project.user_id === $page.props.auth.user.id"
                                                                    variant="soft-danger" 
                                                                    size="sm" 
                                                                    class="btn-icon"
                                                                    @click="deleteFile(file)"
                                                                >
                                                                    <i class="ri-delete-bin-line"></i>
                                                                </BButton>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </BCardBody>
                                </BCard>

                                <!-- Comments Section -->
                                <BCard no-body class="mb-4">
                                    <BCardBody>
                                        <h5 class="card-title mb-4">Comments</h5>
                                        
                                        <!-- Comments List with Simplebar -->
                                        <div class="mx-n3">
                                            <simplebar 
                                                data-simplebar 
                                                data-simplebar-auto-hide="false" 
                                                data-simplebar-track="primary"
                                                style="max-height: 275px;"
                                                class="comments-scroll"
                                            >
                                                <template v-if="project.comments?.length">
                                                    <div v-for="comment in project.comments" :key="comment.id" class="d-flex mb-4">
                                                        <!-- User Avatar -->
                                                        <div class="flex-shrink-0">
                                                            <div v-if="comment.user.profile_photo_url" class="avatar-xs">
                                                                <img :src="comment.user.profile_photo_url" alt="" class="rounded-circle img-fluid">
                                                            </div>
                                                            <div v-else class="avatar-xs">
                                                                <div class="avatar-title rounded-circle bg-secondary">
                                                                    {{ comment.user.name[0] }}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Comment Content -->
                                                        <div class="flex-grow-1 ms-3">
                                                            <h5 class="fs-14">{{ comment.user.name }} 
                                                                <small class="text-muted ms-2">
                                                                    {{ formatDate(comment.created_at) }}
                                                                </small>
                                                            </h5>

                                                            <!-- Edit Form -->
                                                            <div v-if="editingComment?.id === comment.id">
                                                                <textarea 
                                                                    v-model="editingComment.content" 
                                                                    class="form-control mb-2" 
                                                                    rows="2"
                                                                ></textarea>
                                                                <div class="d-flex gap-2">
                                                                    <BButton 
                                                                        size="sm" 
                                                                        variant="primary" 
                                                                        @click="updateComment(comment.id)"
                                                                    >
                                                                        Save
                                                                    </BButton>
                                                                    <BButton 
                                                                        size="sm" 
                                                                        variant="light" 
                                                                        @click="cancelEdit"
                                                                    >
                                                                        Cancel
                                                                    </BButton>
                                                                </div>
                                                            </div>

                                                            <!-- Comment Display -->
                                                            <div v-else>
                                                                <p class="text-muted">{{ comment.content }}</p>
                                                                
                                                                <!-- Display attachments -->
                                                                <div v-if="comment.attachments?.length" class="mt-2">
                                                                    <CommentAttachment 
                                                                        v-for="attachment in comment.attachments" 
                                                                        :key="attachment.id"
                                                                        :attachment="attachment"
                                                                        @preview="previewAttachment"
                                                                    />
                                                                </div>

                                                                <!-- Existing action buttons -->
                                                                <div class="d-flex gap-2 mt-2">
                                                                    <a 
                                                                        href="#" 
                                                                        class="badge text-info bg-info-subtle"
                                                                        @click.prevent="startReply(comment)"
                                                                    >
                                                                        Reply
                                                                    </a>
                                                                    <template v-if="comment.user_id === $page.props.auth.user.id">
                                                                        <a 
                                                                            href="#" 
                                                                            class="badge text-primary bg-primary-subtle"
                                                                            @click.prevent="startEdit(comment)"
                                                                        >
                                                                            Edit
                                                                        </a>
                                                                        <a 
                                                                            href="#" 
                                                                            class="badge text-danger bg-danger-subtle"
                                                                            @click.prevent="deleteComment(comment.id)"
                                                                        >
                                                                            Delete
                                                                        </a>
                                                                    </template>
                                                                </div>

                                                                <!-- Reply Form -->
                                                                <div v-if="replyingTo?.id === comment.id" class="mt-3">
                                                                    <form @submit.prevent="submitReply(comment.id)">
                                                                        <div class="d-flex gap-2">
                                                                            <textarea 
                                                                                v-model="replyForm.content" 
                                                                                class="form-control" 
                                                                                rows="2" 
                                                                                placeholder="Write your reply..."
                                                                            ></textarea>
                                                                            <div class="d-flex flex-column gap-2">
                                                                                <BButton 
                                                                                    size="sm" 
                                                                                    variant="primary" 
                                                                                    type="submit"
                                                                                    :disabled="!replyForm.content"
                                                                                >
                                                                                    Reply
                                                                                </BButton>
                                                                                <BButton 
                                                                                    size="sm" 
                                                                                    variant="light" 
                                                                                    @click="cancelReply"
                                                                                >
                                                                                    Cancel
                                                                                </BButton>
                                                                            </div>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>

                                                            <!-- Replies Section -->
                                                            <div v-if="comment.replies?.length" class="mt-3">
                                                                <div v-for="reply in comment.replies" :key="reply.id" class="d-flex mt-3 ps-3 border-start">
                                                                    <!-- Reply Avatar -->
                                                                    <div class="flex-shrink-0">
                                                                        <div v-if="reply.user.profile_photo_url" class="avatar-xs">
                                                                            <img :src="reply.user.profile_photo_url" alt="" class="rounded-circle img-fluid">
                                                                        </div>
                                                                        <div v-else class="avatar-xs">
                                                                            <div class="avatar-title rounded-circle bg-secondary">
                                                                                {{ reply.user.name[0] }}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <!-- Reply Content -->
                                                                    <div class="flex-grow-1 ms-3">
                                                                        <h5 class="fs-14">
                                                                            {{ reply.user.name }}
                                                                            <small class="text-muted ms-2">{{ formatDate(reply.created_at) }}</small>
                                                                        </h5>

                                                                        <!-- Add edit form for replies -->
                                                                        <div v-if="editingComment?.id === reply.id">
                                                                            <textarea 
                                                                                v-model="editingComment.content" 
                                                                                class="form-control mb-2" 
                                                                                rows="2"
                                                                            ></textarea>
                                                                            <div class="d-flex gap-2">
                                                                                <BButton 
                                                                                    size="sm" 
                                                                                    variant="primary" 
                                                                                    @click="updateComment(reply.id)"
                                                                                >
                                                                                    Save
                                                                                </BButton>
                                                                                <BButton 
                                                                                    size="sm" 
                                                                                    variant="light" 
                                                                                    @click="cancelEdit"
                                                                                >
                                                                                    Cancel
                                                                                </BButton>
                                                                            </div>
                                                                        </div>
                                                                        <!-- Show reply content when not editing -->
                                                                        <div v-else>
                                                                            <p class="text-muted">{{ reply.content }}</p>
                                                                            
                                                                            <!-- Edit/Delete for own replies -->
                                                                            <div v-if="reply.user_id === $page.props.auth.user.id" class="d-flex gap-2">
                                                                                <a 
                                                                                    href="#" 
                                                                                    class="badge text-primary bg-primary-subtle"
                                                                                    @click.prevent="startEdit(reply)"
                                                                                >
                                                                                    Edit
                                                                                </a>
                                                                                <a 
                                                                                    href="#" 
                                                                                    class="badge text-danger bg-danger-subtle"
                                                                                    @click.prevent="deleteComment(reply.id)"
                                                                                >
                                                                                    Delete
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </template>
                                                <template v-else>
                                                    <div class="text-center py-4 text-muted">
                                                        No comments yet. Be the first to comment!
                                                    </div>
                                                </template>
                                            </simplebar>
                                        </div>

                                        <!-- Comment Form at Bottom -->
                                        <div class="mt-4 border-top pt-3">
                                            <CommentForm 
                                                :processing="form.processing"
                                                :parent-id="form.parent_id"
                                                @submit="submitComment"
                                            />
                                        </div>
                                    </BCardBody>
                                </BCard>
                            </BCol>
                            <BCol lg="3">
                                <!-- Skills Card -->
                                <BCard no-body>
                                    <BCardBody>
                                        <h5 class="card-title mb-4">Skills</h5>
                                        <div class="d-flex flex-wrap gap-2 fs-16">
                                            <BBadge 
                                                v-for="skill in project.skills" 
                                                :key="skill"
                                                variant="secondary-subtle" 
                                                tag="div"
                                                class="fw-medium bg-secondary-subtle text-secondary"
                                            >
                                                {{ skill }}
                                            </BBadge>
                                        </div>
                                    </BCardBody>
                                </BCard>

                                <!-- Team Members Card -->
                                <BCard no-body class="mt-4">
                                    <BCardHeader class="align-items-center d-flex border-bottom-dashed">
                                        <BCardTitle class="mb-0 flex-grow-1">Members</BCardTitle>
                                    </BCardHeader>

                                    <BCardBody>
                                        <div class="vstack gap-3">
                                            <div v-for="user in project.users" :key="user.id" class="d-flex align-items-center">
                                                <div class="avatar-xs flex-shrink-0 me-3">
                                                    <img 
                                                        v-if="user.profile_photo_path"
                                                        :src="`/storage/${user.profile_photo_path}`" 
                                                        :alt="user.name"
                                                        class="img-fluid rounded-circle"
                                                    />
                                                    <div v-else class="avatar-title bg-danger-subtle text-danger rounded-circle">
                                                        {{ user.name.charAt(0) }}
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <h5 class="fs-13 mb-0">
                                                        <Link href="#" class="text-body d-block">{{ user.name }}</Link>
                                                    </h5>
                                                </div>
                                                <div class="flex-shrink-0">
                                                    <div class="d-flex align-items-center gap-1">
                                                        <BDropdown 
                                                            variant="link"
                                                            toggle-class="btn btn-icon btn-sm fs-16 text-muted arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                        >
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem>
                                                                <Link :href="route('profile.show', user.id)" class="text-reset">
                                                                    <i class="ri-eye-fill me-2 align-bottom text-muted"></i>View Profile
                                                                </Link>
                                                            </BDropdownItem>
                                                        </BDropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </BCardBody>
                                </BCard>

                                <!-- Attachments Card -->
                                <BCard no-body class="mt-4">
                                    <BCardHeader class="align-items-center d-flex border-bottom-dashed">
                                        <BCardTitle class="mb-0 flex-grow-1">Attachments</BCardTitle>
                                        <div class="flex-shrink-0">
                                            <div class="d-flex gap-2">
                                                <label for="file-upload" class="btn btn-soft-success btn-sm mb-0">
                                                    <i class="ri-upload-2-fill me-1 align-bottom"></i> Upload
                                                </label>
                                                <input 
                                                    id="file-upload" 
                                                    type="file" 
                                                    class="d-none" 
                                                    @change="handleFileUpload"
                                                    :accept="acceptedFileTypes"
                                                />
                                            </div>
                                        </div>
                                    </BCardHeader>

                                    <BCardBody>
                                        <div v-if="!project.attached_files?.length" class="text-center p-2">
                                            <div class="avatar-sm mx-auto mb-3">
                                                <div class="avatar-title rounded bg-light text-secondary">
                                                    <i class="ri-file-text-line fs-20"></i>
                                                </div>
                                            </div>
                                            <p class="text-muted mb-0">No attachments uploaded yet</p>
                                        </div>

                                        <div v-else class="vstack gap-2">
                                            <div 
                                                v-for="file in project.attached_files.slice(0, 4)" 
                                                :key="file.path"
                                                class="border rounded border-dashed p-2"
                                            >
                                                <div class="d-flex align-items-center">
                                                    <div class="flex-shrink-0 me-3">
                                                        <div class="avatar-sm">
                                                            <div class="avatar-title bg-light text-secondary rounded fs-24">
                                                                <i :class="getFileIcon(file.type)"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex-grow-1 overflow-hidden">
                                                        <h5 class="fs-13 mb-1">
                                                            <span class="text-body text-truncate d-block">
                                                                {{ file.display_name || file.name }}
                                                            </span>
                                                        </h5>
                                                        <div>{{ Math.round(file.size / 1024) }} KB</div>
                                                    </div>
                                                    <div class="flex-shrink-0 ms-2">
                                                        <div class="d-flex gap-1">
                                                            <a 
                                                                :href="file.url" 
                                                                class="btn btn-icon text-muted btn-sm fs-18"
                                                                download
                                                            >
                                                                <i class="ri-download-2-line"></i>
                                                            </a>
                                                            <BDropdown 
                                                                variant="link"
                                                                toggle-class="btn btn-icon btn-sm fs-18 text-muted arrow-none"
                                                                menu-class="dropdown-menu-end"
                                                            >
                                                                <template #button-content>
                                                                    <i class="ri-more-fill"></i>
                                                                </template>
                                                                <BDropdownItem @click="viewFile(file)">
                                                                    <i class="ri-eye-fill me-2 align-bottom text-muted"></i>View
                                                                </BDropdownItem>
                                                                <BDropdownItem @click="deleteFile(file)">
                                                                    <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i>Delete
                                                                </BDropdownItem>
                                                            </BDropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div v-if="project.attached_files.length > 4" class="mt-2 text-center">
                                                <BButton 
                                                    type="button" 
                                                    variant="secondary"
                                                    @click="switchToDocumentsTab"
                                                >
                                                    View more
                                                </BButton>
                                            </div>
                                        </div>
                                    </BCardBody>
                                </BCard>
                            </BCol>
                        </BRow>
                    </BTab>

                    <BTab title="Documents" class="fw-semibold pt-2">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-4">
                                    <h5 class="card-title flex-grow-1">Documents</h5>
                                </div>
                                <BRow>
                                    <!-- Show this when there are no documents -->
                                    <div v-if="!project.attached_files?.length" class="text-center p-4">
                                        <div class="avatar-sm mx-auto mb-4">
                                            <div class="avatar-title rounded bg-light text-secondary">
                                                <i class="ri-file-text-line fs-24"></i>
                                            </div>
                                        </div>
                                        <h5 class="mb-1">No Documents Available</h5>
                                        <p class="text-muted">No documents have been attached to this project yet.</p>
                                    </div>

                                    <!-- Show table only when there are documents -->
                                    <div v-else class="table-responsive table-card">
                                        <table class="table table-borderless align-middle mb-0">
                                            <thead class="table-light">
                                                <tr>
                                                    <th scope="col">File Name</th>
                                                    <th scope="col">Type</th>
                                                    <th scope="col">Size</th>
                                                    <th scope="col">Upload Date</th>
                                                    <th scope="col" style="width: 120px;">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="file in project.attached_files" :key="file.path">
                                                    <td>
                                                        <div class="d-flex align-items-center">
                                                            <div class="avatar-sm">
                                                                <div class="avatar-title bg-light text-secondary rounded fs-24">
                                                                    <i :class="getFileIcon(file.type)"></i>
                                                                </div>
                                                            </div>
                                                            <div class="ms-3 flex-grow-1">
                                                                <h5 class="fs-14 mb-0">
                                                                    <BLink :href="file.url" class="text-body">
                                                                        {{ file.display_name || file.name }}
                                                                    </BLink>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>{{ file.type || 'Document' }}</td>
                                                    <td>{{ Math.round(file.size / 1024) }} KB</td>
                                                    <td>{{ formatDate(file.created_at) }}</td>
                                                    <td>
                                                        <BDropdown variant="link"
                                                            toggle-class="btn btn-soft-secondary btn-sm btn-icon arrow-none"
                                                            menu-class="dropdown-menu-end"
                                                            :offset="{ alignmentAxis: -130, crossAxis: 0, mainAxis: 10 }"
                                                        >
                                                            <template #button-content>
                                                                <i class="ri-more-fill"></i>
                                                            </template>
                                                            <BDropdownItem @click="viewFile(file)">
                                                                <i class="ri-eye-fill me-2 align-bottom text-muted"></i>View
                                                            </BDropdownItem>
                                                            <BDropdownItem :href="file.url" download>
                                                                <i class="ri-download-2-fill me-2 align-bottom text-muted"></i>Download
                                                            </BDropdownItem>
                                                            <BDropdownItem @click="deleteFile(file)">
                                                                <i class="ri-delete-bin-5-fill me-2 align-bottom text-muted"></i>Delete
                                                            </BDropdownItem>
                                                        </BDropdown>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </BRow>
                            </div>
                        </div>
                    </BTab>

                    <BTab title="Comments" class="fw-semibold pt-2">
                        <BCard no-body>
                            <BCardBody>
                                <!-- Comment Form -->
                                <div class="mb-4">
                                    <h5 class="card-title mb-3">Add Comment</h5>
                                    <CommentForm 
                                        :processing="form.processing"
                                        :parent-id="form.parent_id"
                                        @submit="submitComment"
                                    />
                                </div>

                                <!-- Comments List -->
                                <div class="mt-4">
                                    <h5 class="card-title mb-4">Comments ({{ project.comments?.length || 0 }})</h5>
                                    
                                    <!-- Show when there are no comments -->
                                    <div v-if="!project.comments?.length" class="text-center py-4">
                                        <div class="avatar-sm mx-auto mb-4">
                                            <div class="avatar-title rounded-circle bg-light text-primary fs-24">
                                                <i class="ri-chat-3-line"></i>
                                            </div>
                                        </div>
                                        <h5>Be the first to comment</h5>
                                    </div>

                                    <!-- Comments list -->
                                    <div v-else class="comment-list">
                                        <div v-for="comment in project.comments" :key="comment.id" class="d-flex mb-4">
                                            <!-- User Avatar -->
                                            <div class="flex-shrink-0">
                                                <div v-if="comment.user.profile_photo_url" class="avatar-xs">
                                                    <img :src="comment.user.profile_photo_url" alt="" class="rounded-circle img-fluid">
                                                </div>
                                                <div v-else class="avatar-xs">
                                                    <div class="avatar-title rounded-circle bg-secondary">
                                                        {{ comment.user.name[0] }}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Comment Content -->
                                            <div class="flex-grow-1 ms-3">
                                                <h5 class="fs-14">{{ comment.user.name }} 
                                                    <small class="text-muted ms-2">
                                                        {{ formatDate(comment.created_at) }}
                                                    </small>
                                                </h5>
                                                
                                                <!-- Add this edit form -->
                                                <div v-if="editingComment?.id === comment.id">
                                                    <textarea 
                                                        v-model="editingComment.content" 
                                                        class="form-control mb-2" 
                                                        rows="2"
                                                    ></textarea>
                                                    <div class="d-flex gap-2">
                                                        <BButton 
                                                            size="sm" 
                                                            variant="primary" 
                                                            @click="updateComment(comment.id)"
                                                        >
                                                            Save
                                                        </BButton>
                                                        <BButton 
                                                            size="sm" 
                                                            variant="light" 
                                                            @click="cancelEdit"
                                                        >
                                                            Cancel
                                                        </BButton>
                                                    </div>
                                                </div>
                                                <!-- Show content when not editing -->
                                                <div v-else>
                                                    <p class="text-muted">{{ comment.content }}</p>
                                                    
                                                    <!-- Display attachments -->
                                                    <div v-if="comment.attachments?.length" class="mt-2">
                                                        <CommentAttachment 
                                                            v-for="attachment in comment.attachments" 
                                                            :key="attachment.id"
                                                            :attachment="attachment"
                                                            @preview="previewAttachment"
                                                        />
                                                    </div>

                                                    <!-- Action buttons -->
                                                    <div class="d-flex gap-2 mt-2">
                                                        <a 
                                                            href="#" 
                                                            class="badge text-info bg-info-subtle"
                                                            @click.prevent="startReply(comment)"
                                                        >
                                                            Reply
                                                        </a>
                                                        <!-- Only show edit/delete for own comments -->
                                                        <template v-if="comment.user_id === $page.props.auth.user.id">
                                                            <a 
                                                                href="#" 
                                                                class="badge text-primary bg-primary-subtle"
                                                                @click.prevent="startEdit(comment)"
                                                            >
                                                                Edit
                                                            </a>
                                                            <a 
                                                                href="#" 
                                                                class="badge text-danger bg-danger-subtle"
                                                                @click.prevent="deleteComment(comment.id)"
                                                            >
                                                                Delete
                                                            </a>
                                                        </template>
                                                    </div>
                                                </div>

                                                <!-- Reply Form -->
                                                <div v-if="replyingTo?.id === comment.id" class="mt-3">
                                                    <form @submit.prevent="submitReply(comment.id)">
                                                        <div class="d-flex gap-2">
                                                            <textarea 
                                                                v-model="replyForm.content" 
                                                                class="form-control" 
                                                                rows="2" 
                                                                placeholder="Write your reply..."
                                                            ></textarea>
                                                            <div class="d-flex flex-column gap-2">
                                                                <BButton 
                                                                    size="sm" 
                                                                    variant="primary" 
                                                                    type="submit"
                                                                    :disabled="!replyForm.content"
                                                                >
                                                                    Reply
                                                                </BButton>
                                                                <BButton 
                                                                    size="sm" 
                                                                    variant="light" 
                                                                    @click="cancelReply"
                                                                >
                                                                    Cancel
                                                                </BButton>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>

                                                <!-- Replies List -->
                                                <div v-if="comment.replies?.length" class="mt-3">
                                                    <div v-for="reply in comment.replies" :key="reply.id" class="d-flex mt-3 ps-3 border-start">
                                                        <!-- Reply Avatar -->
                                                        <div class="flex-shrink-0">
                                                            <div v-if="reply.user.profile_photo_url" class="avatar-xs">
                                                                <img :src="reply.user.profile_photo_url" alt="" class="rounded-circle img-fluid">
                                                            </div>
                                                            <div v-else class="avatar-xs">
                                                                <div class="avatar-title rounded-circle bg-secondary">
                                                                    {{ reply.user.name[0] }}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Reply Content -->
                                                        <div class="flex-grow-1 ms-3">
                                                            <h5 class="fs-14">
                                                                {{ reply.user.name }}
                                                                <small class="text-muted ms-2">{{ formatDate(reply.created_at) }}</small>
                                                            </h5>

                                                            <!-- Add edit form for replies -->
                                                            <div v-if="editingComment?.id === reply.id">
                                                                <textarea 
                                                                    v-model="editingComment.content" 
                                                                    class="form-control mb-2" 
                                                                    rows="2"
                                                                ></textarea>
                                                                <div class="d-flex gap-2">
                                                                    <BButton 
                                                                        size="sm" 
                                                                        variant="primary" 
                                                                        @click="updateComment(reply.id)"
                                                                    >
                                                                        Save
                                                                    </BButton>
                                                                    <BButton 
                                                                        size="sm" 
                                                                        variant="light" 
                                                                        @click="cancelEdit"
                                                                    >
                                                                        Cancel
                                                                    </BButton>
                                                                </div>
                                                            </div>
                                                            <!-- Show reply content when not editing -->
                                                            <div v-else>
                                                                <p class="text-muted">{{ reply.content }}</p>
                                                                
                                                                <!-- Edit/Delete for own replies -->
                                                                <div v-if="reply.user_id === $page.props.auth.user.id" class="d-flex gap-2">
                                                                    <a 
                                                                        href="#" 
                                                                        class="badge text-primary bg-primary-subtle"
                                                                        @click.prevent="startEdit(reply)"
                                                                    >
                                                                        Edit
                                                                    </a>
                                                                    <a 
                                                                        href="#" 
                                                                        class="badge text-danger bg-danger-subtle"
                                                                        @click.prevent="deleteComment(reply.id)"
                                                                    >
                                                                        Delete
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </BCardBody>
                        </BCard>
                    </BTab>
                </BTabs>
            </BCol>
        </BRow>
    </Layout>

    <!-- Add this at the end of your template -->
    <BModal v-model="showFilePreview" size="lg" title="File Preview" hide-footer>
        <div v-if="selectedFile" class="text-center">
            <!-- Image preview -->
            <img 
                v-if="selectedFile.type?.startsWith('image/')" 
                :src="selectedFile.url" 
                :alt="selectedFile.name"
                class="img-fluid"
            />
            <!-- PDF preview -->
            <iframe
                v-else-if="selectedFile.type === 'application/pdf'"
                :src="selectedFile.url"
                width="100%"
                height="500px"
                frameborder="0"
            ></iframe>
            <!-- Text preview -->
            <pre v-else-if="selectedFile.type === 'text/plain'" class="text-start">
                {{ selectedFile.content }}
            </pre>
            <!-- Fallback -->
            <div v-else>
                <p>Preview not available for this file type</p>
                <BButton :href="selectedFile.url" target="_blank">Open File</BButton>
            </div>
        </div>
    </BModal>

    <!-- Add this modal for image preview -->
    <BModal v-model="showImagePreview" 
            size="lg" 
            title="Image Preview" 
            hide-footer
            body-class="p-0">
        <img v-if="previewImage" 
             :src="previewImage.url" 
             class="img-fluid w-100" 
             :alt="previewImage.name">
    </BModal>
</template>

<style>
/* Project description styles */
.project-description {
  width: 100%;
  overflow-x: hidden;
}

.project-description figure {
  margin: 1em 0 !important;
  /* Remove width constraint */
  display: inline-block;
}

.project-description figure img {
  /* Remove width/height constraints */
  height: auto !important;
}

/* Override only max-width to prevent overflow */
.project-description figure[style],
.project-description img[style] {
  max-width: 100% !important;
}

/* Update CKEditor specific classes */
.project-description .image {
  display: inline-block;
  /* Remove width constraint */
}

.project-description .image img {
  height: auto !important;
}

/* Remove forced aspect ratio and width constraints */
.project-description *[style*="aspect-ratio"] {
  aspect-ratio: unset !important;
}

/* Attached files styles */
.attachment-thumbnail {
  max-width: 60px !important;
  max-height: 40px !important;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.attachment-thumbnail:hover {
  transform: scale(1.05);
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.fs-20 {
  font-size: 20px;
}

/* Comments section styles */
.comments-container {
  position: relative;
}

.comments-scroll {
  padding: 0 1.5rem;
}

:deep(.simplebar-track.simplebar-vertical) {
  right: 0;
}
</style>
