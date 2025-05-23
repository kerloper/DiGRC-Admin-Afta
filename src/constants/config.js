
export const defaultMenuType = 'visible'
export const BREAKPOINT = 1280
export const adminRoot = '/app';
export const searchPath = `${adminRoot}/#`
// export const apiV3 = "https://afta-core.dayagrc.ir/";
export const apiV3 = "https://dev-core.digrc.com/";
///TODO: kerloper: uncomment bottom line and comment next line of it for production
// export const cookieDomain =".dayagrc.ir";
export const cookieDomain ="localhost";
// export const cookieDomain ="/";
export const defaultLocale = 'fa'
export const defaultDirection = 'rtl'
export const localeOptions = [
  { id: 'en', name: 'English', direction: 'ltr' },
  { id: 'fa', name: 'فارسی', direction: 'rtl' },
  { id: 'ar', name: 'العربی', direction: 'rtl' },
]
export const isAuthGuardActive = true;
export const topNavItemsKey = 'top_nav_items'
export const toNavItemsDefaultValue = {
    id: '',
    label: '',
    roles: [],
    subs: [],
    to: '',
}

export const themeRadiusStorageKey = 'theme_radius'
export const themeSelectedColorStorageKey = 'theme_selected_color'
export const defaultTheme = 'emerald'
export const listSetting = {
    limit:50
}
/// Security configs
export const signatureTables = ['user_account', 'role_account', 'permission_role']
export const isMultiRoles = false
export const refreshTokenTTl = (15 * 60 * 1000)
export const inactivityTTl = (20 * 60 * 1000)
export const constIsActiveTwoFactor =  1
export const constTwoFactorMethod = 'sms'

export const selfPanel= 'admin'

export const panelUrls = {
    admin: "#",
    user : "https://afta.dayagrc.ir/",
}
export const versionName = '1.0'
