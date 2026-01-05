<template>
  <div class="container mt-5">
    <h2 class="mb-4">🖼️ อัปโหลดรูปภาพ (สูงสุด 5 ไฟล์)</h2>

    <div class="card p-4 shadow-sm">
      <div class="mb-3">
        <label for="fileInput" class="form-label">เลือกรูปภาพ:</label>
        <input
          type="file"
          id="fileInput"
          class="form-control"
          accept="image/*"
          multiple
          @change="handleFileChange"
          :disabled="isLoading"
        />
        <small class="form-text text-muted" v-if="files.length > 0">
          ไฟล์ที่เลือก: **{{ files.length }}** จาก {{ maxFiles }} ไฟล์
        </small>
        <small class="form-text text-danger" v-if="files.length > maxFiles">
          ❌ เกินจำนวนสูงสุดที่อนุญาต ({{ maxFiles }} ไฟล์)
        </small>
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

    <!-- <div v-if="responseData.length > 0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3>📊 ผลลัพธ์ข้อมูล</h3>
        <button class="btn btn-success" @click="exportToExcel">
          📥 Export to Excel (CSV)
        </button>
      </div>
      <div>
        <div class="table-responsive">
          <table class="table table-striped table-bordered table-hover">
            <thead class="table-dark">
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Symbol</th>
                <th>Stock Amount</th>
                <th>Executed Price</th>
                <th>All Vat Price</th>
                <th>CommissionFee</th>
                <th>SecFee</th>
                <th>TafFee</th>
                <th>Vat7</th>
                <th>Vat Executed</th>
                <th>Diff Vat</th>
                <th>Shares</th>
                <th>Value</th>
                <th>Completion Date</th>
                <th>Submission Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in responseData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.type }}</td>
                <td>**{{ item.symbol }}**</td>
                <td>{{ item.stockAmount.toFixed(2) }}</td>
                <td>{{ item.executedPrice.toFixed(3) }}</td>
                <td>{{ item.allVatPrice.toFixed(3) }}</td>
                <td>{{ item.vat.commissionFee?.toFixed(3) }}</td>
                <td>{{ item.vat.secFee?.toFixed(3) }}</td>
                <td>{{ item.vat.tafFee?.toFixed(3) }}</td>
                <td>{{ item.vat.vat7?.toFixed(3) }}</td>
                <td>{{ item.vatExecuted?.toFixed(3) }}</td>
                <td>{{ item.diffVat.toFixed(3) }}</td>
                <td>{{ item.shares?.toFixed(3) }}</td>
                <td>{{ item.value.toFixed(2) }}</td>
                <td>{{ formatDate(item.completionDate) }}</td>
                <td>{{ formatDate(item.submissionDate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <br />

        <div>Raw Data</div>
        <code>
          {{ responseData }}
        </code>
      </div>
      <br />
    </div> -->
    {{ responseData }}
  </div>
</template>

<script setup>
import { ref } from "vue";

// --- State Variables ---
const maxFiles = 5;
const files = ref([]);
const responseData = ref([]);
const message = ref("");
const isLoading = ref(false);
const error = ref(null);
const uploadUrl = "https://reader-back.onrender.com/image-process/"; // **Endpoint ที่ต้องการ**

// --- Methods ---

/**
 * จัดการกับการเลือกไฟล์และจำกัดจำนวน
 * @param {Event} event - event จาก input file
 */
const handleFileChange = (event) => {
  // รีเซ็ตสถานะ
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

    const response = await fetch(`${uploadUrl}dime`, {
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

    const response = await fetch(`${uploadUrl}binance-th`, {
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

/**
 * จัดรูปแบบวันที่ให้ดูง่ายขึ้น
 * @param {string} dateString - ISO Date string
 */
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);

  const options = {
    day: "2-digit", // DD (01-31)
    month: "2-digit", // MM (01-12)
    year: "numeric", // YYYY (2024)
    hour: "2-digit", // HH (00-23)
    minute: "2-digit", // MM (00-59)
    second: "2-digit", // SS (00-59)
    hour12: false, // ใช้รูปแบบ 24 ชั่วโมง
  };
  // พร้อมกับ options ที่กำหนดเวลา
  return date.toLocaleString("en-GB", options);
};

/**
 * แปลงข้อมูลในตารางเป็น CSV และดาวน์โหลดเป็นไฟล์ Excel
 */
const exportToExcel = () => {
  if (responseData.value.length === 0) {
    alert("ไม่มีข้อมูลให้ Export");
    return;
  }

  // กำหนด Header ของ CSV
  const headers = [
    "Type",
    "Symbol",
    "Stock Amount",
    "Executed Price",
    "AllVatPrice",
    "CommissionFee",
    "SecFee",
    "TafFee",
    "Vat7",
    "VatExecuted",
    "DiffVat",
    "Shares",
    "Value",
    "Completion Date",
    "Submission Date",
  ];

  // เตรียมข้อมูล
  const csvRows = [];
  csvRows.push(headers.join(",")); // เพิ่มแถว Header

  // วนลูปข้อมูลและดึงเฉพาะ field ที่สนใจตามลำดับ
  responseData.value.forEach((item) => {
    // ใช้ Object.keys เพื่อวนลูปและรับประกันว่าข้อมูลจะเรียงตาม headers
    const row = headers.map((header) => {
      const key = header.charAt(0).toLowerCase() + header.slice(1); // แปลง Header กลับเป็น Key (เช่น 'Type' -> 'type')
      if (header == "CommissionFee") {
        return item.vat.commissionFee?.toFixed(3);
      } else if (header == "SecFee") {
        return item.vat.secFee?.toFixed(3);
      } else if (header == "TafFee") {
        return item.vat.tafFee?.toFixed(3);
      } else if (header == "Vat7") {
        return item.vat.vat7?.toFixed(3);
      } else if (header == "Executed Price") {
        return item.executedPrice.toFixed(3);
      } else if (header == "Stock Amount") {
        return item.allVatPrice.toFixed(3);
      } else if (header == "Completion Date") {
        return `"${formatDate(item.completionDate)}"`;
      } else if (header == "Submission Date") {
        return `"${formatDate(item.submissionDate)}"`;
      }
      let value = item[key];

      // จัดการกับค่าที่เป็นวันที่/ตัวเลข
      if (typeof value === "object" && value !== null) {
        value = "";
      } else if (typeof value === "string" && value.includes("T")) {
        // จัดรูปแบบวันที่สำหรับ Excel
        value = `"${formatDate(value)}"`;
      } else if (typeof value === "number") {
        value = value.toFixed(5); // คงความแม่นยำของตัวเลข
      }

      // ป้องกันการ Error ใน CSV หากมีเครื่องหมายคอมมาในข้อมูล
      if (typeof value === "string" && value.includes(",")) {
        value = `"${value}"`;
      }

      return value;
    });
    csvRows.push(row.join(","));
  });

  const csvString = csvRows.join("\n");

  // สร้าง Blob และ Download ไฟล์
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  // ตรวจสอบเบราว์เซอร์
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "upload_data_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // สำหรับ IE 10+
    navigator.msSaveBlob(blob, "upload_data_export.csv");
  }
};
</script>

<style scoped>
/* สามารถเพิ่ม CSS เฉพาะส่วนนี้ได้ตามต้องการ */
/* แต่โค้ดนี้ใช้ Bootstrap เป็นหลัก */
</style>
