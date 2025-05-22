import {useUserStore} from "@/stores/user.js";

const userStore = useUserStore()
const user = userStore.currentUser
export const useFilteredMenuItems = (menuItems, currentUser) => {
    return menuItems
        ? menuItems.filter(
            (x) =>
                !x.roles || (x.roles && x.roles.some(role => user.permission.includes(role)))
        )
        : [];

}