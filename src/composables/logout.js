import router from "@/router/index.js";
import {useUserStore} from "@/stores/user.js";

const user = useUserStore()
export function logout() {
    user.signOut()
    router.push({name: "login"})
}