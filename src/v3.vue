<template>
  <div class="container my-5">
    <h2 class="mb-4">🖼️ อัปโหลดรูปภาพ (สูงสุด 1 ไฟล์)</h2>

    <div class="card p-4 shadow-sm">
      <div class="mb-3">
        <label for="fileInput" class="form-label">เลือกรูปภาพ:</label>
        <input
          type="file"
          id="fileInput"
          class="form-control"
          accept="image/*"
          @change="handleFileChange"
          :disabled="isLoading"
        />
      </div>
      <button
        class="btn btn-primary"
        @click="uploadImagesBinanceth"
        :disabled="files.length === 0 || files.length > maxFiles || isLoading"
      >
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        {{ isLoading ? "กำลังอัปโหลด..." : "ส่งรูปภาพ binanth" }}
      </button>

      <button
        class="btn btn-primary"
        @click="uploadImages"
        :disabled="files.length === 0 || files.length > maxFiles || isLoading"
      >
        <span
          v-if="isLoading"
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
        {{ isLoading ? "กำลังอัปโหลด..." : "ส่งรูปภาพ dime" }}
      </button>

      <div v-if="message" class="alert alert-success mt-3">
        ✅ **อัปโหลดสำเร็จ:** {{ message }}
      </div>
      <div v-if="error" class="alert alert-danger mt-3">
        ❌ **เกิดข้อผิดพลาด:** {{ error }}
      </div>
    </div>
    <hr class="my-5" />
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div v-for="(value, key, index) in responseData" :key="key">
        <b>
          {{ key }}
        </b>
        <Table :items="responseData[key]" />
        <hr />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Table from "./Table.vue";
import { useOCR } from "./composables/useOcr";
// --- State Variables ---
const maxFiles = 5;
const files = ref([]);

const responseData = ref<any>();
const message = ref("");
const isLoading = ref(false);
const error = ref(null);
const uploadUrl = "https://reader-back.zeabur.app/v1/"; // **Endpoint ที่ต้องการ**

const texts = ref([]);
const ocr = useOCR();

const handleFileChange = async (event) => {
  // รีเซ็ตสถานะ
  texts.value = [];
  message.value = "";
  error.value = null;

  // แปลง FileList เป็น Array เพื่อจัดการได้ง่ายขึ้น
  const selectedFiles = Array.from(event.target.files);
  files.value = selectedFiles;

  if (selectedFiles.length > maxFiles) {
    alert(`คุณเลือกไฟล์เกิน ${maxFiles} ไฟล์ กรุณาเลือกใหม่`);
    // ล้างไฟล์ที่เลือกเกิน
    files.value = [];
    event.target.value = ""; // ล้างค่าใน input file
  }
  isLoading.value = true;
  for (const file of files.value) {
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    img.src = imageUrl;
    await new Promise((resolve) => {
      img.onload = async () => {
        texts.value.push(`${await ocr.recognize(imageUrl)}`);
        resolve(1);
      };
    });
  }
  isLoading.value = false;
};

/**
 * ส่งไฟล์ไปยัง Backend
 */
const uploadImages = async () => {
  isLoading.value = true;
  error.value = null;
  message.value = "";
  responseData.value = [];

  try {
    const formData = new FormData();
    // เพิ่มไฟล์ทั้งหมดภายใต้ชื่อฟอร์ม 'images'
    files.value.forEach((file) => {
      formData.append("images", file);
    });

    for (const text of texts.value) {
      const response = await fetch(`${uploadUrl}dime/process-text`, {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        // API ตอบกลับสำเร็จ (เช่น 200 OK)
        message.value = result.message || "อัปโหลดสำเร็จ";
        responseData.value = result;
      } else {
        // API ตอบกลับสถานะผิดพลาด (เช่น 4xx, 5xx)
        throw new Error(result.message || "การอัปโหลดล้มเหลวจากเซิร์ฟเวอร์");
      }
    }
  } catch (err) {
    console.error("Upload Error:", err);
    error.value = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ";
  } finally {
    isLoading.value = false;
  }
};

const uploadImagesBinanceth = async () => {
  isLoading.value = true;
  error.value = null;
  message.value = "";
  responseData.value = [];

  try {
    const formData = new FormData();
    // เพิ่มไฟล์ทั้งหมดภายใต้ชื่อฟอร์ม 'images'
    files.value.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(`${uploadUrl}binance-th/image-process`, {
      method: "POST",
      body: formData,
      // ไม่ต้องใส่ 'Content-Type': 'multipart/form-data' เพราะ fetch จะใส่ให้เองเมื่อใช้ FormData
    });

    const result = await response.json();

    if (response.ok) {
      // API ตอบกลับสำเร็จ (เช่น 200 OK)
      message.value = result.message || "อัปโหลดสำเร็จ";
      responseData.value = result || [];
    } else {
      // API ตอบกลับสถานะผิดพลาด (เช่น 4xx, 5xx)
      throw new Error(result.message || "การอัปโหลดล้มเหลวจากเซิร์ฟเวอร์");
    }
  } catch (err) {
    console.error("Upload Error:", err);
    error.value = err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ";
  } finally {
    isLoading.value = false;
  }
};
</script>
