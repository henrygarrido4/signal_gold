<template>
    <form @submit.prevent="submitForm">
        <div class="row">
            <div class="col">
                <textarea 
                    v-model="content" 
                    class="form-control" 
                    rows="3" 
                    placeholder="Leave a comment..."
                ></textarea>
            </div>
        </div>
        <!-- Add file attachment input -->
        <div class="row mt-2">
            <div class="col d-flex align-items-center gap-2">
                <input 
                    type="file" 
                    ref="fileInput"
                    class="d-none"
                    @change="handleFileAttachment"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <BButton 
                    type="button" 
                    variant="light" 
                    size="sm"
                    @click="$refs.fileInput.click()"
                >
                    <i class="ri-attachment-2 me-1"></i>
                    Attach Files
                </BButton>
                <div v-if="attachments?.length" class="text-muted small">
                    {{ attachments.length }} file(s) selected
                </div>
            </div>
            <div class="col-auto">
                <BButton 
                    type="submit" 
                    variant="primary" 
                    :disabled="!content || processing"
                >
                    Post Comment
                </BButton>
            </div>
        </div>
        <!-- Preview selected files -->
        <div v-if="attachments?.length" class="row mt-2">
            <div class="col">
                <div class="border rounded p-2">
                    <div v-for="(file, index) in attachments" 
                         :key="index" 
                         class="d-flex align-items-center gap-2 mb-1 last:mb-0">
                        <i class="ri-file-text-line"></i>
                        <span class="text-truncate">{{ file.name }}</span>
                        <span class="text-muted small">
                            ({{ formatFileSize(file.size) }})
                        </span>
                        <BButton 
                            variant="link" 
                            size="sm" 
                            class="text-danger p-0 ms-auto"
                            @click="removeAttachment(index)"
                        >
                            <i class="ri-close-line"></i>
                        </BButton>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
export default {
    props: {
        processing: Boolean,
        parentId: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            content: '',
            attachments: []
        }
    },
    methods: {
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
            
            this.attachments = [...(this.attachments || []), ...newFiles];
        },
        removeAttachment(index) {
            this.attachments.splice(index, 1);
        },
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        submitForm() {
            if (!this.content.trim()) return;

            try {
                const formData = new FormData();
                formData.append('content', this.content.trim());
                
                if (this.parentId) {
                    formData.append('parent_id', String(this.parentId));
                }
                
                if (this.attachments && this.attachments.length > 0) {
                    this.attachments.forEach((file, index) => {
                        formData.append(`attachments[${index}]`, file);
                    });
                }

                // Debug log
                // console.log('Form data content:', formData.get('content'));
                // console.log('Form data attachments:', formData.getAll('attachments[]'));

                this.$emit('submit', formData);
                
                // Reset form
                this.content = '';
                this.attachments = [];
                if (this.$refs.fileInput) {
                    this.$refs.fileInput.value = '';
                }
            } catch (error) {
                console.error('Error creating form data:', error);
            }
        }
    }
}
</script> 