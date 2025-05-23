import {createRouter, createWebHistory} from 'vue-router'
import {adminRoot} from "@/constants/config.js";
import {UserPermissions} from "@/utils/auth.roles.js";
import AuthGuard from "@/utils/auth.guard.js";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes:
        [
            {
                path: "/",
                redirect: `${adminRoot}`,
            },
            {
                path: adminRoot,
                component: () => import("../views/app/index.vue"),
                redirect: `${adminRoot}/home`,
                meta: {loginRequired: true},
                /*
               define with Authorization :
               meta: { loginRequired: true, roles: [UserPermissions.MaturityGeneral] },
               */
                children: [
                    {
                        path: "home",
                        name: "home",
                        component: () => import("../views/app/home/index.vue"),
                        meta: {loginRequired: true},
                    },
                    {
                        path: "account",
                        name: "account",
                        component: () => import("../views/app/account/index.vue"),
                        meta: {loginRequired: true},
                        redirect: `${adminRoot}/account/profile`,
                        children: [
                            {
                                path: "profile",
                                name: "accountProfile",
                                component: () => import("../views/app/account/profile/index.vue"),
                                meta: {loginRequired: true},
                            },
                            {
                                path: "password",
                                name: "accountPassword",
                                component: () => import("../views/app/account/password/index.vue"),
                                meta: {loginRequired: true},
                            },
                            {
                                path: "edit",
                                name: "accountEdit",
                                component: () => import("../views/app/account/edit/index.vue"),
                                meta: {loginRequired: true},
                            },
                            {
                                path: "history",
                                name: "accountHistory",
                                component: () => import("../views/app/account/history/index.vue"),
                                meta: {loginRequired: true},
                            },
                            {
                                path: "notification",
                                name: "accountNotification",
                                component: () => import("../views/app/account/notification/index.vue"),
                                meta: {loginRequired: true},
                            }

                        ]
                    },
                    {
                        path: "users-company",
                        name: "users-company",
                        component: () => import("../views/app/users-company/index.vue"),
                        meta: {loginRequired: true},
                        children: [
                            {
                                path: "company",
                                name: "userCompanyCompany",
                                component: () => import("../views/app/users-company/company/index.vue"),
                                redirect: `${adminRoot}/users-company/company/company-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "company-list",
                                        name: "userCompanyCompanyList",
                                        component: () => import("../views/app/users-company/company/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "member-list/:companyId?",
                                        name: "userCompanyMemberList",
                                        component: () => import("../views/app/users-company/company/member-list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "members",
                                name: "userCompanyMembers",
                                component: () => import("../views/app/users-company/members/index.vue"),
                                redirect: `${adminRoot}/users-company/members/member-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "member-list",
                                        name: "usersCompanyMembersList",
                                        component: () => import("../views/app/users-company/members/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "online-members",
                                name: "userCompanyOnlineMembers",
                                component: () => import("../views/app/users-company/online-members/index.vue"),
                                redirect: `${adminRoot}/users-company/online-members/member-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "member-list",
                                        name: "usersCompanyOnlineMembersList",
                                        component: () => import("../views/app/users-company/online-members/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "roles",
                                name: "userCompanyRoles",
                                component: () => import("../views/app/users-company/roles/index.vue"),
                                redirect: `${adminRoot}/users-company/roles/role-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "role-list",
                                        name: "usersRolesList",
                                        component: () => import("../views/app/users-company/roles/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "permission",
                                name: "userCompanyPermission",
                                component: () => import("../views/app/users-company/permission/index.vue"),
                                redirect: `${adminRoot}/users-company/permission/access`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "access",
                                        name: "usersCompanyPermissionAccess",
                                        component: () => import("../views/app/users-company/permission/access/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "resource",
                                        name: "usersCompanyPermissionResource",
                                        component: () => import("../views/app/users-company/permission/resource/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "page",
                                        name: "usersCompanyPermissionPage",
                                        component: () => import("../views/app/users-company/permission/page/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "role",
                                        name: "usersCompanyPermissionRole",
                                        component: () => import("../views/app/users-company/permission/role/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        path: "module-feature",
                        name: "module-feature",
                        component: () => import("../views/app/module-feature/index.vue"),
                        meta: {loginRequired: true},
                        children: [
                            {
                                path: "framework",
                                name: "moduleFeatureFramework",
                                component: () => import("../views/app/module-feature/framework/index.vue"),
                                redirect: `${adminRoot}/module-feature/framework/framework-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "framework-list",
                                        name: "moduleFeatureFrameworkList",
                                        component: () => import("../views/app/module-feature/framework/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "domain",
                                name: "moduleFeatureDomain",
                                component: () => import("../views/app/module-feature/domain/index.vue"),
                                redirect: `${adminRoot}/module-feature/domain/domain-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "domain-list",
                                        name: "moduleFeatureDomainList",
                                        component: () => import("../views/app/module-feature/domain/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "control",
                                name: "moduleFeatureControl",
                                component: () => import("../views/app/module-feature/control/index.vue"),
                                redirect: `${adminRoot}/module-feature/control/control-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "control-list",
                                        name: "moduleFeatureControlList",
                                        component: () => import("../views/app/module-feature/control/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        path: "log",
                        name: "log",
                        component: () => import("../views/app/log/index.vue"),
                        meta: {loginRequired: true},
                        children: [
                            {
                                path: "system",
                                name: "logInventory",
                                component: () => import("../views/app/log/system/index.vue"),
                                redirect: `${adminRoot}/log/system/log-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "log-list",
                                        name: "logInventoryList",
                                        component: () => import("../views/app/log/system/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        path: "configuration",
                        name: "configuration",
                        component: () => import("../views/app/configuration/index.vue"),
                        meta: {loginRequired: true},
                        children: [
                            {
                                path: "setting",
                                name: "configurationSetting",
                                component: () => import("../views/app/configuration/setting/index.vue"),
                                redirect: `${adminRoot}/configuration/setting/config`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "config",
                                        name: "configurationSettingConfig",
                                        component: () => import("../views/app/configuration/setting/config/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        path: "setting",
                        name: "setting",
                        component: () => import("../views/app/setting/index.vue"),
                        meta: {loginRequired: true},
                        children: []
                    },
                ]
            },
            {
                path: "/user",
                component: () => import("../views/user/index.vue"),
                redirect: "/user/login",
                children: [
                    {
                        path: "login",
                        name: "login",
                        component: () => import( "../views/user/Login.vue")
                    },  
                ]
            },
            {
                path: "/user/mfa",
                component: () => import("../views/user/mfa/index.vue"),
                redirect: "/user/mfa/verify",
                children: [
                    {
                        path: "verify",
                        name: "verify",
                        component: () => import( "../views/user/mfa/Verify.vue")
                    },


                ]
            },
            {path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import("../views/Error.vue")},

        ]
})
router.beforeEach(AuthGuard);

export default router
