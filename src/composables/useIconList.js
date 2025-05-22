// src/composables/useIconList.js

import { ref, onMounted } from 'vue';

export const useIconList = () => {
    const iconList = ref({});

    const loadIcons = async () => {
        const icons = {
            pdf: () => import('@/assets/icons/files/pdf.svg'),
            csv: () => import('@/assets/icons/files/csv.svg'),
            docx: () => import('@/assets/icons/files/docx.svg'),
            epub: () => import('@/assets/icons/files/epub.svg'),
            file: () => import('@/assets/icons/files/file.svg'),
            json: () => import('@/assets/icons/files/json.svg'),
            jsonl: () => import('@/assets/icons/files/jsonl.svg'),
            pptx: () => import('@/assets/icons/files/pptx.svg'),
            text: () => import('@/assets/icons/files/text.svg'),
            txt: () => import('@/assets/icons/files/txt.svg'),
        };

        const resolvedIcons = {};
        for (const [key, importer] of Object.entries(icons)) {
            resolvedIcons[key] = (await importer()).default;
        }

        iconList.value = resolvedIcons;
    };

    onMounted(() => {
        loadIcons();
    });

    return { iconList };
};
