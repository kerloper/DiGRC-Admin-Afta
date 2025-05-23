import {apiV3} from "@/constants/config";
import useMyFetch from "@/composables/my-fetch.js";

export default {
    login(payload) {
        const options = {
            method: 'post',
            body: payload
        }
        return useMyFetch(apiV3, "user/authentication/login", options).json()
    },
    emailRequestOtp(payload) {
        const options = {
            method: 'post',
            body: payload
        }
        return useMyFetch(apiV3, "user/authentication/email/request", options).json()
    },

    requestSmsMfaOtp(payload) {
        return useMyFetch(apiV3, "user/authentication/mfa/request", {}).post(payload).json()
    },
    verifyMfaSmsOtp(payload) {
        return useMyFetch(apiV3, "user/authentication/mfa/verify", {}).post(payload).json()
    },
    verifyEmailOtp(payload) {
        const options = {
            method: 'post',
            body: payload
        }
        return useMyFetch(apiV3, "user/authentication/email/verify", options).json()
    },
    refreshToken(refreshToken) {
        const options = {
            method: 'post',
            headers: {
                'refresh-token': refreshToken
            }
        }
        return useMyFetch(apiV3, "company/authentication/refresh-token", options).json()
    },
    signOut(payload) {
        return useMyFetch(apiV3, "user/authentication/logout", {}).json().post(payload)
    },
    dashboardDataRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/home", {}).json().post(payload)
    },

    // context section
    contextLightList(payload) {
        return useMyFetch(apiV3, "admin/assessment/context/list-light", {}).json().post(payload)
    },
    contextList(payload) {
        return useMyFetch(apiV3, "admin/assessment/context/list", {}).json().post(payload)
    },
    contextDetail(payload) {
        return useMyFetch(apiV3, "admin/assessment/context/get", {immediate: false}).json().post(payload)
    },

    //method sections of members
    listMemberRequest(payload) {
        return useMyFetch(apiV3, "admin/user/profile/list", {}).json().post(payload)
    },
    getMemberProfile(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/profile/view", options).json()
    },
    deleteMemberRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/profile/delete", options).json()
    },
    addMemberRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/profile/add", options).json()
    },
    cleanMemberRequest(payload) {
        return useMyFetch(apiV3, "admin/user/profile/clean", {}).json().post(payload)
    },
    updateMemberRequest(payload) {
        return useMyFetch(apiV3, "admin/user/profile/edit", {}).json().post(payload)
    },
    updateStatusMemberRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/profile/status", options).json()
    },
    updateMemberPasswordRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/profile/password", options).json()
    },
    onlineMembers() {
        return useMyFetch(apiV3, "admin/user/online/list", {}).json().post()
    },
    terminateMembers(payload) {
        return useMyFetch(apiV3, "admin/user/online/delete", {}).json().post(payload)
    },

    //method sections of roles
    addResourcePermission(payload) {
        return useMyFetch(apiV3, "admin/user/permission/resource/add", {}).json().post(payload)
    },
    permissionRoleUpdate(payload) {
        return useMyFetch(apiV3, "admin/user/permission/resource/update", {}).json().post(payload)
    },
    addRole(payload) {
        return useMyFetch(apiV3, "admin/user/role/add", {}).json().post(payload)
    },
    roleList(payload) {
        return useMyFetch(apiV3, "admin/user/role/list", {}).json().post(payload)
    },
    updateRole(payload) {

        return useMyFetch(apiV3, "admin/user/role/edit", {}).json().post(payload)
    },
    deleteRole(payload) {
        return useMyFetch(apiV3, "admin/user/role/delete", {}).json().post(payload)
    },

    //method sections of permission/resource
    listResourcePermissionRequest(payload) {
        return useMyFetch(apiV3, "admin/user/permission/resource/list", {}).json().post(payload)
    },
    updateResourcePermissionRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/permission/resource/update", options).json()
    },
    addPermissionResourceRole(payload) {
        return useMyFetch(apiV3, "admin/user/permission/role/add", {}).json().post(payload)
    },


    //method sections of permission/page
    listPagePermissionRequest(payload) {
        return useMyFetch(apiV3, "admin/user/permission/page/list", {}).json().post(payload)
    },

    //method sections of permission/role
    listRolePermissionRequest(payload) {
        return useMyFetch(apiV3, "admin/user/permission/role/list", {}).json().post(payload)
    },
    updateRolePermissionRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/permission/role/update", options).json()
    },
    permissionManage(payload) {
        return useMyFetch(apiV3, "admin/user/permission/resource/manage", {}).json().post(payload)
    },

    //method sections of company
    listCompanyRequest(payload) {
        return useMyFetch(apiV3, "admin/company/list", {}).json().post(payload)
    },
    addCompanyMemberRequest(payload) {
        return useMyFetch(apiV3, "admin/company/member/add", {}).json().post(payload)
    },
    updateCompanyMemberRequest(payload) {
        return useMyFetch(apiV3, "admin/company/member/update", {}).json().post(payload)
    },
    listCompanyMemberRequest(payload) {
        return useMyFetch(apiV3, "admin/company/member/list", {}).json().post(payload)
    },
    updateCompanyRequest(payload) {
        return useMyFetch(apiV3, "admin/company/update", {}).json().post(payload)
    },
    addCompanyRequest(payload) {
        return useMyFetch(apiV3, "admin/company/add", {}).json().post(payload)
    },
    updateCompanyPackageRequest(payload) {
        return useMyFetch(apiV3, "admin/company/package-update", {}).json().post(payload)
    },
    listPackageCompanyRequest(payload) {
        return useMyFetch(apiV3, "admin/company/package/list", {}).json().post(payload)
    },
    addPackageCompanyRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/company/package/add", options).json()
    },
    updatePackageCompanyRequest(payload) {
        return useMyFetch(apiV3, "admin/company/package/update", {}).json().post(payload)
    },

    //method sections of assessment
    listFrameworkRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/framework/list", {}).json().post(payload)
    },
    lightListFrameworkRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/framework/list-light", {}).json().post(payload)
    },
    addFrameworkRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/framework/add", {}).json().post(payload)
    },
    updateFrameworkRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/assessment/framework/update", options).json()
    },
    listDomainRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/domain/list", {}).json().post(payload)
    },
    lightListDomainRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/domain/list-light", {}).json().post(payload)
    },
    addDomainRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/domain/add", {}).json().post(payload)
    },
    updateDomainRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/assessment/domain/update", options).json()
    },

    lightListControlRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/control/list-light", {}).json().post(payload)
    },
    listControlRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/control/list", {}).json().post(payload)
    },
    addControlRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/control/add", {}).json().post(payload)
    },
    updateControlRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/control/update", {}).json().post(payload)
    },
    listActivateRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/activation/list", {}).json().post(payload)
    },
    addActivateRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/assessment/activation/add", options).json()
    },
    updateActivateRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/assessment/activation/update", options).json()
    },


    listImprovementRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/improvement/list", {}).json().post(payload)
    },
    addImprovementRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/improvement/add", {}).json().post(payload)
    },
    updateImprovementRequest(payload) {
        return useMyFetch(apiV3, "admin/assessment/improvement/update", {}).json().post(payload)
    },

    //method sections of log
    listInventoryLogRequest(payload) {
        return useMyFetch(apiV3, "admin/logger/system/list", {}).json().post(payload)
    },
    listUserLogRequest(payload) {
        return useMyFetch(apiV3, "admin/logger/user/list", {}).json().post(payload)
    },

    //method sections of configuration
    listCacheRequest(payload) {
        return useMyFetch(apiV3, "admin/user/cache/list", {}).json().post(payload)
    },
    deleteCacheRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/cache/delete", options).json()
    },
    persistCacheRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/cache/persist", options).json()
    },
    detailCacheRequest(payload) {
        const options = {
            method: 'post',
            body: payload,
        }
        return useMyFetch(apiV3, "admin/user/cache/view", options).json()
    },

    //method sections of prompt
    listPromptRequest(payload) {
        return useMyFetch(apiV3, "admin/ai/prompt/list", {}).json().post(payload)
    },
    addPromptRequest(payload) {
        return useMyFetch(apiV3, "admin/ai/prompt/add", {}).json().post(payload)
    },
    updatePromptRequest(payload) {
        return useMyFetch(apiV3, "admin/ai/prompt/update", {}).json().post(payload)
    },


    //api section services
    listNotificationRequest(payload) {
        return useMyFetch(apiV3, "notification/list", {}).json().post(payload)
    },
    updateNotificationRequest(payload) {
        return useMyFetch(apiV3, "notification/update", {}).json().post(payload)
    },
    getNotificationCountRequest(payload) {
        return useMyFetch(apiV3, "notification/count", {}).json().post(payload)
    },
    updateProfileRequest(payload) {
        return useMyFetch(apiV3, "user/profile/update", {}).json().post(payload)
    },
    viewProfileRequest(payload) {
        return useMyFetch(apiV3, "user/profile/view", {}).json().post(payload)
    },
    profileHistoryRequest(payload) {
        return useMyFetch(apiV3, "user/profile/history", {}).json().post(payload)
    },
    updateProfilePasswordRequest(payload) {
        return useMyFetch(apiV3, "user/password/update", {}).json().post(payload)
    },
    setProfilePasswordRequest(payload) {
        return useMyFetch(apiV3, "user/password/add", {}).json().post(payload)
    },
    uploadAvatarRequest(payload) {
        return useMyFetch(apiV3, "user/avatar/upload", {payload})
    },

    //section of core
    coreConfigSetting(payload = {}) {
        return useMyFetch(apiV3, "admin/core/config/list", {}).json().post(payload)
    },
    coreConfigUpdate(payload) {
        return useMyFetch(apiV3, "admin/core/config/update", {}).json().post(payload)
    },
    checkSignature(payload = {}) {
        return useMyFetch(apiV3, "admin/core/signature/check", {}).json().post(payload)
    },

    /// manage log repository section
    manageLoggerRepository(payload = {}) {
        return useMyFetch(apiV3, "admin/logger/manage/repository", {}).json().post(payload)
    },


    //setting section
    moduleList(payload) {
        return useMyFetch(apiV3, "admin/core/module/list", {}).json().post(payload)
    },

}
