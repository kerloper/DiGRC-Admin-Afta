import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', () => {
  const menuType = ref('visible')
  const showMenu = computed(() =>  menuType.value === 'visible')

  function changeMenuType() {
    if (menuType.value === 'visible'){
      menuType.value = 'hidden'
    } else {
      menuType.value = 'visible'
    }
  }

  return { menuType, changeMenuType ,showMenu}
})
