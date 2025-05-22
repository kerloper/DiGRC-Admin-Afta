import { getCookie } from "@/utils/index.js";
import { apiAIT } from "@/constants/config.js";

export function useVecFileDownload() {
    const downloadFile = async (fileName) => {
        try {
            const response = await fetch(`${apiAIT}admin/download/${fileName}`);

            if (!response.ok) {
                throw new Error('Failed to download file');
            }

            // Get the file content as a Blob
            const fileBlob = await response.blob();

            // Create an object URL for the file
            const fileURL = URL.createObjectURL(fileBlob);

            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = fileURL;
            link.download = fileName || 'downloaded-file.txt'; // Set the filename for download
            link.click();

            // Revoke the object URL after the download is triggered
            URL.revokeObjectURL(fileURL);
        } catch (error) {
            console.error('Error downloading the file:', error);
        }
    };
    return {
        downloadFile,
    };
}
