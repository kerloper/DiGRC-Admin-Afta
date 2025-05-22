
export const defaultMenuType = 'visible'
export const BREAKPOINT = 1280
export const adminRoot = '/app';
export const searchPath = `${adminRoot}/#`
export const apiV3 = "https://dev-core.digrc.com/";
export const apiInflowengerV2 = "https://diflow.digrc.com/v2/";
export const apiAIT = "https://ait.digrc.com/";
///TODO: kerloper: uncomment bottom line and comment next line of it for production
export const cookieDomain =".digrc.com";
// export const cookieDomain ="/";
export const assetsUrl = 'https://assetdisc.digrc.com/asset-manager/'
export const vaUrl = 'https://va-core.digrc.com/v1/'
export const defaultLocale = 'en'
export const defaultDirection = 'ltr'
export const localeOptions = [
  { id: 'en', name: 'English', direction: 'ltr' },
  // { id: 'fa', name: 'فارسی', direction: 'rtl' },
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
export const isMultiRoles = true
export const refreshTokenTTl = (15 * 60 * 1000)
export const inactivityTTl = (20 * 60 * 1000)
export const constIsActiveTwoFactor =  0
export const constTwoFactorMethod = 'app'

export const selfPanel= 'admin'
// export const panelUrls = {
//     admin: "#",
//     user :  "https://app.digrc.com/",
//     partner: "https://partners.digrc.com/"
// }

export const panelUrls = {
    admin: "#",
    user : "https://dev-gcc-v3.digrc.com/",
    partner: "https://dev-partner.digrc.com/"
}

// export const panelUrls = {
//     admin: "https://dev-admin.digrc.com/",
//     user : "https://dev-gcc-v3.digrc.com/",
//     partner: "https://dev-partner.digrc.com/"
// }