import { toJpeg as ElToJpg, toPng as ElToPng } from 'html-to-image';
import {Ref, ref} from 'vue';
import type { Options as HTMLToImageOptions } from 'html-to-image/es/types';

export type ImageType = 'jpeg' | 'png';

export interface UseScreenshotOptions extends HTMLToImageOptions {
  type?: ImageType;
  fileName?: string;
  shouldDownload?: boolean;
  fetchRequestInit?: RequestInit;
}

export type CaptureScreenshot = (
    el: HTMLElement,
    options?: UseScreenshotOptions
) => Promise<string>;

export type Download = (fileName: string) => void;

export interface UseScreenshot {
  // returns the data url of the screenshot
  capture: CaptureScreenshot;
  download: Download;
  dataUrl: Ref<string>;
  error: Ref;
}


export function useScreenshot(): UseScreenshot {
  const dataUrl = ref<string>('');
  const imgType = ref<ImageType>('jpeg');
  const error = ref();

  async function capture(el: HTMLElement, options: UseScreenshotOptions = { }) {
    let data;

    const fileName = options.fileName ?? `inflowenger-screenshot-${Date.now()}`;

    switch (options.type) {
      case 'jpeg':
        data = await toJpeg(el, options);
        break;
      case 'png':
        data = await toPng(el, options);
        break;
      default:
        data = await toPng(el, options);
        break;
    }

    // immediately download the image if shouldDownload is true
    if (options.shouldDownload && fileName !== '') {
      download(fileName);
    }

    return data;
  }

  function toJpeg(
    el: HTMLElement,
    options: HTMLToImageOptions = { quality: 0.95 }
  ) {
    error.value = null;

    return ElToJpg(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = 'jpeg';
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  }

  function toPng(
    el: HTMLElement,
    options: HTMLToImageOptions = { quality: 1 }
  ) {
    error.value = null;

    return ElToPng(el, options)
      .then((data) => {
        dataUrl.value = data;
        imgType.value = 'png';
        return data;
      })
      .catch((error) => {
        error.value = error;
        throw new Error(error);
      });
  }

  function download(fileName: string) {
    const link = document.createElement('a');
    link.download = `${fileName}.${imgType.value}`;
    link.href = dataUrl.value;
    link.click();
  }

  return {
    capture,
    download,
    dataUrl,
    error,
  };
}
