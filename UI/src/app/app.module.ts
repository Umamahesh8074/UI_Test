import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgChartsModule } from 'ng2-charts';
import { AddSecuritypatrolComponent } from './Components/FacilityManagement/Securitypatrol/securitypatrol/Securitypatrol.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//Modules imports
import { AddWorkflowtypeComponent } from './Components/Workflow/WorkflowType/add-workflowtype/add-workflowtype.component';
import { DisplayWorkflowTypesComponent } from './Components/Workflow/WorkflowType/display-workflow-types/display-workflow-types.component';
// Common Components
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ApproveDialogComponent } from './Comman-Components/Dialog/approvaldialog/approvedialog.component';
import { ConfirmdialogComponent } from './Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { HomeComponent } from './Comman-Components/Homepage/home/home.component';
import { LoginComponent } from './Comman-Components/Login/login/login.component';
import { NavBarComponent } from './Comman-Components/Navbar/nav-bar/nav-bar.component';
import { PlainComponent } from './Comman-Components/Plain/plain/plain.component';
import { ProfileComponent } from './Comman-Components/Profile/profile.component';
import { DisplayExcelMappingsComponent } from './Components/Admin/ExcelMappings/display-excel-mappings/display-excel-mappings.component';
import { ExcelMappingComponent } from './Components/Admin/ExcelMappings/excel-mapping/excel-mapping.component';
import { ShowLeadsReportComponent } from './Components/Admin/Lead-Reports/show-leads-report/show-leads-report.component';
import { DisplayreportFieldComponent } from './Components/Admin/ReportFields/display-report-field/display-report-field.component';
import { ReportFieldComponent } from './Components/Admin/ReportFields/report-field/report-field.component';
import { ReportsComponent } from './Components/Admin/Reports/reports/reports.component';
import { ShowReportsComponent } from './Components/Admin/Reports/show-reports/show-reports.component';
import { AddCustomerComponent } from './Components/FacilityManagement/Customer/customer/Customer.component';
import { DisplaycustomerComponent } from './Components/FacilityManagement/Customer/display-customer/display-customer.component';
import { AddCustomerconsumptionComponent } from './Components/FacilityManagement/Customerconsumption/customerconsumption/customerconsumption.component';
import { DisplaycustomerconsumptionComponent } from './Components/FacilityManagement/Customerconsumption/display-customerconsumption/display-customerconsumption.component';
import { DisplayinvoiceComponent } from './Components/FacilityManagement/Invoice/display-invoice/display-Invoice.component';
import { AddInvoiceComponent } from './Components/FacilityManagement/Invoice/invoice/Invoice.component';
import { DisplaysecuritypatrolComponent } from './Components/FacilityManagement/Securitypatrol/display-securitypatrol/display-Securitypatrol.component';
import { ManualleadassignComponent } from './Components/Presales/manualleadassign/manualleadassign.component';
import { DisplyPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-purchaseorder/display-purchaseorder.component';
import { PurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/purchaseorder/purchaseorder.component';
import { ViewPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/view-purchaseorder/view-purchaseorder.component';
import { AddQuotationComponent } from './Components/Procurement/Quotation/add-quotation/add-quotation.component';
import { CreateQuotationComponent } from './Components/Procurement/Quotation/create-quotation/create-quotation.component';
import { DisplayquotationComponent } from './Components/Procurement/Quotation/display-quotation/display-quotation.component';
import { UsermanageComponent } from './Components/User/UserManage/usermanage/usermanage.component';
import { UserteamanageComponent } from './Components/User/UserManage/userteamanage/userteamanage.component';
import { DisplayIssueApprovalsComponent } from './Components/Issues/Approvals/display-approvals/display-approvals.component';
import { IssueApprovalComponent } from './Components/Issues/Approvals/issue-approval/issue-approval.component';
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

import { OrgchartModule } from '@dabeng/ng-orgchart';
import { AgGridModule } from 'ag-grid-angular';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ToastrModule } from 'ngx-toastr';
import { ApexChartsComponent } from './Comman-Components/Reusable-Components/apex-charts/apex-charts.component';
import { CPDashBoardComponent } from './Comman-Components/Reusable-Components/cpdash-board/cpdash-board.component';
import { DashBoardComponent } from './Comman-Components/Reusable-Components/dash-board/dash-board.component';
import { ReusableTableComponent } from './Comman-Components/Reusable-Components/reusable-table/reusable-table.component';
import { ErrorPageComponent } from './Comman-Components/common/error-page/error-page.component';
import { LoaderComponent } from './Comman-Components/common/loader/loader.component';
import { LeadreportpageComponent } from './Components/Admin/Lead-Reports/Lead_Report/leadreportpage/leadreportpage.component';
import { ProjectteamreportpageComponent } from './Components/Admin/Lead-Reports/TeamReport/projectteamreportpage/projectteamreportpage.component';
import { ChannelPartnerDashBoardComponent } from './Components/DashboardComponents/cp-dash-board/cp-dash-board.component';
import { DigitalmarketingdashboardComponent } from './Components/DashboardComponents/digital-marketing-dash-board/digitalmarketingdashboard/digitalmarketingdashboard.component';
import { ManagerDashBoardComponent } from './Components/DashboardComponents/manager-dash-board/manager-dash-board.component';
import { MemberDashBoardComponent } from './Components/DashboardComponents/member-dash-board/member-dash-board.component';
import { SalesHeadDashBoardComponent } from './Components/DashboardComponents/sales-head-dash-board/sales-head-dash-board.component';
import { AttendanceComponent } from './Components/FacilityManagement/Attendance/attendance.component';
import { AddClientCustomerconsumptionComponent } from './Components/FacilityManagement/ClientCustomerconsumption/clientcustomerconsumption/clientcustomerconsumption.component';
import { DisplayClientcustomerconsumptionComponent } from './Components/FacilityManagement/ClientCustomerconsumption/display-clientcustomerconsumption/display-clientcustomerconsumption.component';
import { ClientServiceConfigComponent } from './Components/FacilityManagement/ClientServiceConfig/client-service-config/client-service-config.component';
import { DisplayClientServiceConfigComponent } from './Components/FacilityManagement/ClientServiceConfig/display-client-service-config/display-client-service-config.component';
import { DisplayqrgeneratorComponent } from './Components/FacilityManagement/Qrgenerator/display-qrgenerator/display-qrgenerator.component';
import { AddQrgeneratorComponent } from './Components/FacilityManagement/Qrgenerator/qrgenerator/Qrgenerator.component';
import { DisplayqrtransactiondataComponent } from './Components/FacilityManagement/Qrtransactiondata/display-qrtransactiondata/display-qrtransactiondata.component';
import { AddQrtransactiondataComponent } from './Components/FacilityManagement/Qrtransactiondata/qrtransactiondata/Qrtransactiondata.component';
import { DisplayreportsComponent } from './Components/FacilityManagement/Reports/display-reports/display-reports.component';
import { AddAttendanceComponent } from './Components/FacilityManagement/add-attendance/add-attendance.component';
import { AddShiftAttendanceComponent } from './Components/FacilityManagement/add-shiftattendance/add-shiftattendance.component';
import { AttendanceReportComponent } from './Components/FacilityManagement/attendance-report/attendance-report.component';
import { AddclientComponent } from './Components/FacilityManagement/client/client/client.component';
import { DisplayclientComponent } from './Components/FacilityManagement/client/displayclient/displayclient.component';
import { AddclientinvoicereportComponent } from './Components/FacilityManagement/clientinvoicereport/clientinvoicereport/clientinvoicereport.component';
import { DisplayclientinvoicereportComponent } from './Components/FacilityManagement/clientinvoicereport/displayclientinvoicereport/displayclientinvoicereport.component';
import { DisplayCustomerInvoicesComponent } from './Components/FacilityManagement/display-customer-invoices/display-customer-invoices.component';
import { Displaylogentry } from './Components/FacilityManagement/displaylogentry/displaylogentry.component';
import { FacilityServiceConfigComponent } from './Components/FacilityManagement/facility-service-config/facility-service-config.component';
import { MyAttendanceComponent } from './Components/FacilityManagement/my-attendance/my-attendance.component';
import { IssueDashboardComponent } from './Components/Issues/IssuesDashboard/issue-dashboard/issue-dashboard.component';
import { EditReasignIssueTypeComponent } from './Components/Issues/ReassignIssueType/edit-reasign-issue-type/edit-reasign-issue-type.component';
import { ReAssignIssueTypeComponent } from './Components/Issues/ReassignIssueType/re-assign-issue-type/re-assign-issue-type.component';
import { OrganizationChartComponent } from './Components/Organizationchart/Organizationchart/organization-chart.component';
import { ChannelPartnerApprovalComponent } from './Components/Presales/CP Approvals/channel-partner-approval.component';
import { ChannelPartnerApproveComponent } from './Components/Presales/CP Approve/cpapprove.component';
import { CPLeadRegisterComponent } from './Components/Presales/CP Lead Register/cp-lead-register/cp-lead-register.component';
import { ChannelPatnerRegisterComponent } from './Components/Presales/CP Registration/channel-patner-register/channel-patner-register.component';
import { DisplayChannelPartnerComponent } from './Components/Presales/CP Registration/display-channel-partner/display-channel-partner.component';
import { EditChannelPatnerApprovalComponent } from './Components/Presales/Edit CP Approvals/edit-channel-patner-approval.component';
import { LeadbudgetComponent } from './Components/Presales/LeadBudget/leadbudget/leadbudget.component';
import { LeadbudgetpageComponent } from './Components/Presales/LeadBudget/leadbudgetpage/leadbudgetpage.component';
import { DisplayLeadSourcesComponent } from './Components/Presales/LeadSource/display-leadsources/display-sources.component';
import { LeadSourceComponent } from './Components/Presales/LeadSource/leadsource/leadsource.component';
import { DisplayLeadSubSourcesComponent } from './Components/Presales/LeadSubSource/display-leadsubsources/display-subsources.component';
import { LeadSubSourceComponent } from './Components/Presales/LeadSubSource/leadsubsource/leadsubsource.component';
import { AddLeadComponent } from './Components/Presales/Leads/add-lead/add-lead.component';
import { DashboardFollowupsComponent } from './Components/Presales/Leads/dashboard-followups/dashboard-followups.component';
import { DisplayFollowupsComponent } from './Components/Presales/Leads/display-followups/display-followups.component';
import { DisplayLeadsComponent } from './Components/Presales/Leads/display-leads/display-leads.component';
import { DuplicateLeadsComponent } from './Components/Presales/Leads/dulicate-lead/duplicate-leads.component';
import { LeadFollowupComponent } from './Components/Presales/Leads/lead-followup/lead-followup.component';
import { LeadhistorypageComponent } from './Components/Presales/Leads/leadhistorypage/leadhistorypage.component';
import { WalkInLeadsComponent } from './Components/Presales/Leads/walkinleads/walk-in-leads/walk-in-leads.component';
import { RolemanageComponent } from './Components/Presales/RoleManage/rolemanage/rolemanage.component';
import { SalesteamsComponent } from './Components/Presales/SalesTeam/salesteams/salesteams.component';
import { SalesteamspageComponent } from './Components/Presales/SalesTeam/salesteamspage/salesteamspage.component';
import { DisplayScheduleVisitComponent } from './Components/Presales/Schedule Visit/display-schedule-visit/display-schedule-visit.component';
import { LeadScheduleVisitComponent } from './Components/Presales/Schedule Visit/lead-schedule-visit/lead-schedule-visit.component';
import { DisplaySiteVisitComponent } from './Components/Presales/Site Visit/display-site-visit/display-site-visit.component';
import { SiteVisitComponent } from './Components/Presales/Site Visit/site-visit/site-visit.component';
import { DisplayTeamMatesComponent } from './Components/Presales/display-team-mates/display-team-mates.component';
import { ApprovalsComponent } from './Components/Procurement/Approvals/approvals/approvals.component';
import { DisplayapprovalsComponent } from './Components/Procurement/Approvals/display-approvals/display-approvals.component';
import { ConfigurationTabsComponent } from './Components/Procurement/Configuration/ConfigurationTabs/configuration-tabs/configuration-tabs.component';
import { AddIndentComponent } from './Components/Procurement/Indent/add-indent/add-indent.component';
import { DisplayindentComponent } from './Components/Procurement/Indent/display-indent/display-indent.component';
import { ViewIndentComponent } from './Components/Procurement/Indent/view-indent/view-indent.component';
import { AddItemCategoryComponent } from './Components/Procurement/ItemCategory/add-item-category/add-item-category.component';
import { ItemCategoriesComponent } from './Components/Procurement/ItemCategory/item-categories/item-categories.component';
import { AddItemSpecificationComponent } from './Components/Procurement/ItemSpecification/add-item-specification/add-item-specification.component';
import { DisplayItemSpecificationComponent } from './Components/Procurement/ItemSpecification/display-item-specification/display-item-specification.component';
import { AddItemSubCategoryComponent } from './Components/Procurement/ItemSubCategory/add-item-sub-category/add-item-sub-category.component';
import { DisplayItemSubCategoryComponent } from './Components/Procurement/ItemSubCategory/display-item-sub-category/display-item-sub-category.component';
import { AddItemUnitComponent } from './Components/Procurement/ItemUnit/add-item-unit/add-item-unit.component';
import { DisplayitemUnitComponent } from './Components/Procurement/ItemUnit/display-item-unit/display-item-unit.component';
import { StoreComponent } from './Components/Procurement/Strore/store/store.component';
import { AddBlockComponent } from './Components/Project/Block/add-block/add-block.component';
import { DisplayblockComponent } from './Components/Project/Block/display-block/display-block.component';
import { AddBookingComponent } from './Components/Project/Booking/add-booking/add-booking.component';
import { BookingLeadComponent } from './Components/Project/Booking/booking-lead/booking-lead/booking-lead.component';
import { DisplayLevelComponent } from './Components/Project/Level/display-level/display-level.component';
import { LevelComponent } from './Components/Project/Level/level/level.component';
import { DisplayprojectComponent } from './Components/Project/Project/displayproject/displayproject.component';
import { ProjectComponent } from './Components/Project/Project/project/project.component';
import { AvailableUnitsComponent } from './Components/Project/Unit/available-units/available-units.component';
import { BookedUnitsComponent } from './Components/Project/Unit/booked-units/booked-units.component';
import { DisplayUnitComponent } from './Components/Project/Unit/display-unit/display-unit.component';
import { UnitComponent } from './Components/Project/Unit/unit/unit.component';
import { DisplayUnitTypeComponent } from './Components/Project/UnitType/display-unit-type/display-unit-type.component';
import { UnitTypeComponent } from './Components/Project/UnitType/unittype/unit-type.component';
import { CloneuserComponent } from './Components/User/CloneUser/cloneuser/cloneuser.component';
import { CommonreferenceDetailsComponent } from './Components/User/Common-Reference/CommonReferenceDetails/commonreference-details/commonreference-details.component';
import { DisplaycommonreferencedetailsComponent } from './Components/User/Common-Reference/CommonReferenceDetails/displaycommonreferencedetails/displaycommonreferencedetails.component';
import { CommonReferenceTypeComponent } from './Components/User/Common-Reference/CommonReferenceType/common-reference-type/common-reference-type.component';
import { DisplayCommonReferenceTypeComponent } from './Components/User/Common-Reference/CommonReferenceType/display-common-reference-type/display-common-reference-type.component';
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
import { UsermanagepageComponent } from './Components/User/UserManage/usermanagepage/usermanagepage.component';
import { DisplayPrimeActivityCodeComponent } from './Components/WorkOrder/Prime Activity Code/display-prime-activity-code/display-prime-activity-code.component';
import { AddPrimeActivityCode } from './Components/WorkOrder/Prime Activity Code/prime-activity-code/prime-activity-code.component';
import { DisplayServiceCodeComponent } from './Components/WorkOrder/Service Code/display-service-code/display-service-code.component';
import { AddServiceCode } from './Components/WorkOrder/Service Code/service-code/service-code.component';
import { DisplayServiceGroupComponent } from './Components/WorkOrder/Service Group/display-service-group/display-service-group.component';
import { AddServiceGroup } from './Components/WorkOrder/Service Group/service-group/service-group.component';
import { DisplayvendorComponent } from './Components/WorkOrder/Vendor Data/displayvendor/displayvendor.component';
import { AddvendorComponent } from './Components/WorkOrder/Vendor Data/vendor/vendor.component';
import { DisplayworkflowstageComponent } from './Components/Workflow/Workflowstage/display-workflowstage/display-Workflowstage.component';
import { AddWorkflowstageComponent } from './Components/Workflow/Workflowstage/workflowstage/Workflowstage.component';
import { DisplayHistoryDetailsComponent } from './Components/Workflow/display-history-details/display-history-details.component';
import { DisplayduplicateleadhistoryComponent } from './Components/duplicateleadhistory/displayduplicateleadhistory/displayduplicateleadhistory.component';
import { DuplicateleadhistoryDisplayComponent } from './Components/duplicateleadhistory/duplicateleadhistory/duplicateleadhistory.component';
import { AuthInterceptor } from './Guard/auth.interceptor';
import { ChannelpatnerRegistrationDailougeComponent } from './Comman-Components/Dialog/channelpatner-registration/channelpatner-registration.component';
import { AddAccountEntryComponent } from './Components/Account/account entry/account-entry/account-entry.component';
import { DisplayAccountEntryComponent } from './Components/Account/account entry/display-account-entry/display-account-entry.component';
import { TechAdminDashBoardComponent } from './Components/DashboardComponents/tech-admin-dash-board/tech-admin-dash-board.component';
import { DisplayAllLeadsComponent } from './Components/Presales/All Lead/display-account-entry/display-all-leads.component';
import { DisplayStandInUserComponent } from './Components/WorkOrder/StandInUser/display-stand-in-user/display-stand-in-user.component';
import { AddStandInUser } from './Components/WorkOrder/StandInUser/stand-in-user/stand-in-user.component';
import { DisplayWorkOrderBillingComponent } from './Components/WorkOrder/Work Order Billing/display-work-order-billing/display-work-order-billing.component';
import { AddWorkOrderBilling } from './Components/WorkOrder/Work Order Billing/work-order-billing/work-order-billing.component';
import { DisplayWorkOrderCreationComponent } from './Components/WorkOrder/Work Order Creation/display-work-order-creation/display-work-order-creation.component';
import { AddWorkOrderCreation } from './Components/WorkOrder/Work Order Creation/work-order-creation/work-order-creation.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DuplicateLeadInfoDialogComponent } from './Comman-Components/Dialog/duplicate-lead-info-dialog/duplicate-lead-info-dialog.component';
import { LeadFollowupCalendarComponent } from './Components/Full-Calendar/Lead-Followup-Calendar/lead-followup-calendar/lead-followup-calendar.component';
import { DisplayExpiringLeadsComponent } from './Components/Presales/Leads/display-expiring-leads/display-expiring-leads.component';
import { DisplayWorkOrderApprovalComponent } from './Components/WorkOrder/Work Order Approval/display-work-order-approval/display-work-order-approval.component';
import { WorkOrderApprovalComponent } from './Components/WorkOrder/Work Order Approval/work-order-approval/work-order-approval.component';
import { NavbarComponent } from './Components/navbar/navbar.component';
import { MatStepperModule } from '@angular/material/stepper';
// import { QuillModule } from 'ngx-quill';
import { DocumentComponent } from './Comman-Components/Dialog/documentmodel/document.component';
import { BookingFormComponent } from './Components/Crm/Booking/booking-form/booking-form.component';
import { DisplayPaymentPlanComponent } from './Components/Crm/PaymentPlan/displayPaymentPlan/displayPaymentPlan.component';
import { PaymentPlanComponent } from './Components/Crm/PaymentPlan/paymentPlan/paymentPlan.component';
import { AddStageComponent } from './Components/Crm/Stage/add-stage/add-stage.component';
import { AttendanceDashBoardComponent } from './Components/DashboardComponents/attendance-dash-board/attendance-dash-board.component';
import { DisplayEmployeeComponent } from './Components/Employee/Employee/display-employee/display-employee.component';
import { EmployeeComponent } from './Components/Employee/Employee/employee/employee.component';
import { DisplayemployeebankdetailsComponent } from './Components/Employee/EmployeeBankingDetails/display-employee-banking-details/display-employee-banking-details.component';
import { EmployeebankdetailsComponent } from './Components/Employee/EmployeeBankingDetails/employee-banking-details/employee-banking-details.component';
import { AssetsComponent } from './Components/Employee/assets/assets/assets.component';
import { DisplayassetsComponent } from './Components/Employee/assets/displayassets/displayassets.component';
import { DisplaysecurityreportComponent } from './Components/FacilityManagement/securityreport/displaysecurityreport/displaysecurityreport.component';
import { SecurityreportComponent } from './Components/FacilityManagement/securityreport/securityreport/securityreport.component';
import { DisplaynotificationsComponent } from './Components/Project/notifications/displaynotifications/displaynotifications.component';
import { NotificationsComponent } from './Components/Project/notifications/notification/notifications.component';
import { AddAdditionalShiftComponent } from './Components/User/AdditinalShift/add-additional-shift/add-additional-shift.component';
import { DisplayAdditionalShiftComponent } from './Components/User/AdditinalShift/display-additional-shift/display-additional-shift.component';
import { WorkOrderStageComponent } from './Components/WorkOrder/Stages/workorder-stage.component';
import { DisplayWorkOrderBillingApprovalComponent } from './Components/WorkOrder/Work Order Billing Approval/display-work-order-billing-approval/display-work-order-billing-approval.component';
import { WorkOrderBillingApprovalComponent } from './Components/WorkOrder/Work Order Billing Approval/work-order-billing-approval/work-order-billing-approval.component';
import { DisplayWorkOrderBillingDetailsComponent } from './Components/WorkOrder/Work Order Billing Details/display-work-order-billing-details/display-work-order-billing-details.component';
import { WorkOrderBillingQuantitiesComponent } from './Components/WorkOrder/Work Order Billing Quantities/workorder-billing-quantity.component';
import { DisplayWorkOrderDetailsComponent } from './Components/WorkOrder/Work Order Details/display-work-order-details/display-work-order-details.component';
import { WorkOrderQuantityComponent } from './Components/WorkOrder/Work Order Quantities/workorder-quantity.component';
import { DisplayBookingFormComponent } from './Components/Crm/Booking/displayBookingForm/displayBookingForm.component';
import { SaveBookingChargeComponent } from './Components/Crm/Booking/save-booking-charge/save-booking-charge.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullMonthNamePipe } from 'src/fullMonthName';
import { WorkOrderAmountComponent } from './Comman-Components/WorkOrderAmount/workorder-amount.component';
import { CacheManagementComponent } from './Comman-Components/cache-management/cache-management.component';
import { PrivacyPolicyComponent } from './Comman-Components/privacy-policy/privacy-policy.component';
import { DisplayBookingChargesComponent } from './Components/Crm/Booking/displayBookingCharges/displayBookingCharges.component';
import { DisplayBookingOverviewComponent } from './Components/Crm/Booking/displayBookingOverview/displayBookingOverview.component';
import { DisplayCustomerStagesComponent } from './Components/Crm/Booking/displayCustomerStages/displayCustomerStages.component';
import { CustomerPaymentComponent } from './Components/Crm/CustomerPayment/customer-payment/customer-payment.component';
import { DisplayCustomerPaymentComponent } from './Components/Crm/CustomerPayment/display-customer-payment/display-customer-payment.component';
import { AddingPaymentComponent } from './Components/Crm/PaymentDetails/adding-payment/adding-payment.component';
import { AddingTdsComponent } from './Components/Crm/PaymentDetails/adding-tds/adding-tds.component';
import { DisplayPaymentDetailsComponent } from './Components/Crm/PaymentDetails/display-payment-details/display-payment-details.component';
import { PaymentDetailsComponent } from './Components/Crm/PaymentDetails/payment-details/payment-details.component';
import { CustomerApprovalPaymentComponent } from './Components/Crm/customer-approval-payment/customer-approval-payment.component';
import { CustomerDashboardComponent } from './Components/Crm/customer/customer-dashboard/customer-dashboard.component';
import { CustomerstagesdisplayComponent } from './Components/Crm/customer/customerstagesdisplay/customerstagesdisplay.component';
import { CustomerunitsdisplayComponent } from './Components/Crm/customer/customerunitsdisplay/customerunitsdisplay.component';
import { DisplaydocumentsComponent } from './Components/Crm/customer/displaydocuments/displaydocuments.component';
import { CustomerdocumentdisplayComponent } from './Components/Crm/customerdocumentdisplay/customerdocumentdisplay.component';
import { DisplayProjectChargeComponent } from './Components/Crm/project-charge/display-project-charge/display-project-charge.component';
import { ProjectChargeComponent } from './Components/Crm/project-charge/project-charge/project-charge.component';
import { SoaDocumentsComponent } from './Components/Crm/soa-documents/soa-documents.component';
import { CpDashboardV1Component } from './Components/DashboardComponents/cp-dashboard-v1/cp-dashboard-v1.component';
import { CrmDashBoardComponent } from './Components/DashboardComponents/crm-dash-board/crm-dash-board.component';
import { Managerdashboardv1Component } from './Components/DashboardComponents/managerdashboardv1/managerdashboardv1.component';
import { MemberDashboardV1Component } from './Components/DashboardComponents/member-dashboard-v1/member-dashboard-v1.component';
import { SaleHeadDashboardV1Component } from './Components/DashboardComponents/sale-head-dashboard-v1/sale-head-dashboard-v1.component';
import { AssetAllocationComponent } from './Components/Employee/AssetAllocation/AssetAllocation/asset-allocation.component';
import { DisplayAssetAllocationComponent } from './Components/Employee/AssetAllocation/displayAssetAllocation/display-asset-allocation.component';
import { DisplayResignedEmployeeComponent } from './Components/Employee/Employee/display-resigned-employee/display-resigned-employee.component';
import { AddFingerprintUserComponent } from './Components/FacilityManagement/Fringerprint-User-Mapping/add-fingerprint-user/add-fingerprint-user.component';
import { DisplayFingerprintAssignedUserComponent } from './Components/FacilityManagement/Fringerprint-User-Mapping/display-fingerprint-assigned-user/display-fingerprint-assigned-user.component';
import { AllLeadsComponent } from './Components/Presales/Leads/all-leads/all-leads.component';
import { CustomerLeadPageComponent } from './Components/Presales/Leads/customer-lead-page/customer-lead-page.component';
import { CustomerLeadComponent } from './Components/Presales/Leads/customer-lead/customer-lead.component';
import { DisplayEoiComponent } from './Components/Presales/Leads/display-eoi/display-eoi.component';
import { EoiComponent } from './Components/Presales/Leads/eoi/eoi.component';
import { DisplayIndentApprovalsComponent } from './Components/Procurement/Approvals/indent-approval/indent-approval.component';
import { DisplayNonPendingIndentComponent } from './Components/Procurement/Indent/display-non-pending-indent/display-non-pending-indent.component';
import { IndentDetailsComponent } from './Components/Procurement/Indent/indent-details/indent-details.component';
import { IndentItemComponent } from './Components/Procurement/IndentItems/indentitems.component';
import { CreateQuotationsComponent } from './Components/Procurement/Quotation/create-quotations/create-quotations.component';
import { AddInventoryReceivable } from './Components/Procurement/inventory-receivables/inventory-receivables/inventory-receivables.component';
import { CustomerLegalDocumentPageComponent } from './Components/Project/LegalCustomerDocument/customer-legal-document-page/customer-legal-document-page.component';
import { LegalCustomerDocumnetComponent } from './Components/Project/LegalCustomerDocument/legal-customer-documnet/legal-customer-documnet.component';
import { AddsaleaggrementtemplatefieldsComponent } from './Components/Project/SalesAggrementTemplate/addsaleaggrementtemplatefields/addsaleaggrementtemplatefields.component';
import { AddsalesaggrementtemplateComponent } from './Components/Project/SalesAggrementTemplate/addsalesaggrementtemplate/addsalesaggrementtemplate.component';
import { DisplaysalesaggrementtemplateComponent } from './Components/Project/SalesAggrementTemplate/displaysalesaggrementtemplate/displaysalesaggrementtemplate.component';
import { GeneratesalesaggrementComponent } from './Components/Project/SalesAggrementTemplate/generatesalesaggrement/generatesalesaggrement.component';
import { DisplayRoleReferencePermissionComponent } from './Components/User/Common-Reference/RoleReferencePermission/displayrolereferencepermission/displayrolereferencepermission.component';
import { RoleReferencePermissionComponent } from './Components/User/Common-Reference/RoleReferencePermission/rolereferencepermission/rolereferencepermission.component';
import { DisplaySacCodeComponent } from './Components/WorkOrder/Sac Code/display-sac-code/display-sac-code.component';
import { SacCodeComponent } from './Components/WorkOrder/Sac Code/sac-code/sca-code.component';
import { WorkOrderBillingAdditionalInfo } from './Components/WorkOrder/Work Order Billing/wob-additional_info/wob-additional-info.component';
import { DisplayWorkOrderHeaderComponent } from './Components/WorkOrder/Work Order Header/display-work-order-header/display-work-order-header.component';
import { WorkOrderHeaderComponent } from './Components/WorkOrder/Work Order Header/work-order-header/work-order-header.component';
import { CustomerlayoutComponent } from './Components/customerlayout/customerlayout.component';
import { EmailExistsDialog } from './EmailExistsDialog ';
import { IndianCurrencyPipe } from './indian-currency.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { QuillModule } from 'ngx-quill';
import { AutoV1Component } from './Comman-Components/auto-complete-v1/auto.component';
import { AutocompleteComponent } from './Comman-Components/auto-complete/auto-complete.component';
import { DateFilterComponent } from './Comman-Components/date-filter/date-filter.component';
import { RefreshButtonComponent } from './Comman-Components/refresh-button/refresh-button.component';
import { TableComponent } from './Comman-Components/table-component/table-component';
import { SaleAgreementApprovalComponent } from './Components/Crm/Approvals/sale-agreement-approval/sale-agreement-approval.component';
import { BookingformApprovalComponent } from './Components/Crm/Booking/bookingform-approval/bookingform-approval.component';
import { DisplayPaymentLedgerComponent } from './Components/Crm/PaymentDetails/display-payment-ledger/display-payment-ledger.component';
import { AssignApplicantsToCrmmembersComponent } from './Components/Crm/assign-applicants-to-crmmembers/assign-applicants-to-crmmembers.component';
import { DisplayApprovedSaleagreementsComponent } from './Components/Crm/display-approved-saleagreements/display-approved-saleagreements.component';
import { DisplaySaleAgreementComponent } from './Components/Crm/display-sale-agreement/display-sale-agreement.component';
import { CpDashboardV2Component } from './Components/DashboardComponents/cp-dashboard-v2/cp-dashboard-v2.component';
import { CtoDashBoardComponent } from './Components/DashboardComponents/cto-dash-board/cto-dash-board.component';
import { HRdashboardComponent } from './Components/DashboardComponents/hrdashboard/hrdashboard.component';
import { ManagerDashboardV2Component } from './Components/DashboardComponents/manager-dashboard-v2/manager-dashboard-v2.component';
import { MemberDashboardV2Component } from './Components/DashboardComponents/member-dashboard-v2/member-dashboard-v2.component';
import { SaleHeadDashboardV2Component } from './Components/DashboardComponents/sales-head-dash-board-v2/sale-head-dashboard-v2.component';
import { EmployeeDetailsApproveComponent } from './Components/Employee/Employee/employee-details-approve/employee-details-approve.component';
import { EmployeeformstagesComponent } from './Components/Employee/Employee/employeeformstages/employeeformstages.component';
import { DisplayFeildofficerpatrolComponent } from './Components/FacilityManagement/Securitypatrol/display-feildofficerpatrol/display-feildofficerpatrol.component';
import { DisplayCpDocumentsComponent } from './Components/Presales/CP Registration/display-cp-documents/display-cp-documents.component';
import { DigitalLeadsComponent } from './Components/Presales/Digital Leads/digital-leads/digital-leads.component';
import { DisplayCpLeadsComponent } from './Components/Presales/Leads/display-cp-leads/display-cp-leads.component';
import { UniqueLeadsComponent } from './Components/Presales/Leads/unique-leads/unique-leads.component';
import { DisplayApprovalQuotationComponent } from './Components/Procurement/Approvals/display-quotation-approval/display-quotation-approval.component';
import { DisplayApproveRejReworkQuotationComponent } from './Components/Procurement/Approvals/quotation-approval/quotation-approval.component';
import { DisplayInventoryTransferComponent } from './Components/Procurement/Inventory-transfer/display-inventory-transfer/display-inventory-transfer.component';
import { InventoryTransferComponent } from './Components/Procurement/Inventory-transfer/inventory-transfer/inventory-transfer.component';
import { DisplayApproveRejReworkPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-approved-purchase-order/display-approved-purchase-order.component';
import { DisplayApprovedQuotationComponent } from './Components/Procurement/PurchaseOrder/display-approved-quotation/display-approved-quotation.component';
import { DisplayNonPendingPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-non-pending-purchase-order/display-non-pending-purchase-order.component';
import { DisplayApprovalPurchaseOrderComponent } from './Components/Procurement/PurchaseOrder/display-purchase-order-approval/display-purchase-order-approval.component';
import { DisplayNonPendingQuotationComponent } from './Components/Procurement/Quotation/display-non-pending-quotation/display-non-pending-quotation.component';
import { InventoryReceivableDetailsPopupComponent } from './Components/Procurement/inventory-receivable-details-popup/inventory-receivable-details-popup.component';
import { DisplayInventoryReceivableComponent } from './Components/Procurement/inventory-receivables/display-inventory-receivables/display-inventory-receivables.component';
import { DisplayStoreInventoryComponent } from './Components/Procurement/storeinventory/display-store-inventory/display-store-inventory.component';
import { AmendmentWorkOrderQuantityComponent } from './Components/WorkOrder/Amendment Work Order Quantities/amendment-workorder-quantity.component';
import { GreFormComponent } from './Components/Presales/gre-form/gre-form.component';
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
import { InventoryTransferPopupComponent } from './Components/Procurement/Inventory-transfer/inventory-transfer-popup/inventory-transfer-popup.component';
import { GlobalDashboardComponent } from './Components/DashboardComponents/global-dashboard/global-dashboard.component';
import { AccountsCrmDashboardComponent } from './Components/DashboardComponents/accounts-crm-dashboard/accounts-crm-dashboard.component';
import { CRMFollowupComponent } from './Components/Crm/crmfollowup/crmfollowup.component';
import { ShiftAttendanceComponent } from './Components/FacilityManagement/ShiftAttendance/shift-attendance.component';
import { ShiftAttendanceDashBoardComponent } from './Components/DashboardComponents/shiftattendance-dash-board/shiftattendance-dash-board.component';
import { GlobalMenuComponent } from './Components/MenuShortCut/global-menu/global-menu.component';
import { CancelBookingApprovalComponent } from './Components/Crm/Approvals/cancel-booking-approval/cancel-booking-approval.component';
import { StoreItemDialogComponent } from './Comman-Components/Dialog/storeitemdialog/storeitemdialog.component';
import { CpTermsAndConditionsComponent } from './Components/Presales/cp-terms-and-conditions/cp-terms-and-conditions.component';
import { CallingDialogComponent } from './Comman-Components/Dialog/calling-dialog/calling-dialog.component';

import { InventoryReceivablePendingApprovalComponent } from './Components/Procurement/InventoryReceivableApprovals/InventoryReceivablePendingApproval/inventory-receivable-pending-approval.component';
import { InventoryReceivableNonPendingApprovalComponent } from './Components/Procurement/InventoryReceivableApprovals/InventoryReceivableNonPendingApproval/inventory-receivable-non-pending-approval.component';
import { DisplayIRComponent } from './Components/Procurement/inventory-receivables/display-inventory-receivable/display-inventory-receivable.component';
import { ViewInventoryReceivableComponent } from './Components/Procurement/InventoryReceivableApprovals/ViewInventoryReceivable/view-inventory-receivable.component';
import { PendingInventoryReceivableComponent } from './Components/Procurement/InventoryReceivableApprovals/PendingInventoryReceivable/pending-inventory-receivable.component';
import { AppRejInventoryReceivableComponent } from './Components/Procurement/InventoryReceivableApprovals/AppRejInventoryReceivable copy/app-rej-inventory-receivable.component';
import { LeadTransferApprovalsComponent } from './Components/Presales/lead-transfer-approvals/lead-transfer-approvals.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmdialogComponent,
    HomeComponent,
    LoginComponent,
    NavBarComponent,
    PlainComponent,
    ShowReportsComponent,
    DisplayreportsComponent,
    ReportFieldComponent,
    DisplayreportFieldComponent,
    DisplayExcelMappingsComponent,
    ExcelMappingComponent,
    ShowLeadsReportComponent,
    DisplayWorkflowTypesComponent,
    AddWorkflowtypeComponent,
    AddWorkflowstageComponent,
    CommonReferenceTypeComponent,
    DisplayCommonReferenceTypeComponent,
    CommonreferenceDetailsComponent,
    DisplaycommonreferencedetailsComponent,
    AddMenuComponent,
    DisplaymenuComponent,
    AddmenuitemComponent,
    DisplayMenuItemComponent,
    RoleComponent,
    AddRoleComponent,
    RolepermissiondisplayComponent,
    AddUserComponent,
    DisplayUserComponent,
    OrganizationComponent,
    CloneuserComponent,
    UsermanageComponent,
    UsermanagepageComponent,
    AddBlockComponent,
    DisplayblockComponent,
    LevelComponent,
    DisplayLevelComponent,
    ProjectComponent,
    DisplayprojectComponent,
    UnitComponent,
    DisplayUnitComponent,
    UnitTypeComponent,
    DisplayUnitTypeComponent,
    DisplayHolidayComponent,
    HolidayComponent,
    DisplayLeaveRequestComponent,
    LeaveRequestComponent,
    AddTeamLeavesComponent,
    DisplayTeamLeavesComponent,
    DisplayWeekOffComponent,
    AddWeekOffComponent,
    DisplayTeamWeekOffComponent,
    AddTeamWeekoffComponent,
    AddIndentComponent,
    DisplayindentComponent,
    AddItemCategoryComponent,
    ItemCategoriesComponent,
    AddItemSpecificationComponent,
    DisplayItemSpecificationComponent,
    AddItemSubCategoryComponent,
    DisplayItemSubCategoryComponent,
    AddItemUnitComponent,
    DisplayitemUnitComponent,
    StoreComponent,
    ConfigurationTabsComponent,
    DisplaysecuritypatrolComponent,
    DisplayqrgeneratorComponent,
    AddQrtransactiondataComponent,
    DisplayqrtransactiondataComponent,
    AddQrgeneratorComponent,
    DisplayapprovalsComponent,
    ApprovalsComponent,
    SiteVisitComponent,
    LeadScheduleVisitComponent,
    DisplayScheduleVisitComponent,
    LeadFollowupComponent,
    DisplayLeadsComponent,
    DisplayFollowupsComponent,
    DashboardFollowupsComponent,
    AddLeadComponent,
    LeadSubSourceComponent,
    DisplayLeadSubSourcesComponent,
    LeadSourceComponent,
    DisplayLeadSourcesComponent,
    RolemanageComponent,
    DisplaySiteVisitComponent,
    LeadbudgetpageComponent,
    LeadbudgetComponent,
    DisplayChannelPartnerComponent,
    ChannelPatnerRegisterComponent,
    CPLeadRegisterComponent,
    AddSecuritypatrolComponent,
    DisplayinvoiceComponent,
    AddInvoiceComponent,
    ReportsComponent,
    AddCustomerconsumptionComponent,
    DuplicateLeadsComponent,
    DisplayIssueApprovalsComponent,
    IssueApprovalComponent,
    AddIssuesComponent,
    AddCustomerComponent,
    DisplayissuesComponent,
    DisplaycustomerComponent,
    DisplayquotationComponent,
    AddQuotationComponent,
    CreateQuotationComponent,
    DisplaycustomerconsumptionComponent,
    UserteamanageComponent,
    ViewPurchaseOrderComponent,
    PurchaseOrderComponent,
    DisplyPurchaseOrderComponent,
    DisplayworkflowstageComponent,
    ProfileComponent,
    ManualleadassignComponent,
    ViewIndentComponent,
    ApproveDialogComponent,
    ChannelPartnerApproveComponent,
    ChannelPartnerApprovalComponent,
    DisplayOrganizationComponent,
    IssueDashboardComponent,
    ReAssignIssueTypeComponent,
    EditReasignIssueTypeComponent,
    DisplayHistoryDetailsComponent,
    AvailableUnitsComponent,
    AddBookingComponent,
    AddvendorComponent,
    DisplayvendorComponent,
    DisplayCustomerInvoicesComponent,
    LeadhistorypageComponent,
    ClientServiceConfigComponent,
    DisplayClientServiceConfigComponent,
    AddclientComponent,
    DisplayclientComponent,
    FacilityServiceConfigComponent,
    LoaderComponent,
    LeadreportpageComponent,
    SalesteamspageComponent,
    SalesteamsComponent,
    CPDashBoardComponent,
    DashBoardComponent,
    SalesHeadDashBoardComponent,
    ChannelPartnerDashBoardComponent,
    DisplayclientinvoicereportComponent,
    AddclientinvoicereportComponent,
    ErrorPageComponent,
    ApexChartsComponent,
    DisplayOrganizationComponent,
    ReusableTableComponent,
    ManagerDashBoardComponent,
    MemberDashBoardComponent,
    AttendanceComponent,
    AddAttendanceComponent,
    AddShiftAttendanceComponent,
    Displaylogentry,
    ProjectteamreportpageComponent,
    AttendanceComponent,
    AddAttendanceComponent,
    MemberDashBoardComponent,
    OrganizationChartComponent,
    AddCustomerconsumptionComponent,
    AddClientCustomerconsumptionComponent,
    DisplayClientcustomerconsumptionComponent,
    AttendanceReportComponent,
    DisplayduplicateleadhistoryComponent,
    DuplicateleadhistoryDisplayComponent,
    AddPrimeActivityCode,
    DisplayPrimeActivityCodeComponent,
    AddServiceGroup,
    DisplayServiceGroupComponent,
    AddServiceCode,
    DisplayServiceCodeComponent,
    EditChannelPatnerApprovalComponent,
    BookedUnitsComponent,
    DisplayServiceGroupComponent,
    DigitalmarketingdashboardComponent,
    WalkInLeadsComponent,
    AddAccountEntryComponent,
    DisplayAccountEntryComponent,
    MyAttendanceComponent,
    DisplayTeamMatesComponent,
    BookingLeadComponent,
    AddWorkOrderCreation,
    DisplayWorkOrderCreationComponent,
    AddStandInUser,
    DisplayStandInUserComponent,
    TechAdminDashBoardComponent,
    DisplayAllLeadsComponent,
    ChannelpatnerRegistrationDailougeComponent,
    DisplayWorkOrderBillingComponent,
    AddWorkOrderBilling,
    NavbarComponent,
    DuplicateLeadInfoDialogComponent,
    DisplayExpiringLeadsComponent,
    DisplayWorkOrderApprovalComponent,
    WorkOrderApprovalComponent,
    LeadFollowupCalendarComponent,
    DisplayWorkOrderBillingApprovalComponent,
    AttendanceDashBoardComponent,
    DisplayWorkOrderDetailsComponent,
    WorkOrderBillingApprovalComponent,
    DisplayWorkOrderBillingDetailsComponent,
    AttendanceDashBoardComponent,
    DocumentComponent,
    NotificationsComponent,
    DisplaynotificationsComponent,
    AddAdditionalShiftComponent,
    DisplayAdditionalShiftComponent,
    BookingFormComponent,
    SecurityreportComponent,
    DisplaysecurityreportComponent,
    WorkOrderQuantityComponent,
    WorkOrderStageComponent,
    EmployeeComponent,
    DisplayEmployeeComponent,
    DisplayemployeebankdetailsComponent,
    EmployeebankdetailsComponent,
    AddStageComponent,
    DisplayPaymentPlanComponent,
    PaymentPlanComponent,
    DisplayassetsComponent,
    AssetsComponent,
    DisplayProjectChargeComponent,
    ProjectChargeComponent,
    WorkOrderBillingQuantitiesComponent,
    AssetAllocationComponent,
    DisplayAssetAllocationComponent,
    EoiComponent,
    DisplayEoiComponent,
    AddFingerprintUserComponent,
    DisplayFingerprintAssignedUserComponent,
    DisplayBookingFormComponent,
    SaveBookingChargeComponent,
    DisplayBookingChargesComponent,
    DisplayResignedEmployeeComponent,
    WorkOrderAmountComponent,
    PaymentDetailsComponent,
    DisplayPaymentDetailsComponent,
    DisplayCustomerStagesComponent,
    DisplayBookingOverviewComponent,
    AddsalesaggrementtemplateComponent,

    AddsaleaggrementtemplatefieldsComponent,
    IndianCurrencyPipe,
    GeneratesalesaggrementComponent,
    SacCodeComponent,
    DisplaySacCodeComponent,
    DisplaysalesaggrementtemplateComponent,
    FullMonthNamePipe,
    WorkOrderHeaderComponent,
    DisplayWorkOrderHeaderComponent,
    PrivacyPolicyComponent,
    CustomerDashboardComponent,
    EmailExistsDialog,
    CustomerstagesdisplayComponent,
    SaleHeadDashboardV1Component,
    Managerdashboardv1Component,
    MemberDashboardV1Component,
    CpDashboardV1Component,
    CustomerPaymentComponent,
    DisplayCustomerPaymentComponent,
    CrmDashBoardComponent,
    CustomerunitsdisplayComponent,
    CustomerlayoutComponent,
    CustomerApprovalPaymentComponent,
    CacheManagementComponent,
    DisplaydocumentsComponent,
    LegalCustomerDocumnetComponent,
    CustomerLegalDocumentPageComponent,
    AllLeadsComponent,
    CustomerdocumentdisplayComponent,
    WorkOrderBillingAdditionalInfo,
    IndentDetailsComponent,
    IndentItemComponent,
    AddingPaymentComponent,
    CustomerLeadPageComponent,
    CustomerLeadComponent,
    DisplayRoleReferencePermissionComponent,
    RoleReferencePermissionComponent,
    AddingTdsComponent,
    DisplayIndentApprovalsComponent,
    DisplayNonPendingIndentComponent,
    CreateQuotationsComponent,
    AddInventoryReceivable,
    SoaDocumentsComponent,
    DisplayInventoryReceivableComponent,
    InventoryReceivableDetailsPopupComponent,
    CreateQuotationsComponent,
    TableComponent,
    DisplayInventoryTransferComponent,
    InventoryTransferComponent,
    DisplayStoreInventoryComponent,
    DigitalLeadsComponent,
    HRdashboardComponent,
    DisplayApprovalQuotationComponent,
    DisplayApproveRejReworkQuotationComponent,
    AutocompleteComponent,
    DisplayNonPendingQuotationComponent,
    RefreshButtonComponent,
    HRdashboardComponent,
    DigitalLeadsComponent,
    EmployeeformstagesComponent,
    DisplayFeildofficerpatrolComponent,
    EmployeeDetailsApproveComponent,
    AssignApplicantsToCrmmembersComponent,
    DateFilterComponent,
    DisplayApprovedQuotationComponent,
    DisplayNonPendingPurchaseOrderComponent,
    DisplayApprovalPurchaseOrderComponent,
    DisplayApproveRejReworkPurchaseOrderComponent,
    SaleHeadDashboardV2Component,
    UniqueLeadsComponent,
    AmendmentWorkOrderQuantityComponent,
    DisplayPaymentLedgerComponent,

    DisplayCpLeadsComponent,
    MemberDashboardV2Component,
    ManagerDashboardV2Component,
    CpDashboardV2Component,
    AutoV1Component,
    AutoV1Component,
    BookingformApprovalComponent,
    CtoDashBoardComponent,
    SaleAgreementApprovalComponent,
    DisplaySaleAgreementComponent,
    DisplayApprovedSaleagreementsComponent,
    DisplayCpDocumentsComponent,
    GreFormComponent,
    SearchLeadsComponent,

    DisplayStoreComponent,
    AddWoQuantityComponent,
    AddAndEditWorkOrderCreation,
    AddWoHeaderComponent,
    AddWorkOrderHeaderCreationComponent,
    BlockUnitComponent,

    EditInventoryReceivablesComponent,
    BookingFormAddingPaymentComponent,
    AddstoreinventoryComponent,
    InventoryTransferPopupComponent,
    StoreItemDialogComponent,
    GlobalDashboardComponent,
    CRMFollowupComponent,
    AccountsCrmDashboardComponent,
    InventoryReceivablePendingApprovalComponent,
    InventoryReceivableNonPendingApprovalComponent,
    DisplayIRComponent,
    ViewInventoryReceivableComponent,
    PendingInventoryReceivableComponent,
    AppRejInventoryReceivableComponent,
    ShiftAttendanceComponent,
    ShiftAttendanceDashBoardComponent,
    GlobalMenuComponent,
    CancelBookingApprovalComponent,
    LeadTransferApprovalsComponent,
    CpTermsAndConditionsComponent,
    CallingDialogComponent,
  ],
  imports: [
    MatTreeModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule, // Ensure MatButtonModule is imported if using buttons
    MatFormFieldModule, // Ensure MatFormFieldModule is imported if using form fields
    MatInputModule,
    MatCardModule, // Ensure MatCardModule is imported
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatCardModule,
    DragDropModule,

    // NgxMatDatetimePickerModule,

    // NgxMatDatetimePickerModule,
    // NgxMatNativeDateModule,
    MatExpansionModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    NgChartsModule,
    OrgchartModule,
    ToastrModule.forRoot({
      timeOut: 2000, // 15 seconds
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-center',
    }),
    MatMenuModule,
    CommonModule,
    NgApexchartsModule,
    AgGridModule,
    MatStepperModule,
    FullCalendarModule,
    NgChartsModule,
    QuillModule.forRoot(),
    ScrollingModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DecimalPipe,
    CurrencyPipe,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
