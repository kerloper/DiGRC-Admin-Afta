import { getCookie } from "@/utils/index.js";
import { apiAIT } from "@/constants/config.js";

export function useGlobalFileDownload() {
    const downloadImage = async (fileName) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", getCookie('utn') ?? '');

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch(`${apiAIT}download/digrc-global/${fileName}`, requestOptions);

            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }

            const fileBlob = await response.blob(); // Get the response as a Blob
            return URL.createObjectURL(fileBlob); // Return the image URL as a Blob URL
        } catch (error) {
            console.error('Error downloading file:', error);
            return null; // Return null in case of an error
        }
    };

    return {
        downloadImage
    };
}
