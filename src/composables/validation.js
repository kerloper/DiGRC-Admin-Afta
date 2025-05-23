import {array, mixed, number, object, ref as yupRef, string} from "yup";
import {useI18n} from "vue-i18n";
import {phoneValidationRule} from "@/constants/vObjects.js";

export function useValidation() {
    const {t: $t} = useI18n()

    // const titleValidation = object().required($t($t('message.message.title-required'))

    const firstNameValidation = string()
        .trim()
        .required($t('message.first-name-required'))
        .min(3, $t('message.first-name-min-length-required'));
    const lastNameValidation = string()
        .trim()
        .required($t('message.last-name-required'))
        .min(3, $t('message.last-name-min-length-required'));
    const generalSlugValidation = string()
        .trim()
        .required($t('message.this-required'))
        .min(3, $t('message.required-min-length-required'))
        .matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, $t('message.slug-pattern-invalid'));
    const lowerCase = string()
        .trim()
        .required($t('message.this-required'))
        .matches(/^[a-z]+$/, $t('message.name-pattern-invalid'));
     const slugValidation = string()
        .trim()
        .required($t('message.slug-required'))
        .min(3, $t('message.slug-min-length-required'));
    const titleValidation = string()
        .trim()
        .required($t('message.title-required'))
        .min(2, $t('message.title-min-length-required'));
    const idValidation = string()
        .trim()
        .required($t('message.id-required'));
    const identifierValidation = string()
        .trim()
        .required($t('message.identifier-required'));
    const descriptionValidation = string()
        .trim()
        .required($t('message.description-required'))
        .min(3, $t('message.description-min-length-required'));
    const quickWinValidation = string()
        .trim()
        .required($t('message.quick-win-required'));
    const circleImageValidation = string()
        .trim()
        .required($t('message.image-url-required'))
        .url($t('message.url-valid-format-required'));
    const squareImageValidation = string()
        .trim()
        .required($t('message.image-url-required'))
        .url($t('message.url-valid-format-required'));
    const passwordValidation = string()
        .trim()
        .required($t('message.password-required'))
        .min(8, $t('message.password-min-length-required'));
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'password-strong-pattern-required');
    const currentPasswordValidation = string()
        .trim()
        .required($t('message.password-required'))
        .min(8, $t('message.password-min-length-required'));
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 'password-strong-pattern-required');
    const emailValidation = string()
        .trim()
        .required($t('message.email-required'))
        .email($t('message.email-valid-format-required'));
    const mobileValidation = string()
        .trim()
        .required($t('message.mobile-required'))// Required error
        .test({
            name: 'is-mobile', message: 'invalid-mobile', // Error for invalid format
            test: (value) => phoneValidationRule(value)
        });
    const verifyPasswordValidation = string()
        .trim()
        .required($t('message.verify-password-required'))
        .oneOf([yupRef('password')], $t('message.password-match-required'));
    const nameValidation = string()
        .trim()
        .required($t('message.name-required'))
        .min(3, $t('message.name-min-length-required'));
    const codeValidation = string()
        .trim()
        .required($t('message.code-required'))
        .length(19, $t('message.code-min-length-required'));
    const stockCountValidation = number()
        .typeError($t('message.stock-count-valid-format-required'))
        .required($t('message.stock-count-required'));
    const quantityValidation = number()
        .typeError($t('message.quantity-valid-format-required'))
        .required($t('message.quantity-required'));
    const packageValidation = object({title: string().required($t('message.package-required'))})
        .required($t('message.package-required'));
    const industryValidation = object({title: string().required($t('message.industry-required'))})
        .required($t('message.industry-required'));
    const userValidation = object({id: string().required($t('message.user-required'))})
        .required($t('message.user-required'));
    const generalObjectValidation = object({id: string().required($t('message.this-required'))})
        .required($t('message.this-required'));
    const generalSlugObjectValidation = object({slug: string().required($t('message.this-required'))})
        .required($t('message.this-required'));
    const generalFileValidation =mixed({
        file: mixed().required($t('message.this-required'))
    }).required($t('message.this-required'));
    const userListValidation = array()
        .of(
            object({
                id: string().required($t('message.user-required')),
            })
        )
        .min(1, $t('message.user-required'))
        .required($t('message.user-required'));
    const usernameValidation = string()
        .trim()
        .required($t('message.username-required'))
        .min(3, $t('message.username-min-length-required'));
    const phone = string()
        .trim()
        .required($t('message.mobile-required')) // Required error
        .test({
            name: 'is-phone', message: $t('message.invalid-phone'), // Error for invalid format
            test: (value) => phoneValidationRule(value)
        });
    const websiteValidation = string()
        .trim()
        .required($t('message.website-required'));
    const countryValidation = string()
        .trim()
        .required($t('message.country-required'))
        .min(3, $t('message.country-min-length-required'));
    const stateValidation = string()
        .trim()
        .required($t('message.state-required'))
        .min(3, $t('message.state-min-length-required'));
    const cityValidation = string()
        .trim()
        .required($t('message.city-required'))
        .min(3, $t('message.city-min-length-required'));
    const zipCodeValidation = string()
        .trim()
        .required($t('message.zip-code-required'))
        .min(3, $t('message.zip-code-min-length-required'));
    const addressValidation = string()
        .trim()
        .required($t('message.address-required'))
        .min(3, $t('message.address-min-length-required'));
    const address1Validation = string()
        .trim()
        .required($t('message.address-required'))
        .min(3, $t('message.address-min-length-required'));
    const address2Validation = string()
        .trim()
        .required($t('message.address-required'))
        .min(3, $t('message.address-min-length-required'));
    const textDescriptionValidation = string()
        .trim()
        .required($t('message.description-required'))
        .min(3, $t('message.description-min-length-required'));
    const generalTextValidation = string()
        .trim()
        .required($t('message.this-required'))
        .min(3, $t('message.required-min-length-required'));
    const promptTextValidation = string()
        .trim()
        .required($t('message.prompt-text-required'));
    const keyValidation = string()
        .trim()
        .required($t('message.key-required'))
        .min(3, $t('message.key-min-length-required'));
    const moduleValidation = string()
        .trim()
        .required($t('message.module-required'))
        .min(3, $t('message.module-min-length-required'));
    const resourceValidation = string()
        .trim()
        .required($t('message.resource-required'))
        .min(3, $t('message.resource-min-length-required'));
    const handlerValidation = string()
        .trim()
        .required($t('message.handler-required'))
        .min(3, $t('message.handler-min-length-required'));
    const roleValidation = string()
        .trim()
        .required($t('message.role-required'))
        .min(3, $t('message.role-min-length-required'));
    const typeValidation = string()
        .trim()
        .required($t('message.type-required'))
        .min(3, $t('message.type-min-length-required'));
    const numberValidation = string()
        .trim()
        .required($t('message.number-required'));
    const statusValidation = object({title: string().required($t('message.status-required'))})
        .required($t('message.status-required'));
    const domainValidation = object({title: string().required($t('message.domain-required'))})
        .required($t('message.domain-required'));
    const controlValidation = object({title: string().required($t('message.control-required'))})
        .required($t('message.control-required'));
    const frameworkValidation = object({title: string().required($t('message.framework-required'))})
        .required($t('message.framework-required'));
    const statement0Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement1Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement2Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement3Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement4Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement5Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement6Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement7Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement8Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement9Validation = string()
        .trim()
        .required($t('message.title-required'));
    const statement10Validation = string()
        .trim()
        .required($t('message.title-required'));

    const documentValidation = mixed()
        .required($t('message.document-required')) // File must be selected
        .test('fileType', $t('message.document-invalid-type'), (value) => {
            if (!value) return false; // Required check
            const allowedTypes = ['json', 'jsonl', 'txt', 'csv', 'docx', 'doc', 'png', 'pdf', 'pptx', 'docx', 'epub'];
            return allowedTypes.includes(value?.name.split('.')?.reverse()[0]);
        });
    const avatarValidation = mixed()
        .required($t('message.avatar-required')) // File must be selected
        .test('fileType', 'avatar-invalid-type', (value) => {
            if (!value) return false; // Required check
            const allowedTypes = ['png', 'jpg', 'jpeg', 'JPG', 'PNG'];
            return allowedTypes.includes(value?.name.split('.')?.reverse()[0]);
        })
    const categoryValidation = object({title: string().required($t('message.category-required'))})
        .required($t('message.category-required'));
    const locationValidation = object({title: string().required($t('message.location-required'))})
        .required($t('message.location-required'));
    const strategyValidation = object({title: string().required($t('message.strategy-required'))})
        .required($t('message.strategy-required'));
    const latitudeValidation = number()
        .typeError($t('message.latitude-valid-format-required'))
        .required($t('message.latitude-required'));
    const longitudeValidation = number()
        .typeError($t('message.longitude-valid-format-required'))
        .required($t('message.longitude-required'));

    return {
        latitudeValidation,
        longitudeValidation,
        categoryValidation,
        locationValidation,
        strategyValidation,
        firstNameValidation,
        lastNameValidation,
        slugValidation,
        titleValidation,
        idValidation,
        identifierValidation,
        descriptionValidation,
        quickWinValidation,
        circleImageValidation,
        squareImageValidation,
        passwordValidation,
        currentPasswordValidation,
        emailValidation,
        mobileValidation,
        verifyPasswordValidation,
        nameValidation,
        codeValidation,
        stockCountValidation,
        quantityValidation,
        packageValidation,
        industryValidation,
        userValidation,
        userListValidation,
        generalObjectValidation,
        generalSlugObjectValidation,
        generalFileValidation,
        usernameValidation,
        phone,
        websiteValidation,
        countryValidation,
        stateValidation,
        cityValidation,
        zipCodeValidation,
        addressValidation,
        address1Validation,
        address2Validation,
        textDescriptionValidation,
        generalTextValidation,
        promptTextValidation,
        keyValidation,
        moduleValidation,
        resourceValidation,
        handlerValidation,
        roleValidation,
        typeValidation,
        numberValidation,
        statusValidation,
        domainValidation,
        controlValidation,
        frameworkValidation,
        statement0Validation,
        statement1Validation,
        statement2Validation,
        statement3Validation,
        statement4Validation,
        statement5Validation,
        statement6Validation,
        statement7Validation,
        statement8Validation,
        statement9Validation,
        statement10Validation,
        documentValidation,
        avatarValidation,
        generalSlugValidation,
        lowerCase,
    }
}