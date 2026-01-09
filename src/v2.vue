<template>
  <div class="ocr-container">
    <div class="controls">
      <input type="file" @change="handleFileUpload" accept="image/*" />
      <button :disabled="loading" @click="runOCR">Run Comparison</button>
      <p v-if="loading">Processing... Please wait.</p>
    </div>

    <div class="comparison-grid">
      <div class="panel">
        <h3>1. Original Image</h3>
        <img v-if="originalSrc" :src="originalSrc" class="preview-img" />
        <div class="results">
          <p><strong>Time:</strong> {{ originalTime }}ms</p>
          <pre>{{ originalText || "No text extracted yet" }}</pre>
        </div>
      </div>

      <div class="panel">
        <h3>2. Pre-processed (Grey + Resized)</h3>
        <canvas ref="processCanvas" class="preview-img"></canvas>
        <div class="results">
          <p><strong>Time:</strong> {{ processedTime }}ms</p>
          <pre>{{ processedText || "No text extracted yet" }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createWorker } from "tesseract.js";

const originalSrc = ref(null);
const originalText = ref("");
const originalTime = ref(0);

const processedText = ref("");
const processedTime = ref(0);

const processCanvas = ref(null);
const loading = ref(false);
let selectedFile = null;

const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  selectedFile = file;
  originalSrc.value = URL.createObjectURL(file);
};

const preprocessImage = (img) => {
  const canvas = processCanvas.value;
  const ctx = canvas.getContext("2d");

  // 1. Resize: Scale up by 2x for better OCR on small text
  const scale = 2;
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  // Draw scaled image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // 2. Greyscale: Loop through pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Luminance formula
    const avg = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = avg;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};

const runOCR = async () => {
  if (!selectedFile) return;
  loading.value = true;

  const img = new Image();
  img.src = originalSrc.value;

  img.onload = async () => {
    // Prepare Pre-processed Image
    const processedDataUrl = preprocessImage(img);

    // --- Process Original ---
    const startOrig = performance.now();
    originalText.value = await recognizeV1(originalSrc.value);
    originalTime.value = Math.round(performance.now() - startOrig);

    // --- Process Pre-processed ---
    const startProc = performance.now();
    processedText.value = await recognizeV2(processedDataUrl);
    processedTime.value = Math.round(performance.now() - startProc);

    loading.value = false;
  };
};
const recognizeV2 = async (src) => {
  // 1. Initialize worker with languages (eng+tha) and OEM (1)
  const worker = await createWorker("eng+tha", 1);

  // 2. Set the PSM and other custom Tesseract variables
  await worker.setParameters({
    // tessedit_pageseg_mode: "11", // PSM 11 (Sparse text)
    // tessedit_create_tsv: "1",
    // textord_heavy_nr: "0",
    // tess_use_nn: "1",
    // textord_min_linesize: "1.0",
    tessedit_do_invest: "0",
    tessdata_manager_debug_level: "0",
    // paragraph_text_based: "0",
  });

  const {
    data: { text, tsv },
  } = await worker.recognize(src);

  // Since you enabled tessedit_create_tsv, you can access data.tsv if needed
  console.log("TSV Data:", tsv);

  await worker.terminate();
  return text;
};
const recognizeV1 = async (imageSource) => {
  const worker = await createWorker(["eng", "tha"]);
  const {
    data: { text },
  } = await worker.recognize(imageSource);
  await worker.terminate();
  return text;
};
</script>

<style scoped>
.ocr-container {
  font-family: sans-serif;
  padding: 20px;
}
.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}
.panel {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}
.preview-img {
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
  margin-bottom: 10px;
}
pre {
  background: #f4f4f4;
  padding: 10px;
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 100px;
}
.controls {
  margin-bottom: 20px;
}
button {
  margin-left: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
