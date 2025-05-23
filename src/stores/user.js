import {defineStore} from "pinia";
import {onMounted, ref, shallowRef} from "vue";
import {
    eraseCookie,
    getCookie,
    getCurrentUser,
    setCookie,
    setCurrentUser,
} from "@/utils/index.js";
import API from "@/services/API.js";
import {
    constIsActiveTwoFactor,
    constTwoFactorMethod,
    inactivityTTl,
    refreshTokenTTl,
    signatureTables
} from "@/constants/config.js";
import {useStorage} from "@vueuse/core";


export const useUserStore = defineStore('user', () => {
    const currentUser = ref(getCurrentUser())
    const loginError = shallowRef()
    const showLog = shallowRef(false)
    const updateError = ref()
    const processing = shallowRef(false)
    const updateProcessing = shallowRef(false)
    const mailSuccess = ref()
    const forgotMailSuccess = ref()
    const resetPasswordSuccess = ref()
    const notificationCount = ref({count: null, unread: null})
    const currentSecurityInformation = useStorage("currentSecurityInformation", {
        isFetching: true,
        data: {
            message: null,
            alert: null,
            total_logs: null,
            allowed_logs: null,
            percentage: null,
            alert_threshold: null,
            cleanup_threshold: null,
            cleanup_amount: null,
            rows_to_delete: null
        },
        seen: false,
    });
    const isLoadedSecurityInformation = useStorage("isLoadedSecurityInformation", false);
    const refreshTokenTime = useStorage('refresh-token-time', null) // Stores last execution timestamp
    const refreshTokenInterval = shallowRef(null)

    const inactivityTimer = shallowRef(null)
    const currentLogInformation = useStorage("currentLogInformation", {});
    const isLoadedLogInformation = useStorage("isLoadedLogInformation", false);
    const mfaMethod = useStorage("mfaMethod", constTwoFactorMethod);
    const mfaGlobal = useStorage("mfaGlobal", constIsActiveTwoFactor);
    const mfaStatus = useStorage("mfaStatus", 1);
    const mfaVerify = useStorage("mfaVerify", 1);

    function setProcessing(payload) {
        processing.value = payload
        loginError.value = null
    }

    function setUpdateProcessing(payload) {
        updateProcessing.value = payload
        updateError.value = null
    }

    function setMailSuccess(payload) {
        mailSuccess.value = payload
        loginError.value = null
    }

    function clearError() {
        loginError.value = null
    }

    function setError(payload) {
        loginError.value = payload
        currentUser.value = null
        processing.value = false
    }

    function setUser(payload) {
        const {exp: expiration} = payload.token_payload
        setCookie('utn', payload.access_token, expiration)
        currentUser.value = payload
        processing.value = false
        loginError.value = null
        setCurrentUser(payload)
    }

    function setMfa(payload) {
        const {multi_factor_global, multi_factor_verify, multi_factor_status, multi_factor_method} = payload
        mfaMethod.value = multi_factor_method
        mfaGlobal.value = multi_factor_global
        mfaStatus.value = multi_factor_status
        mfaVerify.value = multi_factor_verify
    }

    function setNotificationCount(payload) {
        notificationCount.value = payload
    }

    async function requestNotificationCount() {
        const {data, error} = await API.getNotificationCountRequest()
        try {
            setNotificationCount(data.value.data)
        } catch (error) {
        }
    }

    async function requestOtp(payload) {
        clearError()
        setProcessing(true)
        const {data, error} = await API.emailRequestOtp(payload)
        if (data.value) {
            mailSuccess.value = true
        } else if (error.value) {
            setError(error.value)
            mailSuccess.value = false
        }
        setProcessing(false)
    }

    async function verifyEmailOtp(payload) {
        clearError()
        setProcessing(true)
        const {data, error} = await API.verifyEmailOtp(payload)
        if (data.value) {
            const userData = data.value.data
            const {multi_factor_global, multi_factor_status} = userData
            setUser(userData)
            setMfa({multi_factor_global, multi_factor_status})
            setCurrentUser(userData)
        } else if (error) {
            setError(error.value)
            setCurrentUser(null)
            // const error = error.response?.data?.error?.message;
        }
        setProcessing(false)
    }

    async function login(payload) {
        clearError()
        setProcessing(true)
        const {data, error} = await API.login(payload)
        if (data.value) {
            const userData = data.value.data
            showLog.value = true
            const {multi_factor_global, multi_factor_verify, multi_factor_status, multi_factor_method} = userData
            setUser(userData)
            setMfa({multi_factor_global, multi_factor_verify, multi_factor_status, multi_factor_method})
            setCurrentUser(userData)
            if (multi_factor_verify === 1 || (multi_factor_status === 0 && multi_factor_global === 0)) {
                configurationWrapper()
            }
        } else if (error.value) {
            setError(error.value)
            setCurrentUser(null)
        }
        setProcessing(false)
    }

    function configurationWrapper() {
        currentSecurityInformation.value = {}
        isLoadedSecurityInformation.value = false
        currentLogInformation.value = {}
        isLoadedLogInformation.value = false
        checkSecurity()
        checkLog()
        startRefreshToken()
        startInactivityTracking()
    }

    function setLogout() {
        currentUser.value = null
        setCurrentUser(null)
        processing.value = false
        loginError.value = null
        mfaVerify.value = 0
        eraseCookie('utn');
        eraseCookie('uName')
        eraseCookie('uEmail')
    }

    async function signOut() {
        const token = getCookie('utn')
        await API.signOut({token})
        setLogout()
        stopRefreshToken()
        stopInactivityTracking()
    }

    async function tryUpdateProfile(payload) {
        setUpdateProcessing(true);
        await updateProfileData(payload)
    }

    async function updateProfileData(payload) {
        clearUpdateError()
        setUpdateProcessing(true)
        const {data, error} = await API.updateProfileRequest(payload)
        if (error.value) {
            setUpdateError(updateError.value)
        }
        await updateProfileState()
    }

    async function updateProfileState() {
        const {data, error} = await API.viewProfileRequest()
        if (data.value) {
            currentUser.value = data.value.data
            setCurrentUser(currentUser.value)
            configurationWrapper()
            // Object.keys(data.value.data).forEach(key => {
            //     currentUser.value[key] = data.value.data[key]
            // });
            // setCurrentUser(currentUser.value)
        } else if (data.value) {
            setUpdateError(error.value)
        }
        setUpdateProcessing(false)
    }

    function clearUpdateError() {
        updateError.value = null
    }

    function setUpdateError(payload) {
        updateError.value = payload
        currentUser.value = null
        processing.value = false
    }

    async function tryUpdatePassword(payload) {
        setUpdateProcessing(true);
        await updatePasswordData(payload)
    }

    async function updatePasswordData(payload) {
        clearUpdateError()
        setUpdateProcessing(true)
        const {data, error} = await API.updateProfilePasswordRequest(payload)
        if (error.value) {
            setUpdateError(updateError.value)
            setUpdateProcessing(false)
        }
        await updateProfileState()
    }

    async function trySetPassword(payload) {
        setUpdateProcessing(true);
        await setPasswordData(payload)
    }

    async function setPasswordData(payload) {
        clearUpdateError()
        setUpdateProcessing(true)
        const {data, error} = await API.setProfilePasswordRequest(payload)
        if (error.value) {
            setUpdateError(updateError.value)
            setUpdateProcessing(false)
        }
        await updateProfileState()
    }

    async function setShowLog(payload) {
        showLog.value = payload
    }

    function checkSecurity() {
        signatureTables.forEach((item) => {
            currentSecurityInformation.value[item] = {
                table: item,
                isFetching: true,
                seen: false,
                total: 0,
                verified: 0,
                unverified: 0,
                list: []
            }
        })
        checkSecurityStatus().then(r => isLoadedSecurityInformation.value = true);
    }

    async function checkSecurityStatus() {
        for (const item of signatureTables) {
            const {data} = await API.checkSignature({table: item})
            currentSecurityInformation.value[item] = {
                table: item,
                isFetching: false,
                seen: false,
                total: data?.value?.data?.total,
                verified: data?.value?.data?.verified,
                unverified: data?.value?.data?.unverified,
                list: data?.value?.data?.list
            }
        }
    }

    function checkLog() {
        signatureTables.forEach((item) => {
            currentLogInformation.value = {
                isFetching: true,
                data: {
                    message: null,
                    alert: null,
                    total_logs: null,
                    allowed_logs: null,
                    percentage: null,
                    alert_threshold: null,
                    cleanup_threshold: null,
                    cleanup_amount: null,
                    rows_to_delete: null
                },
                seen: false,
            }
        })
        checkLogStatus().then(r => isLoadedLogInformation.value = true);
    }

    async function checkLogStatus() {
        const {data} = await API.manageLoggerRepository()
        currentLogInformation.value = {
            isFetching: false,
            data: data.value.data,
            seen: false,
        }
    }

    const startRefreshToken = () => {
        const now = Date.now()
        const lastExecution = refreshTokenTime.value || now
        const elapsed = now - lastExecution

        // Clear existing interval if it exists
        if (refreshTokenInterval.value) {
            clearInterval(refreshTokenInterval.value)
        }

        // Run immediately if elapsed time exceeds interval
        if (elapsed >= refreshTokenTTl) {
            executeRefreshToken()
        } else {
            // Wait for the remaining time before first execution
            setTimeout(() => {
                executeRefreshToken()
                startInterval() // Start the repeating interval after first execution
            }, refreshTokenTTl - elapsed)
            return
        }

        // Start the interval for periodic execution
        startInterval()
    }

    const startInterval = () => {
        refreshTokenInterval.value = setInterval(() => {
            executeRefreshToken()
        }, refreshTokenTTl) // Run every refreshTokenTTl ms
    }

    const executeRefreshToken = () => {
        refreshToken()
        refreshTokenTime.value = Date.now()
    }

    const stopRefreshToken = () => {
        if (refreshTokenInterval.value) {
            clearInterval(refreshTokenInterval.value)
        }
        refreshTokenTime.value = null
    }

    async function refreshToken() {
        console.log('refresh token')
        const {data: tokenResponse} = await API.refreshToken(currentUser.value.refresh_token)
        try {
            if (tokenResponse.value) {
                const {access_token, token_payload} = tokenResponse.value.data
                const {exp: expiration} = token_payload
                setCookie('utn', access_token, expiration)
            } else {
                await signOut()
                window.location.reload()
            }
        } catch (err) {
            await signOut()
            window.location.reload()
        }
    }

    function resetInactivityTimer() {
        if (inactivityTimer.value) {
            clearTimeout(inactivityTimer.value);
        }
        inactivityTimer.value = setTimeout(async () => {
            await signOut();
            window.location.reload()
        }, inactivityTTl);
    }

    function startInactivityTracking() {
        console.log("start check inactivity tracking")
        window.addEventListener("mousemove", resetInactivityTimer);
        window.addEventListener("keydown", resetInactivityTimer);
        window.addEventListener("click", resetInactivityTimer);
        resetInactivityTimer(); // Start tracking immediately
    }

    function stopInactivityTracking() {
        window.removeEventListener("mousemove", resetInactivityTimer);
        window.removeEventListener("keydown", resetInactivityTimer);
        window.removeEventListener("click", resetInactivityTimer);
        if (inactivityTimer.value) {
            clearTimeout(inactivityTimer.value);
        }
    }

    function setMfaVerify(value) {
        mfaVerify.value = value
    }

    function initializeSecurity() {
        ///TODO: use this for afta

        console.log("do")
        if (currentUser.value && mfaVerify.value === 1) {
            // if (currentUser.value ) {
            startRefreshToken();
            startInactivityTracking();

            console.log("bkh")
            if (!isLoadedSecurityInformation.value) {
                console.log("GG")
                checkSecurity()
                checkLog()
            }
        }
    }

    initializeSecurity();
    // onMounted(()=> initializeSecurity())


    return {
        login,
        requestOtp,
        verifyEmailOtp,
        updateProfileState,
        setProcessing,
        signOut,
        setShowLog,
        requestNotificationCount,
        setMfaVerify,
        configurationWrapper,
        showLog,
        currentUser,
        loginError,
        processing,
        mailSuccess,
        setMailSuccess,
        forgotMailSuccess,
        resetPasswordSuccess,
        notificationCount,
        tryUpdateProfile,
        tryUpdatePassword,
        trySetPassword,
        updateError,
        updateProcessing,
        currentSecurityInformation,
        isLoadedSecurityInformation,
        currentLogInformation,
        isLoadedLogInformation,
        mfaMethod,
        mfaGlobal,
        mfaStatus,
        mfaVerify,
    }

})