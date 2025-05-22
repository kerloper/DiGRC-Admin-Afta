export const UserRole = {
  Admin: 0,
  Editor: 1
};
export const UserPermissions = {
  //Governance
  GovernanceGeneral: 'governance-api-general',
  GovernanceCompanyProfile: 'company-profile-update',
  GovernanceStructure: 'governance-tree',
  GovernanceRolesAndResponsibility: 'governance-list',
  GovernanceMemberList: 'company-member-list',
  GovernanceContext: 'company-profile-update',
  GovernanceStrategyPlanning: 'governance-list',
  GovernanceProjects: 'governance-list',
  GovernanceTechnology: 'governance-list',
  GovernanceMethodology: 'governance-list',
  GovernancePerformance: 'company-profile-update',
  GovernanceActivityLog: 'governance-logger-activity',
  GovernanceUserLog: 'governance-logger-user',

  //Asset
  AssetGeneral: 'asset-api-general',
  AssetInventory: 'asset-inventory-search',
  AssetTree: 'asset-inventory-tree',
  AssetDiscovery: 'asset-discovery',
  AssetAutomation: 'automation-asset-result',
  AssetAutomationAction: 'automation-asset-action',
  AssetImport: 'asset-inventory-import',
  AssetExport: 'asset-inventory-export',
  AssetVulnerabilityScan: 'hive-scan',
  AssetVulnerabilityList: 'hive-list',
  AssetVulnerabilityService: 'hive-service',

  //Maturity
  MaturityGeneral: 'assessment-api-maturity-general',
  MaturityDashboard: 'assessment-maturity-dashboard',
  MaturityInitiation: 'assessment-maturity-initiation',
  MaturityAssignment: 'assessment-maturity-assignment',
  MaturityAssessment: 'assessment-maturity-assessment',
  MaturityImprovementStrategyPlanning: 'improvement-task',
  MaturityImprovementExecution: 'improvement-task',
  MaturityImprovementProgressTracking: 'improvement-dashboard',
  MaturityFrameworkMappingInitiatedMaps: 'automation-mapping-result',
  MaturityFrameworkMappingCustomizedFramework: 'automation-mapping-result',

  //Compliance
  ComplianceGeneral: 'compliance-api-general',
  ComplianceFrameworkLibrary: 'assessment-framework-list',
  ComplianceManageControl: 'assessment-control-list',
  ComplianceScheduleAssessments: 'compliance-plan-list',
  ComplianceAssessmentManagement: 'compliance-task-list',
  ComplianceReviewApproval: 'compliance-task-approve',
  ComplianceReportIncidents: 'compliance-issues-list',
  ComplianceIncidentTracking: 'compliance-issues-list',
  ComplianceTrainingPrograms: 'compliance-training-list',
  ComplianceELearningIntegration: 'compliance-training-list',
  ComplianceVendor: 'compliance-training-list',
  ComplianceRiskAssessments: 'compliance-risk-list',
  ComplianceReportingDashboard: 'compliance-report-dashboard',

  //Risk
  RiskGeneral: 'risk-api-general',
  RiskRepository: 'risk-list',
  RiskImport: 'risk-import',
  RiskExport: 'risk-export',
  RiskCategories: 'risk-category-list',
  RiskRegister: 'risk-register',
  RiskAnalysis: 'risk-analysis',
  RiskResponse: 'risk-response',
  RiskTask: 'risk-task',
  RiskTaskApprove: 'risk-task-approve',
  RiskProfile: 'risk-profile',

  //Audit
  AuditGeneral: 'audit-api-general',
  AuditForms: 'audit-form-list',
  AuditPlanning: 'audit-plan-list',
  AuditExecution: 'audit-task-list',
  AuditReview: 'audit-task-approve',
  AuditRisks: 'audit-risk-list',
  AuditIssueResolution: 'audit-issues-list',
  AuditReporting: 'audit-report-dashboard',

  //Tasks
  TasksGeneral: 'task-api-general',
  TasksMyTasks: 'task-board',
  TasksMyApproval: 'task-approval',
  TasksImportExport: 'task-import',
  TasksApiIntegration: 'task-integration',


  //Evidence Library
  EvidenceLibraryGeneral: 'assessment-api-evidence-general',

  //ReportHub
  ReportHubGeneral: 'assessment-api-report-general',
  ReportHubRiskOverview: '',
  ReportHubRiskDomainStatus: '',
  ReportHubRiskTreatment: '',
  ReportHubRiskComparison: '',
  ReportHubMaturityOverview: '',
  ReportHubMaturityRemediation: '',
  ReportHubMaturityAnalysis: '',

  //Knowledge Base
  KnowledgeBaseGeneral: '',

  //Info Hub
  InfoHubGeneral: 'assessment-api-infohub-general',
  InfoHubFrameworks: 'assessment-framework-list',
  InfoHubControls: 'assessment-control-list',

  //Configuration
  ConfigurationGeneral: 'assessment-api-configuration-general',

  //User
  UserGeneral: '',
  UserView: 'user-view',
  UserUpdate: 'user-update',
  UserPasswordAdd: 'user-password-add',
  UserPasswordUpdate: 'user-password-update',
}
export const UserActionPermissions = {
  //Maturity
  MaturityDashboardActionConfirm: 'assessment-maturity-dashboard-action-confirm',
  MaturityDashboardActionEdit: 'assessment-maturity-dashboard-action-edit',
  MaturityDashboardActionReview: 'assessment-maturity-dashboard-action-review',

  MaturityAssessmentActionCustomFramework: 'assessment-maturity-action-custom-framework',
  MaturityAssessmentActionApprove: 'assessment-maturity-action-approve',
  MaturityAssessmentActionReject: 'assessment-maturity-action-reject',
  MaturityAssessmentActionSubmit: 'assessment-maturity-action-submit',
  MaturityAssessmentActionSave: 'assessment-maturity-action-save',
  MaturityAssessmentActionDone: 'assessment-maturity-action-done',
  MaturityAssessmentActionStart: 'assessment-maturity-action-start',
  MaturityAssessmentActionAssign: 'assessment-maturity-action-assign',
  MaturityAssessmentActionReassign: 'assessment-maturity-action-reassign',
  MaturityAssessmentActionSimpleView: 'assessment-maturity-action-simple-view',

  MaturityImprovementStrategyActionApprove: 'improvement-action-approve',
  MaturityImprovementStrategyActionReject: 'improvement-action-reject',
  MaturityImprovementStrategyActionSubmit: 'improvement-action-submit',
  MaturityImprovementStrategyActionSave: 'improvement-action-save',
  MaturityImprovementStrategyActionDone: 'improvement-action-done',
  MaturityImprovementStrategyActionStart: 'improvement-action-start',
  MaturityImprovementStrategyActionTask: 'improvement-action-assign',
  MaturityImprovementStrategyActionReassign: 'improvement-action-reassign',


  //Compliance
  ComplianceAssessmentActionApprove: 'assessment-compliance-action-approve',
  ComplianceAssessmentActionReject: 'assessment-compliance-action-reject',
  ComplianceAssessmentActionSubmit: 'assessment-compliance-action-submit',
  ComplianceAssessmentActionSave: 'assessment-compliance-action-save',
  ComplianceAssessmentActionDone: 'assessment-compliance-action-done',
  ComplianceAssessmentActionStart: 'assessment-compliance-action-start',
  ComplianceAssessmentActionAssign: 'assessment-compliance-action-assign',
  ComplianceAssessmentActionReassign: 'assessment-compliance-action-reassign',
  ComplianceAssessmentActionChild: 'assessment-compliance-action-child',

  //Risk
  RiskRegisterActionConfirm: 'risk-register-action-confirm',
  RiskRegisterActionAdd: 'risk-register-action-add',
  RiskRegisterActionUpdate: 'risk-register-action-update',

  RiskResponseActionConfirm: 'risk-response-action-confirm',
  RiskResponseActionUpdate: 'risk-response-action-update',
  RiskResponseActionTask: 'risk-response-action-task',

  // Tasks
  TasksMyTasksActionApprove: 'task-action-approve',
  TasksMyTasksActionReject: 'task-action-reject',
  TasksMyTasksActionSubmit: 'task-action-submit',
  TasksMyTasksActionSave: 'task-action-save',
  TasksMyTasksActionDone: 'task-action-done',
  TasksMyTasksActionStart: 'task-action-start',
  TasksMyTasksActionReassign: 'task-action-reassign',
}
