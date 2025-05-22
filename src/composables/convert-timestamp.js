import {ref} from 'vue';

export function useConvertTimestamp() {
    // Default options
    const defaultOptions = {
        showDate: true,
        showTime: true,
        showSeconds: false,
        dateSeparator: '/',
        timeSeparator: ':',
    };

    // Reactive options
    const options =  { ...defaultOptions };

    // Get formatted timestamp
    const getTimestamp = (timestamp = Date.now(), customOptions = {}) => {
        // Merge custom options with defaults
        options.value = { ...defaultOptions, ...customOptions };

        const date = new Date(timestamp);

        // Extract date and time components
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Build date and time strings based on options
        const dateStr = options.value.showDate
            ? `${year}${options.value.dateSeparator}${month}${options.value.dateSeparator}${day}`
            : '';

        const timeStr = options.value.showTime
            ? `${hours}${options.value.timeSeparator}${minutes}${
                options.value.showSeconds ? options.value.timeSeparator + seconds : ''
            }`
            : '';

        // Combine date and time
        return `${dateStr} ${timeStr}`.trim();
    };

    // Return the composable API
    return {
        getTimestamp,
        options,
    };
}