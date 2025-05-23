import {isAuthGuardActive} from '@/constants/config'
import {setCurrentUser, getCurrentUser, getCookie} from '.'
import {createPinia, setActivePinia} from 'pinia';

setActivePinia(createPinia());

import {useStorage} from "@vueuse/core";
import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore()
const mfaGlobal = useStorage("mfaGlobal", 0);
const mfaVerify = useStorage("mfaVerify", 0);
const mfaStatus = useStorage("mfaStatus", 0);

export default async (to, from, next) => {
    if (to.matched.some(record => record.meta.loginRequired)) {
        if (isAuthGuardActive) {
            const utn = getCookie('utn');
            const user = getCurrentUser();

            ///TODO:uncomment for afta
            if (utn && user) {
                console.log(mfaGlobal.value , mfaStatus.value ,mfaVerify.value)
                // if (userStore.mfaGlobal === 1 && userStore.mfaVerify === 0) {
                if ((mfaGlobal.value + mfaStatus.value) > 0 && mfaVerify.value === 0) {
                    if (to.path !== '/user/mfa') {
                        next('/user/mfa')
                    } else {
                        next()
                    }
                }
            }
            if (utn) {
                ///TODO:remove for afta
                if (!user) {
                    // userStore.configurationWrapper()
                    await userStore.updateProfileState()
                }
                const roleArray = to.matched
                    .filter((x) => x.meta.roles)
                    .map((x) => x.meta.roles)
                    .flat(); // Flatten the nested arrays if there are multiple roles in a route

                if (roleArray.length === 0 || roleArray.every((role) => user.permission.includes(role))) {
                    next();
                } else {
                    next('/unauthorized');
                }
            } else {
                setCurrentUser(null);
                next('/user/login')
            }
        } else {
            next();
        }
    } else {
        next()
    }
}
