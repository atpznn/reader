import { ref, onMounted, onUnmounted, computed } from "vue";
import { createWorker } from "tesseract.js";

export function useOcr() {
  const worker = ref(null);
  const isReady = ref(true);
  const isProcessing = ref(false);

  const initWorker = async () => {
    isReady.value = true;
    worker.value = await createWorker("tha+eng", 1);
    isReady.value = false;
  };

  // ฟังก์ชันสำหรับทำ OCR (รับภาพที่ย่อขนาดแล้วมาใช้)
  const recognize = async (imageSource) => {
    if (!worker.value || !isReady.value) return;

    isProcessing.value = true;
    try {
      const {
        data: { text },
      } = await worker.value.recognize(imageSource);
      return text;
    } catch (error) {
      console.error("OCR Error:", error);
    } finally {
      isProcessing.value = false;
    }
  };

  onMounted(() => {
    initWorker();
  });

  onUnmounted(async () => {
    if (worker.value) {
      console.log("Terminating Tesseract Worker...");
      await worker.value.terminate();
      worker.value = null;
    }
  });

  return {
    recognize,
    isReady: computed(() => isReady.value),
    isProcessing,
  };
}
