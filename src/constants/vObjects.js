import {number, ref as yupRef, string, object, mixed} from "yup";
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const phoneValidationRule = (value) => {
    if (!value || typeof value !== 'string') return false; // Ensure the value exists and is a string
    // Pre-validation: Ensure the input contains only valid characters
    const validPhonePattern = /^[+\d\s()-]+$/;
    if (!validPhonePattern.test(value)) return false; // Reject invalid characters

    // Parse and validate the phone number
    const phoneNumber = parsePhoneNumberFromString(value);
    if (!phoneNumber || !phoneNumber.isValid()) return false; // Invalid phone number

    return true; // Valid phone number
};

const VObjects = {
    first_name: string()
        .trim()
        .required('first-name-required')
        .min(3, 'first-name-min-length-required'),
    last_name: string()
        .trim()
        .required('last-name-required')
        .min(3, 'last-name-min-length-required'),
    slug: string()
        .trim()
        .required('slug-required')
        .min(3, 'slug-min-length-required'),
    title: string()
        .trim()
        .required('title-required')
        .min(3, 'title-min-length-required'),
    id: string()
        .trim()
        .required('id-required'),
    uniq_id: string()
        .trim()
        .matches(/^[a-zA-Z0-9_]+$/, 'id-must-contain-only-english-characters-numbers-or-underscores-no-spaces')
        .required('id-required'),
    identifier: string()
        .trim()
        .required('identifier-required'),
    description: string()
        .trim()
        .required('description-required')
        .min(3, 'description-min-length-required'),
    quick_win: string()
        .trim()
        .required('quick-win-required'),
    circle_image: string()
        .trim()
        .required('image-url-required')
        .url('url-valid-format-required'),
    square_image: string()
        .trim()
        .required('image-url-required')
        .url('url-valid-format-required'),
    password: string()
        .trim()
        .required('password-required')
        .min(8, 'password-min-length-required'),
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'password-strong-pattern-required'),
    current_password: string()
        .trim()
        .required('password-required')
        .min(8, 'password-min-length-required'),
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'password-strong-pattern-required'),
    email: string()
        .trim()
        .required('email-required')
        .email('email-valid-format-required'),
    // mobile: string()
    //     .trim()
    //     .required('mobile-required')
    //     .length(11, 'mobile-length-required')
    //     .matches(/^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, 'mobile-valid-format-required'),
    mobile: string()
        .trim()
        .required('mobile-required') // Required error
        .test({
            name: 'is-mobile',
            message: 'invalid-mobile', // Error for invalid format
            test: (value) => phoneValidationRule(value),
        }),
    verify_password: string()
        .trim()
        .required('verify-password-required')
        .oneOf([yupRef('password')], 'password-match-required'),
    name: string()
        .trim()
        .required('name-required')
        .min(3, 'name-min-length-required'),
    code: string()
        .trim()
        .required('code-required')
        .length(19, 'code-min-length-required'),
    stock_count: number()
        .typeError('stock-count-valid-format-required')
        .required('stock-count-required'),
    price: number()
        .typeError('price-valid-format-required')
        .required('price-required'),
    package: object({title: string().required('package-required')})
        .required('package-required'),
    industry: object({title: string().required('industry-required')})
        .required('industry-required'),
    user: object({id: string().required('user-required')})
        .required('user-required'),
    username: string()
        .trim()
        .required('username-required')
        .min(3, 'username-min-length-required'),
    phone:  string()
        .trim()
        .required('phone-required') // Required error
        .test({
            name: 'is-phone',
            message: 'invalid-phone', // Error for invalid format
            test: (value) => phoneValidationRule(value),
        }),
    ///TODO: add validate for website
    website: string()
        .trim()
        .required('website-required'),
    country: string()
        .trim()
        .required('country-required')
        .min(3, 'country-min-length-required'),
    state: string()
        .trim()
        .required('state-required')
        .min(3, 'state-min-length-required'),
    city: string()
        .trim()
        .required('city-required')
        .min(3, 'city-min-length-required'),
    zip_code: string()
        .trim()
        .required('zip-code-required')
        .min(3, 'zip-code-min-length-required'),
    address_1: string()
        .trim()
        .required('address-required')
        .min(3, 'address-min-length-required'),
    address_2: string()
        .trim()
        .required('address-required')
        .min(3, 'address-min-length-required'),
    text_description: string()
        .trim()
        .required('description-required')
        .min(3, 'description-min-length-required'),
    prompt_text: string()
        .trim()
        .required('prompt-text-required'),
    key: string()
        .trim()
        .required('key-required')
        .min(3, 'key-min-length-required'),
    module: string()
        .trim()
        .required('module-required')
        .min(3, 'module-min-length-required'),
    resource: string()
        .trim()
        .required('resource-required')
        .min(3, 'resource-min-length-required'),
    handler: string()
        .trim()
        .required('handler-required')
        .min(3, 'handler-min-length-required'),
    role: string()
        .trim()
        .required('role-required')
        .min(3, 'role-min-length-required'),
    type: string()
        .trim()
        .required('type-required')
        .min(3, 'type-min-length-required'),
    number: string()
        .trim()
        .required('number-required'),
    status: object({title: string().required('status-required')})
        .required('status-required'),
    domain: object({title: string().required('domain-required')})
        .required('domain-required'),
    control: object({title: string().required('control-required')})
        .required('control-required'),
    framework: object({title: string().required('framework-required')})
        .required('framework-required'),
    library: object({title: string().required('library-required')})
        .required('library-required'),
    statement0: string()
        .trim()
        .required('title-required'),
    statement1: string()
        .trim()
        .required('title-required'),
    statement2: string()
        .trim()
        .required('title-required'),
    statement3: string()
        .trim()
        .required('title-required'),
    statement4: string()
        .trim()
        .required('title-required'),
    statement5: string()
        .trim()
        .required('title-required'),
    statement6: string()
        .trim()
        .required('title-required'),
    statement7: string()
        .trim()
        .required('title-required'),
    statement8: string()
        .trim()
        .required('title-required'),
    statement9: string()
        .trim()
        .required('title-required'),
    statement10: string()
        .trim()
        .required('title-required'),
    document: mixed()
        .required('document-required') // File must be selected
        .test('fileType', 'document-invalid-type', (value) => {
            if (!value) return false; // Required check
            const allowedTypes =
                ['json', 'jsonl', 'txt', 'csv', 'pdf', 'pptx', 'docx', 'epub'];
            return allowedTypes.includes(value?.name.split('.')?.reverse()[0]);
        }),
    avatar: mixed()
        .required('avatar-required') // File must be selected
        .test('fileType', 'avatar-invalid-type', (value) => {
            if (!value) return false; // Required check
            const allowedTypes =
                ['png', 'jpg', 'jpeg', 'JPG', 'PNG'];
            return allowedTypes.includes(value?.name.split('.')?.reverse()[0]);
        })
        // .test('fileSize', 'document-file-size-exceeded', (value) => {
        //     if (!value) return false; // Required check
        //     const maxSize = 200 * 1024 * 1024;
        //     return value.size <= maxSize;
        // }),
};

export default VObjects;
