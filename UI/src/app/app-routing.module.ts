import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentComponent } from './Comman-Components/Dialog/documentmodel/document.component';
import { HomeComponent } from './Comman-Components/Homepage/home/home.component';
import { LoginComponent } from './Comman-Components/Login/login/login.component';
import { NavBarComponent } from './Comman-Components/Navbar/nav-bar/nav-bar.component';
import { PlainComponent } from './Comman-Components/Plain/plain/plain.component';
import { ProfileComponent } from './Comman-Components/Profile/profile.component';
import { ApexChartsComponent } from './Comman-Components/Reusable-Components/apex-charts/apex-charts.component';
import { CPDashBoardComponent } from './Comman-Components/Reusable-Components/cpdash-board/cpdash-board.component';
import { DashBoardComponent } from './Comman-Components/Reusable-Components/dash-board/dash-board.component';
import { CacheManagementComponent } from './Comman-Components/cache-management/cache-management.component';
import { ErrorPageComponent } from './Comman-Components/common/error-page/error-page.component';
import { PrivacyPolicyComponent } from './Comman-Components/privacy-policy/privacy-policy.component';
import { AddAccountEntryComponent } from './Components/Account/account entry/account-entry/account-entry.component';
import { DisplayAccountEntryComponent } from './Components/Account/account entry/display-account-entry/display-account-entry.component';
import { DisplayExcelMappingsComponent } from './Components/Admin/ExcelMappings/display-excel-mappings/display-excel-mappings.component';
import { ExcelMappingComponent } from './Components/Admin/ExcelMappings/excel-mapping/excel-mapping.component';
import { LeadreportpageComponent } from './Components/Admin/Lead-Reports/Lead_Report/leadreportpage/leadreportpage.component';
import { ProjectteamreportpageComponent } from './Components/Admin/Lead-Reports/TeamReport/projectteamreportpage/projectteamreportpage.component';
import { DisplayreportFieldComponent } from './Components/Admin/ReportFields/display-report-field/display-report-field.component';
import { ReportFieldComponent } from './Components/Admin/ReportFields/report-field/report-field.component';
import { ReportsComponent } from './Components/Admin/Reports/reports/reports.component';
import { ShowReportsComponent } from './Components/Admin/Reports/show-reports/show-reports.component';
import { BookingFormComponent } from './Components/Crm/Booking/booking-form/booking-form.component';
import { DisplayBookingChargesComponent } from './Components/Crm/Booking/displayBookingCharges/displayBookingCharges.component';
import { DisplayBookingFormComponent } from './Components/Crm/Booking/displayBookingForm/displayBookingForm.component';
import { DisplayBookingOverviewComponent } from './Components/Crm/Booking/displayBookingOverview/displayBookingOverview.component';
import { DisplayCustomerStagesComponent } from './Components/Crm/Booking/displayCustomerStages/displayCustomerStages.component';
import { SaveBookingChargeComponent } from './Components/Crm/Booking/save-booking-charge/save-booking-charge.component';
import { CustomerPaymentComponent } from './Components/Crm/CustomerPayment/customer-payment/customer-payment.component';
import { DisplayCustomerPaymentComponent } from './Components/Crm/CustomerPayment/display-customer-payment/display-customer-payment.component';
import { AddingPaymentComponent } from './Components/Crm/PaymentDetails/adding-payment/adding-payment.component';
import { AddingTdsComponent } from './Components/Crm/PaymentDetails/adding-tds/adding-tds.component';
import { PaymentDetailsComponent } from './Components/Crm/PaymentDetails/payment-details/payment-details.component';
import { DisplayPaymentPlanComponent } from './Components/Crm/PaymentPlan/displayPaymentPlan/displayPaymentPlan.component';
import { PaymentPlanComponent } from './Components/Crm/PaymentPlan/paymentPlan/paymentPlan.component';
import { AddStageComponent } from './Components/Crm/Stage/add-stage/add-stage.component';
import { CustomerApprovalPaymentComponent } from './Components/Crm/customer-approval-payment/customer-approval-payment.component';
import { CustomerDashboardComponent } from './Components/Crm/customer/customer-dashboard/customer-dashboard.component';
import { CustomerstagesdisplayComponent } from './Components/Crm/customer/customerstagesdisplay/customerstagesdisplay.component';
import { CustomerunitsdisplayComponent } from './Components/Crm/customer/customerunitsdisplay/customerunitsdisplay.component';
import { DisplaydocumentsComponent } from './Components/Crm/customer/displaydocuments/displaydocuments.component';
import { CustomerdocumentdisplayComponent } from './Components/Crm/customerdocumentdisplay/customerdocumentdisplay.component';
import { DisplayProjectChargeComponent } from './Components/Crm/project-charge/display-project-charge/display-project-charge.component';
import { ProjectChargeComponent } from './Components/Crm/project-charge/project-charge/project-charge.component';
import { SoaDocumentsComponent } from './Components/Crm/soa-documents/soa-documents.component';
import { AttendanceDashBoardComponent } from './Components/DashboardComponents/attendance-dash-board/attendance-dash-board.component';
import { ChannelPartnerDashBoardComponent } from './Components/DashboardComponents/cp-dash-board/cp-dash-board.component';
import { CpDashboardV1Component } from './Components/DashboardComponents/cp-dashboard-v1/cp-dashboard-v1.component';
import { DigitalmarketingdashboardComponent } from './Components/DashboardComponents/digital-marketing-dash-board/digitalmarketingdashboard/digitalmarketingdashboard.component';
import { HRdashboardComponent } from './Components/DashboardComponents/hrdashboard/hrdashboard.component';
import { ManagerDashBoardComponent } from './Components/DashboardComponents/manager-dash-board/manager-dash-board.component';
import { Managerdashboardv1Component } from './Components/DashboardComponents/managerdashboardv1/managerdashboardv1.component';
import { MemberDashBoardComponent } from './Components/DashboardComponents/member-dash-board/member-dash-board.component';
import { MemberDashboardV1Component } from './Components/DashboardComponents/member-dashboard-v1/member-dashboard-v1.component';
import { SaleHeadDashboardV1Component } from './Components/DashboardComponents/sale-head-dashboard-v1/sale-head-dashboard-v1.component';
import { SalesHeadDashBoardComponent } from './Components/DashboardComponents/sales-head-dash-board/sales-head-dash-board.component';
import { TechAdminDashBoardComponent } from './Components/DashboardComponents/tech-admin-dash-board/tech-admin-dash-board.component';
import { AssetAllocationComponent } from './Components/Employee/AssetAllocation/AssetAllocation/asset-allocation.component';
import { DisplayAssetAllocationComponent } from './Components/Employee/AssetAllocation/displayAssetAllocation/display-asset-allocation.component';
import { DisplayEmployeeComponent } from './Components/Employee/Employee/display-employee/display-employee.component';
import { DisplayResignedEmployeeComponent } from './Components/Employee/Employee/display-resigned-employee/display-resigned-employee.component';
import { EmployeeComponent } from './Components/Employee/Employee/employee/employee.component';
import { DisplayemployeebankdetailsComponent } from './Components/Employee/EmployeeBankingDetails/display-employee-banking-details/display-employee-banking-details.component';
import { EmployeebankdetailsComponent } from './Components/Employee/EmployeeBankingDetails/employee-banking-details/employee-banking-details.component';
import { AssetsComponent } from './Components/Employee/assets/assets/assets.component';
import { DisplayassetsComponent } from './Components/Employee/assets/displayassets/displayassets.component';
import { AttendanceComponent } from './Components/FacilityManagement/Attendance/attendance.component';
import { AddClientCustomerconsumptionComponent } from './Components/FacilityManagement/ClientCustomerconsumption/clientcustomerconsumption/clientcustomerconsumption.component';
import { DisplayClientcustomerconsumptionComponent } from './Components/FacilityManagement/ClientCustomerconsumption/display-clientcustomerconsumption/display-clientcustomerconsumption.component';
import { ClientServiceConfigComponent } from './Components/FacilityManagement/ClientServiceConfig/client-service-config/client-service-config.component';
import { DisplayClientServiceConfigComponent } from './Components/FacilityManagement/ClientServiceConfig/display-client-service-config/display-client-service-config.component';
import { AddCustomerComponent } from './Components/FacilityManagement/Customer/customer/Customer.component';
import { DisplaycustomerComponent } from './Components/FacilityManagement/Customer/display-customer/display-customer.component';
import { AddCustomerconsumptionComponent } from './Components/FacilityManagement/Customerconsumption/customerconsumption/customerconsumption.component';
import { DisplaycustomerconsumptionComponent } from './Components/FacilityManagement/Customerconsumption/display-customerconsumption/display-customerconsumption.component';
import { AddFingerprintUserComponent } from './Components/FacilityManagement/Fringerprint-User-Mapping/add-fingerprint-user/add-fingerprint-user.component';
import { DisplayFingerprintAssignedUserComponent } from './Components/FacilityManagement/Fringerprint-User-Mapping/display-fingerprint-assigned-user/display-fingerprint-assigned-user.component';
import { DisplayinvoiceComponent } from './Components/FacilityManagement/Invoice/display-invoice/display-Invoice.component';
import { AddInvoiceComponent } from './Components/FacilityManagement/Invoice/invoice/Invoice.component';
import { DisplayqrgeneratorComponent } from './Components/FacilityManagement/Qrgenerator/display-qrgenerator/display-qrgenerator.component';
import { AddQrgeneratorComponent } from './Components/FacilityManagement/Qrgenerator/qrgenerator/Qrgenerator.component';
import { DisplayqrtransactiondataComponent } from './Components/FacilityManagement/Qrtransactiondata/display-qrtransactiondata/display-qrtransactiondata.component';
import { AddQrtransactiondataComponent } from './Components/FacilityManagement/Qrtransactiondata/qrtransactiondata/Qrtransactiondata.component';
import { DisplayreportsComponent } from './Components/FacilityManagement/Reports/display-reports/display-reports.component';
import { DisplaysecuritypatrolComponent } from './Components/FacilityManagement/Securitypatrol/display-securitypatrol/display-Securitypatrol.component';
import { AddSecuritypatrolComponent } from './Components/FacilityManagement/Securitypatrol/securitypatrol/Securitypatrol.component';
import { AddAttendanceComponent } from './Components/FacilityManagement/add-attendance/add-attendance.component';
import { AddShiftAttendanceComponent } from './Components/FacilityManagement/add-shiftattendance/add-shiftattendance.component';

import { AttendanceReportComponent } from './Components/FacilityManagement/attendance-report/attendance-report.component';
import { AddclientComponent } from './Components/FacilityManagement/client/client/client.component';
import { DisplayclientComponent } from './Components/FacilityManagement/client/displayclient/displayclient.component';
import { AddclientinvoicereportComponent } from './Components/FacilityManagement/clientinvoicereport/clientinvoicereport/clientinvoicereport.component';
import { DisplayclientinvoicereportComponent } from './Components/FacilityManagement/clientinvoicereport/displayclientinvoicereport/displayclientinvoicereport.component';
import { DisplayCustomerInvoicesComponent } from './Components/FacilityManagement/display-customer-invoices/display-customer-invoices.component';
import { Displaylogentry } from './Components/FacilityManagement/displaylogentry/displaylogentry.component';
import { MyAttendanceComponent } from './Components/FacilityManagement/my-attendance/my-attendance.component';
import { DisplaysecurityreportComponent } from './Components/FacilityManagement/securityreport/displaysecurityreport/displaysecurityreport.component';
import { DisplayIssueApprovalsComponent } from './Components/Issues/Approvals/display-approvals/display-approvals.component';
import { IssueDashboardComponent } from './Components/Issues/IssuesDashboard/issue-dashboard/issue-dashboard.component';
import { EditReasignIssueTypeComponent } from './Components/Issues/ReassignIssueType/edit-reasign-issue-type/edit-reasign-issue-type.component';
import { ReAssignIssueTypeComponent } from './Components/Issues/ReassignIssueType/re-assign-issue-type/re-assign-issue-type.component';
import { DisplayissuesComponent } from './Components/Issues/display-issues/display-issues.component';
import { AddIssuesComponent } from './Components/Issues/issues/issues.component';
import { DisplayHolidayComponent } from './Components/Leave/Holiday/display-holiday/display-holiday.component';
import { HolidayComponent } from './Components/Leave/Holiday/holiday/holiday.component';
import { DisplayLeaveRequestComponent } from './Components/Leave/LeaveRequest/LeaveRequest/display-leave-request/display-leave-request.component';
import { LeaveRequestComponent } from './Components/Leave/LeaveRequest/LeaveRequest/leave-request/leave-request.component';
import { AddTeamLeavesComponent } from './Components/Leave/LeaveRequest/My Team Leaves/add-team-leaves/add-team-leaves.component';
import { DisplayTeamLeavesComponent } from './Components/Leave/LeaveRequest/My Team Leaves/display-team-leaves/display-team-leaves.component';
import { AddTeamWeekoffComponent } from './Components/Leave/LeaveRequest/My Team WeekOff/add-team-weekoff/add-team-weekoff.component';
import { DisplayTeamWeekOffComponent } from './Components/Leave/LeaveRequest/My Team WeekOff/display-team-week-off/display-team-week-off.component';
import { AddWeekOffComponent } from './Components/Leave/LeaveRequest/WeekOff/add-week-off/add-week-off.component';
import { DisplayWeekOffComponent } from './Components/Leave/LeaveRequest/WeekOff/display-week-off/display-week-off.component';
import { OrganizationChartComponent } from './Components/Organizationchart/Organizationchart/organization-chart.component';
import { DisplayAllLeadsComponent } from './Components/Presales/All Lead/display-account-entry/display-all-leads.component';
import { ChannelPartnerApprovalComponent } from './Components/Presales/CP Approvals/channel-partner-approval.component';
import { ChannelPartnerApproveComponent } from './Components/Presales/CP Approve/cpapprove.component';
import { CPLeadRegisterComponent } from './Components/Presales/CP Lead Register/cp-lead-register/cp-lead-register.component';
import { ChannelPatnerRegisterComponent } from './Components/Presales/CP Registration/channel-patner-register/channel-patner-register.component';
import { DisplayChannelPartnerComponent } from './Components/Presales/CP Registration/display-channel-partner/display-channel-partner.component';
import { DigitalLeadsComponent } from './Components/Presales/Digital Leads/digital-leads/digital-leads.component';
import { EditChannelPatnerApprovalComponent } from './Components/Presales/Edit CP Approvals/edit-channel-patner-approval.component';
import { LeadbudgetComponent } from './Components/Presales/LeadBudget/leadbudget/leadbudget.component';
import { LeadbudgetpageComponent } from './Components/Presales/LeadBudget/leadbudgetpage/leadbudgetpage.component';
import { DisplayLeadSourcesComponent } from './Components/Presales/LeadSource/display-leadsources/display-sources.component';
import { LeadSourceComponent } from './Components/Presales/LeadSource/leadsource/leadsource.component';
import { DisplayLeadSubSourcesComponent } from './Components/Presales/LeadSubSource/display-leadsubsources/display-subsources.component';
import { LeadSubSourceComponent } from './Components/Presales/LeadSubSource/leadsubsource/leadsubsource.component';
import { AddLeadComponent } from './Components/Presales/Leads/add-lead/add-lead.component';
import { AllLeadsComponent } from './Components/Presales/Leads/all-leads/all-leads.component';
import { CustomerLeadPageComponent } from './Components/Presales/Leads/customer-lead-page/customer-lead-page.component';
import { CustomerLeadComponent } from './Components/Presales/Leads/customer-lead/customer-lead.component';
import { DashboardFollowupsComponent } from './Components/Presales/Leads/dashboard-followups/dashboard-followups.component';
import { DisplayEoiComponent } from './Components/Presales/Leads/display-eoi/display-eoi.component';
import { DisplayExpiringLeadsComponent } from './Components/Presales/Leads/display-expiring-leads/display-expiring-leads.component';
import { DisplayFollowupsComponent } from './Components/Presales/Leads/display-followups/display-followups.component';
import { DisplayLeadsComponent } from './Components/Presales/Leads/display-leads/display-leads.component';
import { DuplicateLeadsComponent } from './Components/Presales/Leads/dulicate-lead/duplicate-leads.component';
import { EoiComponent } from './Components/Presales/Leads/eoi/eoi.component';
import { LeadFollowupComponent } from './Components/Presales/Leads/lead-followup/lead-followup.component';
import { LeadhistorypageComponent } from './Components/Presales/Leads/leadhistorypage/leadhistorypage.component';
import { WalkInLeadsComponent } from './Components/Presales/Leads/walkinleads/walk-in-leads/walk-in-leads.component';
import { RolemanageComponent } from './Components/Presales/RoleManage/rolemanage/rolemanage.component';
import { SalesteamsComponent } from './Components/Presales/SalesTeam/salesteams/salesteams.component';
import { SalesteamspageComponent } from './Components/Presales/SalesTeam/salesteamspage/salesteamspage.component';
import { DisplayScheduleVisitComponent } from './Components/Presales/Schedule Visit/display-schedule-visit/display-schedule-visit.component';
import { LeadScheduleVisitComponent } from './Components/Presales/Schedule Visit/lead-schedule-visit/lead-schedule-visit.component';
import { SiteVisitComponent } from './Components/Presales/Site Visit/site-visit/site-visit.component';
import { DisplayTeamMatesComponent } from './Components/Presales/display-team-mates/display-team-mates.component';
import { ManualleadassignComponent } from './Components/Presales/manualleadassign/manualleadassign.component';
import { ApprovalsComponent } from './Components/Procurement/Approvals/approvals/approvals.component';
import { DisplayapprovalsComponent } from './Components/Procurement/Approvals/display-approvals/display-approvals.component';
import { DisplayIndentApprovalsComponent } from './Components/Procurement/Approvals/indent-approval/indent-approval.component';
import { ConfigurationTabsComponent } from './Components/Procurement/Configuration/ConfigurationTabs/configuration-tabs/configuration-tabs.component';
import { AddIndentComponent } from './Components/Procurement/Indent/add-indent/add-indent.component';
import { DisplayindentComponent } from './Components/Procurement/Indent/display-indent/display-indent.component';
import { DisplayNonPendingIndentComponent } from './Components/Procurement/Indent/display-non-pending-indent/display-non-pending-indent.component';
import { IndentDetailsComponent } from './Components/Procurement/Indent/indent-details/indent-details.component';
import { ViewIndentComponent } from './Components/Procurement/Indent/view-indent/view-indent.component';
import { AddItemCategoryComponent } from './Components/Procurement/ItemCategory/add-item-category/add-item-category.component';
import { ItemCategoriesComponent } from './Components/Procurement/ItemCategory/item-categories/item-categories.component';
import { AddItemSpecificationComponent } from './Components/Procurement/ItemSpecification/add-item-specification/add-item-specification.component';
import { DisplayItemSpecificationComponent } from './Components/Procurement/ItemSpecification/display-item-specification/display-item-specification.component';
import { AddItemSubCategoryComponent } from './Components/Procurement/ItemSubCategory/add-item-sub-category/add-item-sub-category.component';
import { DisplayItemSubCategoryComponent } from './Components/Procurement/ItemSubCategory/display-item-sub-category/display-item-sub-category.component';
import { AddItemUnitComponent } from './Components/Procurement/ItemUnit/add-item-unit/add-item-unit.component';
import { DisplayitemUnitComponent } from './Components/Procurement/ItemUnit/display-item-unit/display-item-unit.component';
import { DisplyPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-purchaseorder/display-purchaseorder.component';
import { PurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/purchaseorder/purchaseorder.component';
import { ViewPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/view-purchaseorder/view-purchaseorder.component';
import { AddQuotationComponent } from './Components/Procurement/Quotation/add-quotation/add-quotation.component';
import { CreateQuotationComponent } from './Components/Procurement/Quotation/create-quotation/create-quotation.component';
import { CreateQuotationsComponent } from './Components/Procurement/Quotation/create-quotations/create-quotations.component';
import { DisplayquotationComponent } from './Components/Procurement/Quotation/display-quotation/display-quotation.component';
import { StoreComponent } from './Components/Procurement/Strore/store/store.component';
import { DisplayInventoryReceivableComponent } from './Components/Procurement/inventory-receivables/display-inventory-receivables/display-inventory-receivables.component';
import { AddInventoryReceivable } from './Components/Procurement/inventory-receivables/inventory-receivables/inventory-receivables.component';
import { AddBlockComponent } from './Components/Project/Block/add-block/add-block.component';
import { DisplayblockComponent } from './Components/Project/Block/display-block/display-block.component';
import { AddBookingComponent } from './Components/Project/Booking/add-booking/add-booking.component';
import { BookingLeadComponent } from './Components/Project/Booking/booking-lead/booking-lead/booking-lead.component';
import { CustomerLegalDocumentPageComponent } from './Components/Project/LegalCustomerDocument/customer-legal-document-page/customer-legal-document-page.component';
import { LegalCustomerDocumnetComponent } from './Components/Project/LegalCustomerDocument/legal-customer-documnet/legal-customer-documnet.component';
import { DisplayLevelComponent } from './Components/Project/Level/display-level/display-level.component';
import { LevelComponent } from './Components/Project/Level/level/level.component';
import { DisplayprojectComponent } from './Components/Project/Project/displayproject/displayproject.component';
import { ProjectComponent } from './Components/Project/Project/project/project.component';
import { AddsaleaggrementtemplatefieldsComponent } from './Components/Project/SalesAggrementTemplate/addsaleaggrementtemplatefields/addsaleaggrementtemplatefields.component';
import { AddsalesaggrementtemplateComponent } from './Components/Project/SalesAggrementTemplate/addsalesaggrementtemplate/addsalesaggrementtemplate.component';
import { DisplaysalesaggrementtemplateComponent } from './Components/Project/SalesAggrementTemplate/displaysalesaggrementtemplate/displaysalesaggrementtemplate.component';
import { GeneratesalesaggrementComponent } from './Components/Project/SalesAggrementTemplate/generatesalesaggrement/generatesalesaggrement.component';
import { AvailableUnitsComponent } from './Components/Project/Unit/available-units/available-units.component';
import { DisplayUnitComponent } from './Components/Project/Unit/display-unit/display-unit.component';
import { UnitComponent } from './Components/Project/Unit/unit/unit.component';
import { DisplayUnitTypeComponent } from './Components/Project/UnitType/display-unit-type/display-unit-type.component';
import { UnitTypeComponent } from './Components/Project/UnitType/unittype/unit-type.component';
import { DisplaynotificationsComponent } from './Components/Project/notifications/displaynotifications/displaynotifications.component';
import { NotificationsComponent } from './Components/Project/notifications/notification/notifications.component';
import { AddAdditionalShiftComponent } from './Components/User/AdditinalShift/add-additional-shift/add-additional-shift.component';
import { DisplayAdditionalShiftComponent } from './Components/User/AdditinalShift/display-additional-shift/display-additional-shift.component';
import { CloneuserComponent } from './Components/User/CloneUser/cloneuser/cloneuser.component';
import { CommonreferenceDetailsComponent } from './Components/User/Common-Reference/CommonReferenceDetails/commonreference-details/commonreference-details.component';
import { DisplaycommonreferencedetailsComponent } from './Components/User/Common-Reference/CommonReferenceDetails/displaycommonreferencedetails/displaycommonreferencedetails.component';
import { CommonReferenceTypeComponent } from './Components/User/Common-Reference/CommonReferenceType/common-reference-type/common-reference-type.component';
import { DisplayCommonReferenceTypeComponent } from './Components/User/Common-Reference/CommonReferenceType/display-common-reference-type/display-common-reference-type.component';
import { DisplayRoleReferencePermissionComponent } from './Components/User/Common-Reference/RoleReferencePermission/displayrolereferencepermission/displayrolereferencepermission.component';
import { RoleReferencePermissionComponent } from './Components/User/Common-Reference/RoleReferencePermission/rolereferencepermission/rolereferencepermission.component';
import { DisplaymenuComponent } from './Components/User/Menu/displaymenu/displaymenu.component';
import { AddMenuComponent } from './Components/User/Menu/menu/menu.component';
import { AddmenuitemComponent } from './Components/User/MenuItem/addmenuitem/addmenuitem.component';
import { DisplayMenuItemComponent } from './Components/User/MenuItem/display-menu-item/display-menu-item.component';
import { DisplayOrganizationComponent } from './Components/User/Organization/display-organization/display-organization.component';
import { OrganizationComponent } from './Components/User/Organization/organization/organization.component';
import { AddRoleComponent } from './Components/User/Role/add-role/add-role.component';
import { RoleComponent } from './Components/User/Role/role/role.component';
import { RolepermissiondisplayComponent } from './Components/User/RolePermission/role-permission-display/rolepermissiondisplay/rolepermissiondisplay.component';
import { AddUserComponent } from './Components/User/User/add-user/add-user.component';
import { DisplayUserComponent } from './Components/User/User/display-user/display-user.component';
import { UsermanageComponent } from './Components/User/UserManage/usermanage/usermanage.component';
import { UsermanagepageComponent } from './Components/User/UserManage/usermanagepage/usermanagepage.component';
import { UserteamanageComponent } from './Components/User/UserManage/userteamanage/userteamanage.component';
import { DisplayPrimeActivityCodeComponent } from './Components/WorkOrder/Prime Activity Code/display-prime-activity-code/display-prime-activity-code.component';
import { AddPrimeActivityCode } from './Components/WorkOrder/Prime Activity Code/prime-activity-code/prime-activity-code.component';
import { DisplaySacCodeComponent } from './Components/WorkOrder/Sac Code/display-sac-code/display-sac-code.component';
import { SacCodeComponent } from './Components/WorkOrder/Sac Code/sac-code/sca-code.component';
import { DisplayServiceCodeComponent } from './Components/WorkOrder/Service Code/display-service-code/display-service-code.component';
import { AddServiceCode } from './Components/WorkOrder/Service Code/service-code/service-code.component';
import { DisplayServiceGroupComponent } from './Components/WorkOrder/Service Group/display-service-group/display-service-group.component';
import { AddServiceGroup } from './Components/WorkOrder/Service Group/service-group/service-group.component';
import { DisplayStandInUserComponent } from './Components/WorkOrder/StandInUser/display-stand-in-user/display-stand-in-user.component';
import { AddStandInUser } from './Components/WorkOrder/StandInUser/stand-in-user/stand-in-user.component';
import { DisplayvendorComponent } from './Components/WorkOrder/Vendor Data/displayvendor/displayvendor.component';
import { AddvendorComponent } from './Components/WorkOrder/Vendor Data/vendor/vendor.component';
import { DisplayWorkOrderApprovalComponent } from './Components/WorkOrder/Work Order Approval/display-work-order-approval/display-work-order-approval.component';
import { WorkOrderApprovalComponent } from './Components/WorkOrder/Work Order Approval/work-order-approval/work-order-approval.component';
import { DisplayWorkOrderBillingApprovalComponent } from './Components/WorkOrder/Work Order Billing Approval/display-work-order-billing-approval/display-work-order-billing-approval.component';
import { WorkOrderBillingApprovalComponent } from './Components/WorkOrder/Work Order Billing Approval/work-order-billing-approval/work-order-billing-approval.component';
import { DisplayWorkOrderBillingDetailsComponent } from './Components/WorkOrder/Work Order Billing Details/display-work-order-billing-details/display-work-order-billing-details.component';
import { DisplayWorkOrderBillingComponent } from './Components/WorkOrder/Work Order Billing/display-work-order-billing/display-work-order-billing.component';
import { AddWorkOrderBilling } from './Components/WorkOrder/Work Order Billing/work-order-billing/work-order-billing.component';
import { DisplayWorkOrderCreationComponent } from './Components/WorkOrder/Work Order Creation/display-work-order-creation/display-work-order-creation.component';
import { AddWorkOrderCreation } from './Components/WorkOrder/Work Order Creation/work-order-creation/work-order-creation.component';
import { DisplayWorkOrderDetailsComponent } from './Components/WorkOrder/Work Order Details/display-work-order-details/display-work-order-details.component';
import { DisplayWorkOrderHeaderComponent } from './Components/WorkOrder/Work Order Header/display-work-order-header/display-work-order-header.component';
import { WorkOrderHeaderComponent } from './Components/WorkOrder/Work Order Header/work-order-header/work-order-header.component';
import { AddWorkflowtypeComponent } from './Components/Workflow/WorkflowType/add-workflowtype/add-workflowtype.component';
import { DisplayWorkflowTypesComponent } from './Components/Workflow/WorkflowType/display-workflow-types/display-workflow-types.component';
import { DisplayworkflowstageComponent } from './Components/Workflow/Workflowstage/display-workflowstage/display-Workflowstage.component';
import { AddWorkflowstageComponent } from './Components/Workflow/Workflowstage/workflowstage/Workflowstage.component';
import { CustomerlayoutComponent } from './Components/customerlayout/customerlayout.component';
import { DuplicateleadhistoryDisplayComponent } from './Components/duplicateleadhistory/duplicateleadhistory/duplicateleadhistory.component';
import { AuthGuard } from './Guard/AuthGuard/auth.guard';

import { SaleAgreementApprovalComponent } from './Components/Crm/Approvals/sale-agreement-approval/sale-agreement-approval.component';
import { BookingformApprovalComponent } from './Components/Crm/Booking/bookingform-approval/bookingform-approval.component';
import { DisplayPaymentLedgerComponent } from './Components/Crm/PaymentDetails/display-payment-ledger/display-payment-ledger.component';
import { AssignApplicantsToCrmmembersComponent } from './Components/Crm/assign-applicants-to-crmmembers/assign-applicants-to-crmmembers.component';
import { DisplayApprovedSaleagreementsComponent } from './Components/Crm/display-approved-saleagreements/display-approved-saleagreements.component';
import { DisplaySaleAgreementComponent } from './Components/Crm/display-sale-agreement/display-sale-agreement.component';
import { CtoDashBoardComponent } from './Components/DashboardComponents/cto-dash-board/cto-dash-board.component';
import { EmployeeDetailsApproveComponent } from './Components/Employee/Employee/employee-details-approve/employee-details-approve.component';
import { EmployeeformstagesComponent } from './Components/Employee/Employee/employeeformstages/employeeformstages.component';
import { DisplayFeildofficerpatrolComponent } from './Components/FacilityManagement/Securitypatrol/display-feildofficerpatrol/display-feildofficerpatrol.component';
import { DisplayCpDocumentsComponent } from './Components/Presales/CP Registration/display-cp-documents/display-cp-documents.component';
import { DisplayCpLeadsComponent } from './Components/Presales/Leads/display-cp-leads/display-cp-leads.component';
import { UniqueLeadsComponent } from './Components/Presales/Leads/unique-leads/unique-leads.component';
import { GreFormComponent } from './Components/Presales/gre-form/gre-form.component';
import { DisplayApprovalQuotationComponent } from './Components/Procurement/Approvals/display-quotation-approval/display-quotation-approval.component';
import { DisplayApproveRejReworkQuotationComponent } from './Components/Procurement/Approvals/quotation-approval/quotation-approval.component';
import { DisplayInventoryTransferComponent } from './Components/Procurement/Inventory-transfer/display-inventory-transfer/display-inventory-transfer.component';
import { InventoryTransferComponent } from './Components/Procurement/Inventory-transfer/inventory-transfer/inventory-transfer.component';
import { DisplayApproveRejReworkPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-approved-purchase-order/display-approved-purchase-order.component';
import { DisplayApprovedQuotationComponent } from './Components/Procurement/PurchaseOrder/display-approved-quotation/display-approved-quotation.component';
import { DisplayNonPendingPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-non-pending-purchase-order/display-non-pending-purchase-order.component';
import { DisplayApprovalPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-purchase-order-approval/display-purchase-order-approval.component';
import { DisplayNonPendingQuotationComponent } from './Components/Procurement/Quotation/display-non-pending-quotation/display-non-pending-quotation.component';
import { DisplayStoreInventoryComponent } from './Components/Procurement/storeinventory/display-store-inventory/display-store-inventory.component';
import { SearchLeadsComponent } from './Components/Presales/search-leads/search-leads.component';

import { DisplayStoreComponent } from './Components/Procurement/Strore/display-store/display-store.component';

import { AddWoQuantityComponent } from './Components/WorkOrder/Add WO Quantity/add-work-order-quantity.component';
import { AddAndEditWorkOrderCreation } from './Components/WorkOrder/Work Order Creation/add-work-order-creation/add-work-order-creation.component';
import { AddWoHeaderComponent } from './Components/WorkOrder/Add WO Header/add-wo-header.component';
import { AddWorkOrderHeaderCreationComponent } from './Components/WorkOrder/Work Order Creation/add-work-order-header/add-work-order-header.component';

import { BlockUnitComponent } from './Components/Project/Booking/block-unit/block-unit.component';

import { EditInventoryReceivablesComponent } from './Components/Procurement/inventory-receivables/edit-inventory-receivables/edit-inventory-receivables.component';
import { BookingFormAddingPaymentComponent } from './Components/Crm/Booking/booking-form-adding-payment/booking-form-adding-payment';
import { AddstoreinventoryComponent } from './Components/Procurement/storeinventory/addstoreinventory/addstoreinventory.component';
import { GlobalDashboardComponent } from './Components/DashboardComponents/global-dashboard/global-dashboard.component';
import { CRMFollowupComponent } from './Components/Crm/crmfollowup/crmfollowup.component';
import { AccountsCrmDashboardComponent } from './Components/DashboardComponents/accounts-crm-dashboard/accounts-crm-dashboard.component';
import { ShiftAttendanceComponent } from './Components/FacilityManagement/ShiftAttendance/shift-attendance.component';
import { ShiftAttendanceDashBoardComponent } from './Components/DashboardComponents/shiftattendance-dash-board/shiftattendance-dash-board.component';
import { CancelBookingApprovalComponent } from './Components/Crm/Approvals/cancel-booking-approval/cancel-booking-approval.component';
import { DisplayPaymentDetailsComponent } from './Components/Crm/PaymentDetails/display-payment-details/display-payment-details.component';
import { CrmDashBoardComponent } from './Components/DashboardComponents/crm-dash-board/crm-dash-board.component';
import { MagnusReportComponent } from './Components/Crm/Report/magnus-report/magnus-report.component';
import { CpInvoiceComponent } from './Components/Presales/cp-invoice/cp-invoice.component';
import { LeadTransferApprovalsComponent } from './Components/Presales/lead-transfer-approvals/lead-transfer-approvals.component';
import { InventoryReceivablePendingApprovalComponent } from './Components/Procurement/InventoryReceivableApprovals/InventoryReceivablePendingApproval/inventory-receivable-pending-approval.component';
import { InventoryReceivableNonPendingApprovalComponent } from './Components/Procurement/InventoryReceivableApprovals/InventoryReceivableNonPendingApproval/inventory-receivable-non-pending-approval.component';
import { DisplayIRComponent } from './Components/Procurement/inventory-receivables/display-inventory-receivable/display-inventory-receivable.component';
import { ViewInventoryReceivableComponent } from './Components/Procurement/InventoryReceivableApprovals/ViewInventoryReceivable/view-inventory-receivable.component';
import { PendingInventoryReceivableComponent } from './Components/Procurement/InventoryReceivableApprovals/PendingInventoryReceivable/pending-inventory-receivable.component';
import { AppRejInventoryReceivableComponent } from './Components/Procurement/InventoryReceivableApprovals/AppRejInventoryReceivable copy/app-rej-inventory-receivable.component';
import { CpTermsAndConditionsComponent } from './Components/Presales/cp-terms-and-conditions/cp-terms-and-conditions.component';
// import { DisplayBookingOverviewComponent } from './Components/Crm/Booking/displayBookingOverview/displayBookingOverview.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },

  {
    path: 'layout',
    canActivate: [AuthGuard],
    component: NavBarComponent,
    children: [
      {
        path: 'plain',
        component: PlainComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'cache-management', component: CacheManagementComponent },
      {
        path: 'presales/manager/dashboard',
        canActivate: [AuthGuard],
        component: ManagerDashBoardComponent,
      },
      {
        path: 'head/dashboard',
        canActivate: [AuthGuard],
        component: SalesHeadDashBoardComponent,
      },
      {
        path: 'presales/member/dashboard',
        canActivate: [AuthGuard],
        component: MemberDashBoardComponent,
      },
      {
        path: 'techadmin/dashboard',
        canActivate: [AuthGuard],
        component: TechAdminDashBoardComponent,
      },
      {
        path: 'sales/member/dashboard',
        canActivate: [AuthGuard],
        component: MemberDashBoardComponent,
      },
      {
        path: 'crm/crmuser/dashboard',
        canActivate: [AuthGuard],
        component: CrmDashBoardComponent,
      },
      { path: 'organizationchart', component: OrganizationChartComponent },

      {
        path: 'organizations',
        canActivate: [AuthGuard],
        component: DisplayOrganizationComponent,
      },
      {
        path: 'addorganization',
        canActivate: [AuthGuard],
        component: OrganizationComponent,
      },
      {
        path: 'reports/leads',
        canActivate: [AuthGuard],
        component: LeadreportpageComponent,
        // component: ShowLeadsReportComponent,
      },
      {
        path: 'reports/project/team',
        canActivate: [AuthGuard],
        component: ProjectteamreportpageComponent,
        // component: ShowLeadsReportComponent,
      },
      {
        path: 'menu',
        canActivate: [AuthGuard],
        component: DisplaymenuComponent,
      },
      {
        path: 'addmenu',
        canActivate: [AuthGuard],
        component: AddMenuComponent,
      },
      {
        path: 'addblock',
        canActivate: [AuthGuard],
        component: AddBlockComponent,
      },
      {
        path: 'role',
        canActivate: [AuthGuard],
        component: RoleComponent,
      },
      {
        path: 'addrole',
        canActivate: [AuthGuard],
        component: AddRoleComponent,
      },
      {
        path: 'menu/item',
        canActivate: [AuthGuard],
        component: DisplayMenuItemComponent,
      },
      {
        path: 'addmenuitem',
        canActivate: [AuthGuard],
        component: AddmenuitemComponent,
      },
      {
        path: 'store/from',
        canActivate: [AuthGuard],
        component: StoreComponent,
      },
      {
        path: 'usermanage/:Team',
        canActivate: [AuthGuard],
        component: UsermanagepageComponent,
      },
      {
        path: 'add/usermanage',
        canActivate: [AuthGuard],
        component: UsermanageComponent,
      },
      {
        path: 'attendance',
        canActivate: [AuthGuard],
        component: AttendanceComponent,
      },
      {
        path: 'shiftattendance',
        canActivate: [AuthGuard],
        component: ShiftAttendanceComponent,
      },
      {
        path: 'attendance/addAttendance',
        canActivate: [AuthGuard],
        component: AddAttendanceComponent,
      },
      {
        path: 'attendance/addShiftAttendance',
        canActivate: [AuthGuard],
        component: AddShiftAttendanceComponent,
      },
      {
        path: 'attendance/attendanceReport',
        canActivate: [AuthGuard],
        component: AttendanceReportComponent,
      },
      {
        path: 'attendance/attendanceReport',
        canActivate: [AuthGuard],
        component: AttendanceReportComponent,
      },
      {
        path: 'attendance/myattendancehistoty',
        canActivate: [AuthGuard],
        component: MyAttendanceComponent,
      },

      {
        path: 'attendance/teamAttendanceReport',
        canActivate: [AuthGuard],
        component: AttendanceDashBoardComponent,
      },

      {
        path: 'attendance/teamShiftAttendanceReport',
        canActivate: [AuthGuard],
        component: ShiftAttendanceDashBoardComponent,
      },
      {
        path: 'crm/accounts',
        canActivate: [AuthGuard],
        component: AccountsCrmDashboardComponent,
      },
      {
        path: 'crm/accounts',
        canActivate: [AuthGuard],
        component: AccountsCrmDashboardComponent,
      },
      {
        path: 'fingerprintusermapping',
        canActivate: [AuthGuard],
        component: AddFingerprintUserComponent,
      },
      {
        path: 'displayfingerprintusermapping',
        canActivate: [AuthGuard],
        component: DisplayFingerprintAssignedUserComponent,
      },
      {
        path: 'project/management/projects',
        canActivate: [AuthGuard],
        component: DisplayprojectComponent,
      },
      {
        path: 'addprimeactivitycode',
        canActivate: [AuthGuard],
        component: AddPrimeActivityCode,
      },
      {
        path: 'displayprimeactivitycode',
        canActivate: [AuthGuard],
        component: DisplayPrimeActivityCodeComponent,
      },

      {
        path: 'addservicegroup',
        canActivate: [AuthGuard],
        component: AddServiceGroup,
      },

      {
        path: 'addservicecode',
        canActivate: [AuthGuard],
        component: AddServiceCode,
      },
      {
        path: 'displayservicegroup',
        canActivate: [AuthGuard],
        component: DisplayServiceGroupComponent,
      },

      {
        path: 'displayservicecode',
        canActivate: [AuthGuard],
        component: DisplayServiceCodeComponent,
      },

      {
        path: 'displayservicecode',
        canActivate: [AuthGuard],
        component: DisplayServiceCodeComponent,
      },

      {
        path: 'itemcategory',
        canActivate: [AuthGuard],
        component: AddItemCategoryComponent,
      },
      {
        path: 'item/sub/category',
        canActivate: [AuthGuard],
        component: DisplayItemSubCategoryComponent,
      },
      {
        path: 'itemsubcategory',
        canActivate: [AuthGuard],
        component: AddItemSubCategoryComponent,
      },
      {
        path: 'item/specification',
        canActivate: [AuthGuard],
        component: DisplayItemSpecificationComponent,
      },
      {
        path: 'itemspecification',
        canActivate: [AuthGuard],
        component: AddItemSpecificationComponent,
      },
      {
        path: 'item/unit',
        canActivate: [AuthGuard],
        component: DisplayitemUnitComponent,
      },
      {
        path: 'project/management/projects',
        canActivate: [AuthGuard],
        component: DisplayprojectComponent,
      },

      {
        path: 'itemunit',
        canActivate: [AuthGuard],
        component: AddItemUnitComponent,
      },
      {
        path: 'project/management/blocks',
        canActivate: [AuthGuard],
        component: DisplayblockComponent,
      },
      {
        path: 'project/allocation',
        canActivate: [AuthGuard],
        component: PlainComponent,
      },
      {
        path: 'project/level',
        canActivate: [AuthGuard],
        component: LevelComponent,
      },
      {
        path: 'project/unit/type',
        canActivate: [AuthGuard],
        component: DisplayUnitTypeComponent,
      },
      {
        path: 'unittypes',
        canActivate: [AuthGuard],
        component: UnitTypeComponent,
      },
      {
        path: 'project/unit',
        canActivate: [AuthGuard],
        component: DisplayUnitComponent,
      },
      {
        path: 'unit',
        canActivate: [AuthGuard],
        component: UnitComponent,
      },

      //procurement paths

      {
        path: 'project',
        canActivate: [AuthGuard],
        component: ProjectComponent,
      },
      {
        path: 'role/permission',
        canActivate: [AuthGuard],
        component: RolepermissiondisplayComponent,
      },
      {
        path: 'project/levels',
        canActivate: [AuthGuard],
        component: DisplayLevelComponent,
      },
      {
        path: 'project/units',
        canActivate: [AuthGuard],
        component: DisplayUnitComponent,
      },
      {
        path: 'project/notifications',
        canActivate: [AuthGuard],
        component: NotificationsComponent,
      },
      {
        path: 'project/displaynotifications',
        canActivate: [AuthGuard],
        component: DisplaynotificationsComponent,
      },

      //presales
      {
        path: 'store/form',
        canActivate: [AuthGuard],
        component: StoreComponent,
      },
      {
        path: 'presales',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'manager/dashboard',
            canActivate: [AuthGuard],
            component: ManagerDashBoardComponent,
          },
          {
            path: 'leads/budget',
            canActivate: [AuthGuard],
            component: LeadbudgetpageComponent,
          },
          {
            path: 'saveleadbudget',
            canActivate: [AuthGuard],
            component: LeadbudgetComponent,
          },
          {
            path: 'leads/:PST',
            canActivate: [AuthGuard],
            component: DisplayLeadsComponent,
          },

          {
            path: 'cp/leads',
            canActivate: [AuthGuard],
            component: DisplayLeadsComponent,
          },
          {
            path: 'cp/followups',
            canActivate: [AuthGuard],
            component: DashboardFollowupsComponent,
          },

          {
            path: 'savelead/:PST',
            canActivate: [AuthGuard],
            component: AddLeadComponent,
          },
          {
            path: 'cp/lead/register',
            canActivate: [AuthGuard],
            component: CPLeadRegisterComponent,
          },
          {
            path: 'source',
            canActivate: [AuthGuard],
            component: DisplayLeadSourcesComponent,
          },
          {
            path: 'leadsource',
            canActivate: [AuthGuard],
            component: LeadSourceComponent,
          },
          {
            path: 'subsource',
            canActivate: [AuthGuard],
            component: DisplayLeadSubSourcesComponent,
          },
          {
            path: 'leadsubsource',
            canActivate: [AuthGuard],
            component: LeadSubSourceComponent,
          },
          {
            path: 'duplicate/leads',
            canActivate: [AuthGuard],
            component: DuplicateLeadsComponent,
          },
          {
            path: 'duplicatehistory/leads',
            // canActivate: [AuthGuard],
            component: DuplicateleadhistoryDisplayComponent,
          },
          {
            path: 'rolemanage/:Team',
            canActivate: [AuthGuard],
            component: RolemanageComponent,
            runGuardsAndResolvers: 'always',
          },

          {
            path: 'presalesteam/:Team',
            canActivate: [AuthGuard],
            component: UserteamanageComponent,
            runGuardsAndResolvers: 'always',
          },

          {
            path: 'total/leads',
            canActivate: [AuthGuard],
            component: DisplayAllLeadsComponent,
            runGuardsAndResolvers: 'always',
          },
          {
            path: 'unique/leads/:PST',
            canActivate: [AuthGuard],
            component: UniqueLeadsComponent,
          },
          // {
          //   path: 'rolemanage/:ST',
          //   component: RolemanageComponent,
          //   runGuardsAndResolvers: 'always',
          // },
          // {
          //   path: 'rolemanage/:PST',
          //   component: RolemanageComponent,
          //   runGuardsAndResolvers: 'always',
          // },
          {
            path: 'followups/:PST',
            canActivate: [AuthGuard],
            component: DisplayFollowupsComponent,
          },
          {
            path: 'followups/save/:PST',
            canActivate: [AuthGuard],
            component: LeadFollowupComponent,
          },
          {
            path: 'cp/register',
            canActivate: [AuthGuard],
            component: DisplayChannelPartnerComponent,
          },
          {
            path: 'displaycpdoc',
            canActivate: [AuthGuard],
            component: DisplayCpDocumentsComponent,
          },
          {
            path: 'cpregister',
            canActivate: [AuthGuard],
            component: ChannelPatnerRegisterComponent,
          },
          {
            path: 'dashboard/followups/PST',
            canActivate: [AuthGuard],
            component: DashboardFollowupsComponent,
          },
          {
            path: 'cp/approval/:ACP',
            canActivate: [AuthGuard],
            component: ChannelPartnerApprovalComponent,
          },
          {
            path: 'cp/approve',
            canActivate: [AuthGuard],
            component: ChannelPartnerApproveComponent,
          },
          {
            path: 'cp/users',
            canActivate: [AuthGuard],
            component: DisplayUserComponent,
          },
          {
            path: 'view/cp/approvals/:VCP',
            canActivate: [AuthGuard],
            component: ChannelPartnerApprovalComponent,
          },
          {
            path: 'update/registeredcp',
            canActivate: [AuthGuard],
            component: EditChannelPatnerApprovalComponent,
          },
          {
            path: 'lead/assign/:Type',
            component: ManualleadassignComponent,
          },
          {
            path: 'schedule/visit',
            canActivate: [AuthGuard],
            component: LeadScheduleVisitComponent,
          },
          {
            path: 'history',
            canActivate: [AuthGuard],
            component: LeadhistorypageComponent,
          },
          {
            path: 'salesteam',
            canActivate: [AuthGuard],
            component: SalesteamspageComponent,
          },
          {
            path: 'save/salesteam',
            canActivate: [AuthGuard],
            component: SalesteamsComponent,
          },
          {
            path: 'cp/dashboard',
            canActivate: [AuthGuard],
            component: ChannelPartnerDashBoardComponent,
          },
          {
            path: 'cp/cpdashboard',
            canActivate: [AuthGuard],
            component: CPDashBoardComponent,
          },
          {
            path: 'cp/table',
            canActivate: [AuthGuard],
            component: DashBoardComponent,
          },
          {
            path: 'chart',
            canActivate: [AuthGuard],
            component: ApexChartsComponent,
          },
          {
            path: 'expiringleads/:PST',
            canActivate: [AuthGuard],
            component: DisplayExpiringLeadsComponent,
          },
          {
            path: 'digitalleads',
            canActivate: [AuthGuard],
            component: DigitalLeadsComponent,
          },
          {
            path: 'cpleads',
            canActivate: [AuthGuard],
            component: DisplayCpLeadsComponent,
          },
          {
            path: 'cp/terms-and-conditions',
            canActivate: [AuthGuard],
            component: CpTermsAndConditionsComponent,
          },
          {
            path: 'cp/invoice',
            canActivate: [AuthGuard],
            component: CpInvoiceComponent,
          },
        ],
      },

      {
        path: 'employee',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'displayemployee',
            canActivate: [AuthGuard],
            component: DisplayEmployeeComponent,
          },
          {
            path: 'displayemployee/Res',
            canActivate: [AuthGuard],
            component: DisplayResignedEmployeeComponent,
          },

          {
            path: 'addemployee',
            canActivate: [AuthGuard],
            component: EmployeeComponent,
          },
          {
            path: 'displayemployeebankingdetails',
            canActivate: [AuthGuard],
            component: DisplayemployeebankdetailsComponent,
          },

          {
            path: 'addemployeebankingdetails',
            canActivate: [AuthGuard],
            component: EmployeebankdetailsComponent,
          },

          {
            path: 'displayassets',
            canActivate: [AuthGuard],
            component: DisplayassetsComponent,
          },

          {
            path: 'addassets',
            canActivate: [AuthGuard],
            component: AssetsComponent,
          },
          {
            path: 'displayassetallocation',
            canActivate: [AuthGuard],
            component: DisplayAssetAllocationComponent,
          },

          {
            path: 'addassetallocation',
            canActivate: [AuthGuard],
            component: AssetAllocationComponent,
          },

          {
            path: 'hrdashboard',
            canActivate: [AuthGuard],
            component: HRdashboardComponent,
          },

          {
            path: 'employeeformstage',
            canActivate: [AuthGuard],
            component: EmployeeformstagesComponent,
          },

          {
            path: 'approveemployee',
            canActivate: [AuthGuard],
            component: EmployeeDetailsApproveComponent,
          },
        ],
      },

      {
        path: 'facility/management',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'displayqrgenerator',
            canActivate: [AuthGuard],
            component: DisplayqrgeneratorComponent,
          },
          {
            path: 'qrgenerator',
            canActivate: [AuthGuard],
            component: AddQrgeneratorComponent,
          },

          {
            path: 'displayqrtransaction',
            canActivate: [AuthGuard],
            component: DisplayqrtransactiondataComponent,
          },
          { path: 'customer', component: DisplaycustomerComponent },
          { path: 'addcustomer', component: AddCustomerComponent },
          { path: 'addissues', component: AddIssuesComponent },
          { path: 'issues', component: DisplayissuesComponent },
          {
            path: 'issueapproval',
            canActivate: [AuthGuard],
            component: DisplayIssueApprovalsComponent,
          },
          {
            path: 'displayqrtransaction',
            component: DisplayqrtransactiondataComponent,
          },
          { path: 'reassignissuetype', component: ReAssignIssueTypeComponent },
          {
            path: 'displayqrtransaction',
            component: DisplayqrtransactiondataComponent,
          },
          { path: 'qrtransaction', component: AddQrtransactiondataComponent },
          {
            path: 'displaysecuritypatrol',
            component: DisplaysecuritypatrolComponent,
          },
          {
            path: 'displaysecurityreport',
            component: DisplaysecurityreportComponent,
          },

          {
            path: 'clientinvoicereport',
            component: DisplayclientinvoicereportComponent,
          },
          {
            path: 'addClientinvoicereport',
            component: AddclientinvoicereportComponent,
          },
          { path: 'securitypatrol', component: AddSecuritypatrolComponent },
          { path: 'reports', component: DisplayreportsComponent },
          { path: 'taxinvoice', component: DisplayinvoiceComponent },
          { path: 'addtaxinvoice', component: AddInvoiceComponent },
          {
            path: 'displayconsumption',
            component: DisplaycustomerconsumptionComponent,
          },
          { path: 'consumption', component: AddCustomerconsumptionComponent },

          {
            path: 'ajnaconsumpton',
            component: DisplayClientcustomerconsumptionComponent,
          },

          {
            path: 'addclientinvoicereport',
            component: AddclientinvoicereportComponent,
          },

          {
            path: 'displayclientinvoicereport',
            component: DisplayclientinvoicereportComponent,
          },

          {
            path: 'addajnaconsumption',
            component: AddClientCustomerconsumptionComponent,
          },
          {
            path: 'editreassignIssueType',
            component: EditReasignIssueTypeComponent,
          },
          // { path: 'organizationchart', component: OrganizationChartComponent },
          {
            path: 'editreassignIssueType',
            component: EditReasignIssueTypeComponent,
          },

          {
            path: 'displayqrtransaction',
            component: DisplayqrtransactiondataComponent,
          },
          { path: 'qrtransaction', component: AddQrtransactiondataComponent },
          {
            path: 'displaysecuritypatrol',
            component: DisplaysecuritypatrolComponent,
          },
          { path: 'securitypatrol', component: AddSecuritypatrolComponent },
          { path: 'reports', component: DisplayreportsComponent },
          { path: 'taxinvoice', component: DisplayinvoiceComponent },
          { path: 'addtaxinvoice', component: AddInvoiceComponent },
          {
            path: 'displayconsumption',
            component: DisplaycustomerconsumptionComponent,
          },
          { path: 'consumption', component: AddCustomerconsumptionComponent },
          { path: 'issuedashboard', component: IssueDashboardComponent },
          //   { path: 'organizationchart', component: OrganizationChartComponent },

          {
            path: 'displayqrtransaction',

            canActivate: [AuthGuard],
            component: DisplayqrtransactiondataComponent,
          },
          {
            path: 'qrtransaction',
            canActivate: [AuthGuard],
            component: AddQrtransactiondataComponent,
          },
          {
            path: 'displaysecuritypatrol',
            canActivate: [AuthGuard],
            component: DisplaysecuritypatrolComponent,
          },
          {
            path: 'securitypatrol',
            canActivate: [AuthGuard],
            component: AddSecuritypatrolComponent,
          },
          {
            path: 'reports',
            canActivate: [AuthGuard],
            component: DisplayreportsComponent,
          },
          {
            path: 'taxinvoice',
            canActivate: [AuthGuard],
            component: DisplayinvoiceComponent,
          },
          {
            path: 'addtaxinvoice',
            canActivate: [AuthGuard],
            component: AddInvoiceComponent,
          },
          {
            path: 'displayconsumption',
            canActivate: [AuthGuard],
            component: DisplaycustomerconsumptionComponent,
          },
          {
            path: 'consumption',
            canActivate: [AuthGuard],
            component: AddCustomerconsumptionComponent,
          },

          {
            path: 'displayqrtransaction',
            canActivate: [AuthGuard],
            component: DisplayqrtransactiondataComponent,
          },
          {
            path: 'qrtransaction',
            canActivate: [AuthGuard],
            component: AddQrtransactiondataComponent,
          },
          {
            path: 'displaysecuritypatrol',
            canActivate: [AuthGuard],
            component: DisplaysecuritypatrolComponent,
          },
          {
            path: 'securitypatrol',
            canActivate: [AuthGuard],
            component: AddSecuritypatrolComponent,
          },
          {
            path: 'reports',
            canActivate: [AuthGuard],
            component: DisplayreportsComponent,
          },
          {
            path: 'taxinvoice',
            canActivate: [AuthGuard],
            component: DisplayinvoiceComponent,
          },
          {
            path: 'addtaxinvoice',
            canActivate: [AuthGuard],
            component: AddInvoiceComponent,
          },
          {
            path: 'displayconsumption',
            canActivate: [AuthGuard],
            component: DisplaycustomerconsumptionComponent,
          },
          {
            path: 'consumption',
            canActivate: [AuthGuard],
            component: AddCustomerconsumptionComponent,
          },
          {
            path: 'displayconsumption',
            canActivate: [AuthGuard],
            component: DisplaycustomerconsumptionComponent,
          },
          {
            path: 'consumption',
            canActivate: [AuthGuard],
            component: AddCustomerconsumptionComponent,
          },

          {
            path: 'customer',
            canActivate: [AuthGuard],
            component: DisplaycustomerComponent,
          },
          {
            path: 'addcustomer',
            canActivate: [AuthGuard],
            component: AddCustomerComponent,
          },
          {
            path: 'addissues',
            canActivate: [AuthGuard],
            component: AddIssuesComponent,
          },
          {
            path: 'issues',
            canActivate: [AuthGuard],
            component: DisplayissuesComponent,
          },
          {
            path: 'issueapproval',
            canActivate: [AuthGuard],
            component: DisplayIssueApprovalsComponent,
          },

          {
            path: 'displaysecuritypatrol',
            canActivate: [AuthGuard],
            component: DisplaysecuritypatrolComponent,
          },
          {
            path: 'securitypatrol',
            canActivate: [AuthGuard],
            component: AddSecuritypatrolComponent,
          },
          {
            path: 'reports',
            canActivate: [AuthGuard],
            component: DisplayreportsComponent,
          },
          {
            path: 'customerinvoices',
            canActivate: [AuthGuard],
            component: DisplayCustomerInvoicesComponent,
          },
          {
            path: 'displaycilentserviceConfig',
            canActivate: [AuthGuard],
            component: DisplayClientServiceConfigComponent,
          },
          {
            path: 'cilentserviceConfig',
            canActivate: [AuthGuard],
            component: ClientServiceConfigComponent,
          },
          {
            path: 'client',
            canActivate: [AuthGuard],
            component: DisplayclientComponent,
          },
          {
            path: 'addclient',
            canActivate: [AuthGuard],
            component: AddclientComponent,
          },
          {
            path: 'usermanage/:Team',
            canActivate: [AuthGuard],
            component: UserteamanageComponent,
            runGuardsAndResolvers: 'always',
          },
          {
            path: 'displaylogentry',
            canActivate: [AuthGuard],
            component: Displaylogentry,
          },
          {
            path: 'feildofficerpatrol',
            canActivate: [AuthGuard],
            component: DisplayFeildofficerpatrolComponent,
          },
        ],
      },
      {
        path: 'organizations',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'organization',
            canActivate: [AuthGuard],
            component: DisplayOrganizationComponent,
          },
          {
            path: 'addorganization',
            canActivate: [AuthGuard],
            component: OrganizationComponent,
          },
        ],
      },
      {
        path: 'sales',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'leads/:ST',
            canActivate: [AuthGuard],
            component: DisplayLeadsComponent,
          },
          {
            path: 'unique/leads/:ST',
            canActivate: [AuthGuard],
            component: UniqueLeadsComponent,
          },
          {
            path: 'all/leads',
            canActivate: [AuthGuard],
            component: AllLeadsComponent,
          },
          {
            path: 'savelead/:ST',
            canActivate: [AuthGuard],
            component: AddLeadComponent,
          },
          {
            path: 'dashboard/followups/:ST',
            canActivate: [AuthGuard],
            component: DashboardFollowupsComponent,
          },
          {
            path: 'followups/:ST',
            component: DisplayFollowupsComponent,
          },
          {
            path: 'followups/save/:ST',
            canActivate: [AuthGuard],
            component: LeadFollowupComponent,
          },
          {
            path: 'schedule/visits/:ST',
            canActivate: [AuthGuard],
            component: DisplayScheduleVisitComponent,
          },
          {
            path: 'schedule/visit',
            canActivate: [AuthGuard],
            component: LeadScheduleVisitComponent,
          },
          {
            path: 'expiringleads/:ST',
            canActivate: [AuthGuard],
            component: DisplayExpiringLeadsComponent,
          },
          {
            path: 'eoi',
            canActivate: [AuthGuard],
            component: DisplayEoiComponent,
          },
          {
            path: 'addEoi',
            canActivate: [AuthGuard],
            component: EoiComponent,
          },
          {
            path: 'salesteam/:Team',
            canActivate: [AuthGuard],
            component: UserteamanageComponent,
            runGuardsAndResolvers: 'always',
          },
        ],
      },

      //work order routing
      {
        path: 'workorder',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'addprimeactivitycode',
            canActivate: [AuthGuard],
            component: AddPrimeActivityCode,
          },
          {
            path: 'addsaccode',
            canActivate: [AuthGuard],
            component: SacCodeComponent,
          },
          {
            path: 'addworkorderheader',
            canActivate: [AuthGuard],
            component: WorkOrderHeaderComponent,
          },
          {
            path: 'documents',
            canActivate: [AuthGuard],
            component: DocumentComponent,
          },
          {
            path: 'displayprimeactivitycode',
            canActivate: [AuthGuard],
            component: DisplayPrimeActivityCodeComponent,
          },
          {
            path: 'displaysaccode',
            canActivate: [AuthGuard],
            component: DisplaySacCodeComponent,
          },
          {
            path: 'displayworkorderheader',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderHeaderComponent,
          },
          // {
          //   path: 'addheader',
          //   canActivate: [AuthGuard],
          //   component: AddHeaderComponent,
          // },

          {
            path: 'addwoquantity',
            canActivate: [AuthGuard],
            component: AddWoQuantityComponent,
          },

          {
            path: 'addworkordercreation',
            canActivate: [AuthGuard],
            component: AddWorkOrderCreation,
          },

          {
            path: 'addandeditworkorderheader',
            canActivate: [AuthGuard],
            component: AddWoHeaderComponent,
          },
          {
            path: 'addandeditworkorderheadercreation',
            canActivate: [AuthGuard],
            component: AddWorkOrderHeaderCreationComponent,
          },

          {
            path: 'addandeditworkordercreation',
            canActivate: [AuthGuard],
            component: AddAndEditWorkOrderCreation,
          },

          {
            path: 'addworkorderbilling',
            canActivate: [AuthGuard],
            component: AddWorkOrderBilling,
          },
          {
            path: 'work/order/billng/:status',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderBillingComponent,
          },
          {
            path: 'addservicegroup',
            canActivate: [AuthGuard],
            component: AddServiceGroup,
          },

          {
            path: 'addservicecode',
            canActivate: [AuthGuard],
            component: AddServiceCode,
          },
          {
            path: 'displayservicegroup',
            canActivate: [AuthGuard],
            component: DisplayServiceGroupComponent,
          },

          {
            path: 'displayservicecode',
            canActivate: [AuthGuard],
            component: DisplayServiceCodeComponent,
          },
          {
            path: 'vendor',
            canActivate: [AuthGuard],
            component: DisplayvendorComponent,
          },
          {
            path: 'addvendor',
            canActivate: [AuthGuard],
            component: AddvendorComponent,
          },
          {
            path: 'standinuser',
            canActivate: [AuthGuard],
            component: DisplayStandInUserComponent,
          },
          {
            path: 'addstandinuser',
            canActivate: [AuthGuard],
            component: AddStandInUser,
          },
          {
            path: 'wo/:status',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderApprovalComponent,
          },
          {
            path: 'work/order/:status',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderCreationComponent,
          },
          {
            path: 'view/approvals',
            canActivate: [AuthGuard],
            component: WorkOrderApprovalComponent,
          },
          {
            path: 'view/wo/details',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderDetailsComponent,
          },
          {
            path: 'view/wo/billing/details',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderBillingDetailsComponent,
          },
          {
            path: 'billing/view/approvals',
            canActivate: [AuthGuard],
            component: WorkOrderBillingApprovalComponent,
          },
          {
            path: 'wo/billings/:check',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderBillingApprovalComponent,
          },

          {
            path: 'billings/:status',
            canActivate: [AuthGuard],
            component: DisplayWorkOrderBillingComponent,
          },
        ],
      },

      //work order routing ended

      //procurement routing starts
      {
        path: 'procurement',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          //indents routing
          {
            path: 'indent',
            canActivate: [AuthGuard],
            component: DisplayindentComponent,
          },
          {
            path: 'addindent',
            canActivate: [AuthGuard],
            component: AddIndentComponent,
          },
          {
            path: 'indent-details',
            canActivate: [AuthGuard],
            component: IndentDetailsComponent,
          },

          {
            path: 'viewindent',
            canActivate: [AuthGuard],
            component: ViewIndentComponent,
          },

          {
            path: 'approval',
            canActivate: [AuthGuard],
            component: DisplayapprovalsComponent,
          },
          {
            path: 'app/rej/rework/Indents',
            canActivate: [AuthGuard],
            component: DisplayNonPendingIndentComponent,
          },
          {
            path: 'displayaccountentry',
            canActivate: [AuthGuard],
            component: DisplayAccountEntryComponent,
          },

          {
            path: 'addaccountEntry',
            canActivate: [AuthGuard],
            component: AddAccountEntryComponent,
          },
          {
            path: 'quotation',
            canActivate: [AuthGuard],
            component: DisplayquotationComponent,
          },
          {
            path: 'pending/quotation',
            canActivate: [AuthGuard],
            component: DisplayApprovalQuotationComponent,
          },

          {
            path: 'quotations',
            canActivate: [AuthGuard],
            component: DisplayApproveRejReworkQuotationComponent,
          },

          {
            path: 'item/category',
            canActivate: [AuthGuard],
            component: ItemCategoriesComponent,
          },

          {
            path: 'itemcategory',
            canActivate: [AuthGuard],
            component: AddItemCategoryComponent,
          },
          {
            path: 'configuration',
            canActivate: [AuthGuard],
            component: ConfigurationTabsComponent,
          },

          {
            path: 'additemcategory',
            canActivate: [AuthGuard],
            component: AddItemCategoryComponent,
          },
          {
            path: 'item/subcategory',
            canActivate: [AuthGuard],
            component: DisplayItemSubCategoryComponent,
          },
          {
            path: 'itemsubcategory',
            canActivate: [AuthGuard],
            component: AddItemSubCategoryComponent,
          },

          {
            path: 'approval',
            canActivate: [AuthGuard],
            component: DisplayapprovalsComponent,
          },

          {
            path: 'aprove/rejected/indents',
            canActivate: [AuthGuard],
            component: DisplayIndentApprovalsComponent,
          },

          {
            path: 'approvaldetails',
            canActivate: [AuthGuard],
            component: ApprovalsComponent,
          },
          {
            path: 'addquotation',
            canActivate: [AuthGuard],
            component: AddQuotationComponent,
          },
          {
            path: 'quotation',
            canActivate: [AuthGuard],
            component: DisplayquotationComponent,
          },
          {
            path: 'viewquotation',
            canActivate: [AuthGuard],
            component: CreateQuotationComponent,
          },
          {
            path: 'app/rej/rework/quotation',
            canActivate: [AuthGuard],
            component: DisplayNonPendingQuotationComponent,
          },
          {
            path: 'createquotation',
            canActivate: [AuthGuard],
            component: CreateQuotationsComponent,
          },

          {
            path: 'approved/rej/rework/po',
            canActivate: [AuthGuard],
            component: DisplayNonPendingPurchaseOrderComponent,
          },

          {
            path: 'pending/purchase/order',
            canActivate: [AuthGuard],
            component: DisplayApprovalPurchaseOrderComponent,
          },

          {
            path: 'app/rej/rework/purchase/order',
            canActivate: [AuthGuard],
            component: DisplayApproveRejReworkPurchaseOrderComponent,
          },

          {
            path: 'itemspecification',
            canActivate: [AuthGuard],
            component: AddItemSpecificationComponent,
          },

          {
            path: 'item/specification',
            canActivate: [AuthGuard],
            component: DisplayItemSpecificationComponent,
          },

          {
            path: 'item/unit',
            canActivate: [AuthGuard],
            component: DisplayitemUnitComponent,
          },
          {
            path: 'itemunit',
            canActivate: [AuthGuard],
            component: AddItemUnitComponent,
          },
          {
            path: 'store',
            canActivate: [AuthGuard],
            component: DisplayStoreComponent,
          },
          {
            path: 'display/po',
            canActivate: [AuthGuard],
            component: DisplyPurchaseOrderComponent,
          },

          {
            path: 'display/purchase/order',
            canActivate: [AuthGuard],
            component: DisplayApprovedQuotationComponent,
          },
          {
            path: 'purchase/order',
            canActivate: [AuthGuard],
            component: PurchaseOrderComponent,
          },
          {
            path: 'view/purchase/order',
            canActivate: [AuthGuard],
            component: ViewPurchaseOrderComponent,
          },
          {
            path: 'addgoodsreceived',
            canActivate: [AuthGuard],
            component: AddInventoryReceivable,
          },

          {
            path: 'goodsreceived',
            canActivate: [AuthGuard],
            component: DisplayIRComponent,
          },
          {
            path: 'goodsreceived/items',
            canActivate: [AuthGuard],
            component: DisplayInventoryReceivableComponent,
          },

          {
            path: 'view/goodsreceived/items',
            canActivate: [AuthGuard],
            component: ViewInventoryReceivableComponent,
          },

          {
            path: 'pending/ir',
            canActivate: [AuthGuard],
            component: PendingInventoryReceivableComponent,
          },
          {
            path: 'app/rej/ir',
            canActivate: [AuthGuard],
            component: AppRejInventoryReceivableComponent,
          },

          {
            path: 'goodsedit',
            canActivate: [AuthGuard],
            component: EditInventoryReceivablesComponent,
          },
          {
            path: 'goodsreceived/pendingapproval',
            canActivate: [AuthGuard],
            component: InventoryReceivablePendingApprovalComponent,
          },
          {
            path: 'goodsreceived/nonpendingapproval',
            canActivate: [AuthGuard],
            component: InventoryReceivableNonPendingApprovalComponent,
          },
          {
            path: 'inventorytransfers',
            canActivate: [AuthGuard],
            component: DisplayInventoryTransferComponent,
          },
          {
            path: 'inventorytransfer',
            canActivate: [AuthGuard],
            component: InventoryTransferComponent,
          },

          {
            path: 'storeinventory',
            canActivate: [AuthGuard],
            component: DisplayStoreInventoryComponent,
          },

          {
            path: 'addstoreinventory',
            canActivate: [AuthGuard],
            component: AddstoreinventoryComponent,
          },
        ],
      },

      //procurement routing ends
      {
        path: 'workflowtypes',
        canActivate: [AuthGuard],
        component: DisplayWorkflowTypesComponent,
      },
      {
        path: 'addworkflowtype',
        canActivate: [AuthGuard],
        component: AddWorkflowtypeComponent,
      },
      {
        path: 'workflowstages',
        canActivate: [AuthGuard],
        component: DisplayworkflowstageComponent,
      },
      {
        path: 'addworkflowstage',
        canActivate: [AuthGuard],
        component: AddWorkflowstageComponent,
      },

      {
        path: 'home',
        canActivate: [AuthGuard],
        component: HomeComponent,
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        component: DisplayUserComponent,
      },
      {
        path: 'adduser',
        canActivate: [AuthGuard],
        component: AddUserComponent,
      },
      {
        path: 'additionalshift',
        canActivate: [AuthGuard],
        component: AddAdditionalShiftComponent,
      },
      {
        path: 'displayAdditionalShift',
        canActivate: [AuthGuard],
        component: DisplayAdditionalShiftComponent,
      },
      {
        path: 'holiday',
        canActivate: [AuthGuard],
        component: DisplayHolidayComponent,
      },
      {
        path: 'addholiday',
        canActivate: [AuthGuard],
        component: HolidayComponent,
      },
      {
        path: 'commonreferencetype',
        canActivate: [AuthGuard],
        component: DisplayCommonReferenceTypeComponent,
      },
      {
        path: 'addcommonreferencetype',
        canActivate: [AuthGuard],
        component: CommonReferenceTypeComponent,
      },
      {
        path: 'displayrolereferencepermission',
        canActivate: [AuthGuard],
        component: DisplayRoleReferencePermissionComponent,
      },
      {
        path: 'addrolereferencepermission',
        canActivate: [AuthGuard],
        component: RoleReferencePermissionComponent,
      },
      {
        path: 'addcommonreferencedetails',
        canActivate: [AuthGuard],
        component: CommonreferenceDetailsComponent,
      },
      {
        path: 'commonreferencedetails',
        canActivate: [AuthGuard],
        component: DisplaycommonreferencedetailsComponent,
      },

      {
        path: 'leaverequest',
        canActivate: [AuthGuard],
        component: DisplayLeaveRequestComponent,
      },
      {
        path: 'addleaverequest',
        canActivate: [AuthGuard],
        component: LeaveRequestComponent,
      },
      {
        path: 'teamleaverequest',
        canActivate: [AuthGuard],
        component: DisplayTeamLeavesComponent,
      },
      {
        path: 'addteamleaverequest',
        canActivate: [AuthGuard],
        component: AddTeamLeavesComponent,
      },
      {
        path: 'weekoff',
        canActivate: [AuthGuard],
        component: DisplayWeekOffComponent,
      },
      {
        path: 'addweekoff',
        canActivate: [AuthGuard],
        component: AddWeekOffComponent,
      },
      {
        path: 'teamweekoff',
        canActivate: [AuthGuard],
        component: DisplayTeamWeekOffComponent,
      },
      {
        path: 'addteamweekoff',
        canActivate: [AuthGuard],
        component: AddTeamWeekoffComponent,
      },
      {
        path: 'reports',
        canActivate: [AuthGuard],
        component: ShowReportsComponent,
      },
      {
        path: 'reports/add',
        canActivate: [AuthGuard],
        component: ReportsComponent,
      },
      {
        path: 'report/fields',
        canActivate: [AuthGuard],
        component: DisplayreportFieldComponent,
      },
      {
        path: 'report/field/add',
        canActivate: [AuthGuard],
        component: ReportFieldComponent,
      },
      {
        path: 'excel/mappings',
        canActivate: [AuthGuard],
        component: DisplayExcelMappingsComponent,
      },
      {
        path: 'excel/mapping/add',
        canActivate: [AuthGuard],
        component: ExcelMappingComponent,
      },
      {
        path: 'project/addbooking',
        canActivate: [AuthGuard],
        component: AddBookingComponent,
      },
      {
        path: 'project/blockunit',
        canActivate: [AuthGuard],
        component: BlockUnitComponent,
      },
      {
        path: 'project/displaybooking',
        canActivate: [AuthGuard],
        component: BookingLeadComponent,
      },
      {
        path: 'project/availableunits',
        canActivate: [AuthGuard],
        component: AvailableUnitsComponent,
      },
      {
        path: 'digitalmarketing',
        canActivate: [AuthGuard],
        component: DigitalmarketingdashboardComponent,
      },
      {
        path: 'walk_in/leads',
        canActivate: [AuthGuard],
        component: WalkInLeadsComponent,
      },
      {
        path: 'userteammanage/:Team',
        canActivate: [AuthGuard],
        component: UserteamanageComponent,
      },
      {
        path: 'display/site/visit',
        canActivate: [AuthGuard],
        component: SiteVisitComponent,
      },
      {
        path: 'gre/siteform',
        canActivate: [AuthGuard],
        component: GreFormComponent,
      },
      {
        path: 'search/lead',
        canActivate: [AuthGuard],
        component: SearchLeadsComponent,
      },

      {
        path: 'displayteammates',
        canActivate: [AuthGuard],
        component: DisplayTeamMatesComponent,
      },
      {
        path: 'cloneUser',
        canActivate: [AuthGuard],
        component: CloneuserComponent,
      },
      {
        path: 'lead/transfer/approvals',
        canActivate: [AuthGuard],
        component: LeadTransferApprovalsComponent,
      },
      // {
      //   path: 'salesheaddashboard',
      //   canActivate: [AuthGuard],
      //   component: SaleHeadDashboardV1Component,
      // },

      {
        path: 'salesheaddashboard',
        canActivate: [AuthGuard],
        component: SaleHeadDashboardV1Component,
      },
      {
        path: 'memberdashboard',
        canActivate: [AuthGuard],
        component: MemberDashboardV1Component,
      },
      {
        path: 'mangerdashboard',
        canActivate: [AuthGuard],
        component: Managerdashboardv1Component,
      },
      {
        path: 'cpdashboard',
        canActivate: [AuthGuard],
        component: CpDashboardV1Component,
      },
      {
        path: 'ctodashboard',
        canActivate: [AuthGuard],
        component: CtoDashBoardComponent,
      },

      {
        path: 'legalcustomerdocument',
        component: CustomerLegalDocumentPageComponent,
      },
      {
        path: 'savelegalcustomerdocument',
        component: LegalCustomerDocumnetComponent,
      },
      {
        path: 'globaldashboard',
        canActivate: [AuthGuard],
        component: GlobalDashboardComponent,
      },
      {
        path: 'crm',
        canActivate: [AuthGuard],
        component: PlainComponent,
        children: [
          {
            path: 'salesaggrementtemplate',
            canActivate: [AuthGuard],
            component: AddsalesaggrementtemplateComponent,
          },
          {
            path: 'displaysalesaggrementtemplate',
            canActivate: [AuthGuard],
            component: DisplaysalesaggrementtemplateComponent,
          },
          {
            path: 'addsalesaggrementtemplatefields',
            canActivate: [AuthGuard],
            component: AddsaleaggrementtemplatefieldsComponent,
          },
          {
            path: 'generatesalesaggrement',
            canActivate: [AuthGuard],
            component: GeneratesalesaggrementComponent,
          },
          {
            path: 'booking',
            canActivate: [AuthGuard],
            component: BookingFormComponent,
          },
          {
            path: 'displayBooking',
            canActivate: [AuthGuard],
            component: DisplayBookingFormComponent,
          },

          {
            path: 'displayBookingCharges',
            canActivate: [AuthGuard],
            component: DisplayBookingChargesComponent,
          },
          {
            path: 'displayCustomerStages',
            canActivate: [AuthGuard],
            component: DisplayCustomerStagesComponent,
          },
          {
            path: 'displayBookingOverview',
            canActivate: [AuthGuard],
            component: DisplayBookingOverviewComponent,
          },

          {
            path: 'saveBookingCharges',
            canActivate: [AuthGuard],
            component: SaveBookingChargeComponent,
          },
          {
            path: 'addStage',
            canActivate: [AuthGuard],
            component: AddStageComponent,
          },
          {
            path: 'displayPaymentPlan',
            canActivate: [AuthGuard],
            component: DisplayPaymentPlanComponent,
          },
          {
            path: 'paymentPlan',
            canActivate: [AuthGuard],
            component: PaymentPlanComponent,
          },
          {
            path: 'charges',
            canActivate: [AuthGuard],
            component: DisplayProjectChargeComponent,
          },
          {
            path: 'addcharges',
            canActivate: [AuthGuard],
            component: ProjectChargeComponent,
          },
          {
            path: 'addpaymentdetails',
            canActivate: [AuthGuard],
            component: PaymentDetailsComponent,
          },
          {
            path: 'paymentdetails',
            canActivate: [AuthGuard],
            component: DisplayPaymentDetailsComponent,
          },
          {
            path: 'customerpayment',
            canActivate: [AuthGuard],
            component: DisplayCustomerPaymentComponent,
          },
          {
            path: 'addcustomerpayment',
            canActivate: [AuthGuard],
            component: CustomerPaymentComponent,
          },

          {
            path: 'customerpaymentapproval',
            canActivate: [AuthGuard],
            component: CustomerApprovalPaymentComponent,
          },
          {
            path: 'customerdashboard',
            canActivate: [AuthGuard],
            component: CustomerDashboardComponent,
          },
          {
            path: 'customerstagesdisplay',
            canActivate: [AuthGuard],
            component: CustomerstagesdisplayComponent,
          },
          {
            path: 'customerdocumentsdisplay',
            canActivate: [AuthGuard],
            component: CustomerdocumentdisplayComponent,
          },
          {
            path: 'addingcrmpayment',
            canActivate: [AuthGuard],
            component: AddingPaymentComponent,
          },
          {
            path: 'addingtds',
            canActivate: [AuthGuard],
            component: AddingTdsComponent,
          },
          {
            path: 'soadocuments',
            canActivate: [AuthGuard],
            component: SoaDocumentsComponent,
          },
          {
            path: 'assigncrm',
            canActivate: [AuthGuard],
            component: AssignApplicantsToCrmmembersComponent,
          },
          {
            path: 'bookingformapproval',
            canActivate: [AuthGuard],
            component: BookingformApprovalComponent,
          },
          {
            path: 'saleagreementapproval',
            canActivate: [AuthGuard],
            component: SaleAgreementApprovalComponent,
          },
          {
            path: 'approvedsaleagreements',
            canActivate: [AuthGuard],
            component: DisplayApprovedSaleagreementsComponent,
          },
          {
            path: 'paymentledger',
            canActivate: [AuthGuard],
            component: DisplayPaymentLedgerComponent,
          },
          {
            path: 'displaysaleagreement',
            canActivate: [AuthGuard],
            component: DisplaySaleAgreementComponent,
          },
          {
            path: 'bookingformaddpayment',
            canActivate: [AuthGuard],
            component: BookingFormAddingPaymentComponent,
          },
          {
            path: 'followup',
            canActivate: [AuthGuard],
            component: CRMFollowupComponent,
          },
          {
            path: 'cancelbookingapproval',
            canActivate: [AuthGuard],
            component: CancelBookingApprovalComponent,
          },
          {
            path: 'crmreports',
            canActivate: [AuthGuard],
            component: MagnusReportComponent,
          },
        ],
      },
    ],
  },

  {
    path: 'custlayout',
    canActivate: [AuthGuard],
    component: CustomerlayoutComponent,
    children: [
      {
        path: '',
        component: CustomerDashboardComponent,
      },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'customerdashboard',
        canActivate: [AuthGuard],
        component: CustomerDashboardComponent,
      },
      {
        path: 'customerunitsdisplay',
        canActivate: [AuthGuard],
        component: CustomerunitsdisplayComponent,
      },
      {
        path: 'customerstagesdisplay',
        canActivate: [AuthGuard],
        component: CustomerstagesdisplayComponent,
      },
      {
        path: 'customerpayment',
        canActivate: [AuthGuard],
        component: DisplayCustomerPaymentComponent,
      },
      {
        path: 'addcustomerpayment',
        canActivate: [AuthGuard],
        component: CustomerPaymentComponent,
      },
      {
        path: 'displaydocuments',
        canActivate: [AuthGuard],
        component: DisplaydocumentsComponent,
      },
      {
        path: 'customer/lead',
        canActivate: [AuthGuard],
        component: CustomerLeadPageComponent,
      },
      {
        path: 'save/customer/lead',
        canActivate: [AuthGuard],
        component: CustomerLeadComponent,
      },
    ],
  },

  { path: '', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
