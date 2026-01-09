import { ref } from 'vue';

export function useFileUpload(options = { maxLength: 5 }) {
    const files = ref([]);
    const previewUrls = ref([]);

    const handleFileUpload = (selectedFiles) => {
        if (!selectedFiles) return;

        // แปลง FileList เป็น Array
        const newFiles = Array.from(selectedFiles);

        // เช็คจำนวนไฟล์สูงสุด
        if (files.value.length + newFiles.length > options.maxLength) {
            alert(`คุณสามารถเลือกได้สูงสุด ${options.maxLength} ไฟล์`);
            return;
        }

        // เพิ่มไฟล์และสร้าง Preview URLs
        newFiles.forEach(file => {
            files.value.push(file);
            previewUrls.value.push(URL.createObjectURL(file));
        });
    };

    const removeFile = (index) => {
        // ล้าง Memory URL
        URL.revokeObjectURL(previewUrls.value[index]);

        files.value.splice(index, 1);
        previewUrls.value.splice(index, 1);
    };

    return {
        files,
        previewUrls,
        handleFileUpload,
        removeFile
    };
}