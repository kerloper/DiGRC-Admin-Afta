import {createFetch} from "@vueuse/core";
import {useToast} from "vue-toastification";
import {eraseCookie, getCookie, setCurrentUser} from "@/utils/index.js";

const toast = useToast()
import router from "@/router/index.js";

function navigateToLogin() {
    router.replace({ name: 'login' }).then().catch();
}
export default function (baseUrl, url, options, fetchOptions) {

    const useMyFetch = createFetch({
        baseUrl: baseUrl,

        fetchOptions: {
            mode: 'cors',
        },
        options: {
            async beforeFetch({options}) {
                if (getCookie('utn')) {
                    options.headers.token = getCookie('utn')
                    options.headers.Authorization = getCookie('utn')
                }
                return {options}
            },
            afterFetch(ctx) {
                return ctx
            },

            onFetchError(ctx) {
                try{
                    ctx.error = ctx.data.error// Modifies the error
                    toast.error(ctx.error.message, {
                        timeout: 10000
                    })
                    const status = ctx.data.status
                    if (status === 401) {
                        setCurrentUser(null);
                        eraseCookie('utn');
                        eraseCookie('uName');
                        eraseCookie('uEmail');
                        navigateToLogin()
                    }
                }catch(err){
                    // toast.error(err, {
                    //     timeout: 10000
                    // })
                }


                return ctx
            },
        },

    })
    return useMyFetch(url, options, fetchOptions)

}