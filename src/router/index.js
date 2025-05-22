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
                                path: "package",
                                name: "moduleFeaturePackage",
                                component: () => import("../views/app/module-feature/package/index.vue"),
                                redirect: `${adminRoot}/module-feature/package/package-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "package-list",
                                        name: "moduleFeaturePackageList",
                                        component: () => import("../views/app/module-feature/package/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
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
                            {
                                path: "activate",
                                name: "moduleFeatureActivate",
                                component: () => import("../views/app/module-feature/activate/index.vue"),
                                redirect: `${adminRoot}/module-feature/activate/activate-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "activate-list",
                                        name: "moduleFeatureActivateList",
                                        component: () => import("../views/app/module-feature/activate/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },


                            {
                                path: "improvement",
                                name: "moduleFeatureImprovement",
                                component: () => import("../views/app/module-feature/improvement/index.vue"),
                                redirect: `${adminRoot}/module-feature/improvement/list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "list",
                                        name: "moduleFeatureImprovementList",
                                        component: () => import("../views/app/module-feature/improvement/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "import",
                                        name: "moduleFeatureImprovementImport",
                                        component: () => import("../views/app/module-feature/improvement/import/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "audit",
                                name: "moduleFeatureAudit",
                                component: () => import("../views/app/module-feature/audit/index.vue"),
                                redirect: `${adminRoot}/module-feature/audit/template`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "import",
                                        name: "moduleFeatureAuditImport",
                                        component: () => import("../views/app/module-feature/audit/import/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "template",
                                        name: "moduleFeatureAuditTemplate",
                                        component: () => import("../views/app/module-feature/audit/template/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "check-list",
                                        name: "moduleFeatureAuditCheckList",
                                        component: () => import("../views/app/module-feature/audit/check-list/index.vue"),
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
                                path: "user",
                                name: "logUser",
                                component: () => import("../views/app/log/user/index.vue"),
                                redirect: `${adminRoot}/log/user/log-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "log-list",
                                        name: "logUserList",
                                        component: () => import("../views/app/log/user/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
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
                                path: "cache",
                                name: "cacheCache",
                                component: () => import("../views/app/configuration/cache/index.vue"),
                                redirect: `${adminRoot}/configuration/cache/cache-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "cache-list",
                                        name: "configurationCacheList",
                                        component: () => import("../views/app/configuration/cache/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
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
                    {
                        path: "workflow",
                        name: "workflow",
                        component: () => import("../views/app/workflow/index.vue"),
                        meta: {loginRequired: true},
                        children: [
                            {
                                path: "policy",
                                name: "workflowPolicy",
                                component: () => import("../views/app/workflow/policy/index.vue"),
                                redirect: `${adminRoot}/workflow/policy/policy-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "policy-list",
                                        name: "workflowPolicyList",
                                        component: () => import("../views/app/workflow/policy/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "policy-detail/:policyId?",
                                        name: "workflowPolicyDetail",
                                        component: () => import("../views/app/workflow/policy/detail/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "document",
                                name: "workflowDocument",
                                component: () => import("../views/app/workflow/document/index.vue"),
                                redirect: `${adminRoot}/workflow/document/document-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "document-list",
                                        name: "workflowDocumentList",
                                        component: () => import("../views/app/workflow/document/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                    {
                                        path: "document-detail/:documentId?",
                                        name: "workflowDocumentDetail",
                                        component: () => import("../views/app/workflow/document/detail/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        path: "ai-assistant",
                        name: "ai-assistant",
                        component: () => import("../views/app/ai-assistant/index.vue"),
                        meta: {loginRequired: true},
                        children: [
                            {
                                path: "prompt",
                                name: "aiAssistantPrompt",
                                component: () => import("../views/app/ai-assistant/prompt/index.vue"),
                                redirect: `${adminRoot}/ai-assistant/prompt/prompt-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "prompt-list",
                                        name: "aiAssistantPromptList",
                                        component: () => import("../views/app/ai-assistant/prompt/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "knowledge",
                                name: "aiAssistantKnowledge",
                                component: () => import("../views/app/ai-assistant/knowledge/index.vue"),
                                redirect: `${adminRoot}/ai-assistant/knowledge/knowledge-list`,
                                meta: {loginRequired: true},
                                children: [

                                    {
                                        path: "knowledge-list",
                                        name: "aiAssistantKnowledgeList",
                                        component: () => import("../views/app/ai-assistant/knowledge/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                            {
                                path: "library",
                                name: "aiAssistantLibrary",
                                component: () => import("../views/app/ai-assistant/library/index.vue"),
                                redirect: `${adminRoot}/ai-assistant/library/library-list`,
                                meta: {loginRequired: true},
                                children: [
                                    {
                                        path: "library-list",
                                        name: "aiAssistantLibraryList",
                                        component: () => import("../views/app/ai-assistant/library/list/index.vue"),
                                        meta: {loginRequired: true},
                                    },
                                ]
                            },
                        ]
                    }
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
