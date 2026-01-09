import { ref } from 'vue';
import { createWorker } from 'tesseract.js';

export function useOCR() {
    const loading = ref(false);
    const canvasRef = ref(null);

    const applyFilters = (img) => {
        const canvas = canvasRef.value;
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');

        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    };

    const recognize = async (imageSrc, options = { isOptimized: false }) => {
        const langs = ['eng', 'tha'];
        const worker = await createWorker(langs.join('+'), options.isOptimized ? 1 : undefined);

        if (options.isOptimized) {
            await worker.setParameters({
                tessedit_do_invest: '0',
                tessdata_manager_debug_level: '0',
            });
        }

        const { data: { text } } = await worker.recognize(imageSrc);
        await worker.terminate();
        return text;
    };

    return {
        loading,
        canvasRef,
        applyFilters,
        recognize
    };
}