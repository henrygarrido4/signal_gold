<template>
    <div class="d-flex align-items-center gap-2 bg-light p-2 rounded mb-1">
        <template v-if="isImage">
            <div class="position-relative">
                <img 
                    :src="previewUrl" 
                    class="attachment-thumbnail cursor-pointer"
                    @click="showFullImage"
                    :alt="attachment.name"
                />
            </div>
        </template>
        <template v-else>
            <i class="ri-file-text-line"></i>
        </template>
        
        <a :href="downloadUrl" 
           class="text-reset text-decoration-none flex-grow-1 text-truncate"
           :target="isImage ? '_blank' : undefined"
           :download="attachment.name">
            {{ attachment.name }}
        </a>
        <span class="text-muted small">
            {{ formatFileSize(attachment.size) }}
        </span>
    </div>
</template>

<script>
export default {
    props: {
        attachment: {
            type: Object,
            required: true
        }
    },
    computed: {
        isImage() {
            return this.attachment.type?.startsWith('image/');
        },
        previewUrl() {
            if (this.attachment.url) {
                return this.attachment.url;
            }
            return route('comments.attachment.download', this.attachment.id);
        },
        downloadUrl() {
            if (this.attachment.url) {
                return this.attachment.url;
            }
            return route('comments.attachment.download', this.attachment.id);
        }
    },
    methods: {
        formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },
        showFullImage() {
            if (this.isImage) {
                this.$emit('preview', this.attachment);
            }
        }
    }
}
</script>

<style scoped>
.attachment-thumbnail {
    max-width: 100px;
    max-height: 60px;
    object-fit: cover;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s;
}

.attachment-thumbnail:hover {
    transform: scale(1.05);
}

.cursor-pointer {
    cursor: pointer;
}
</style> 