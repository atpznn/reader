import { createRouter, createWebHistory } from "vue-router";
import OCRViewV1 from "../v1.vue";
import OCRViewV2 from "../v2.vue";
import OCRViewV3 from "../v3.vue";

const routes = [
  {
    path: "/ocr/v1",
    name: "ocrV1",
    component: OCRViewV1,
  },
  {
    path: "/ocr/v2",
    name: "ocrV2",
    component: OCRViewV2,
  },
  {
    path: "/ocr/v3",
    name: "ocrV3",
    component: OCRViewV3,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
