import { Component, AfterViewInit } from '@angular/core';
import { embedDashboard } from '@superset-ui/embedded-sdk';

@Component({
  selector: 'app-lead-source-report',
  templateUrl: './lead-source-report.component.html',
  styleUrls: ['./lead-source-report.component.css']
})
export class LeadSourceReportComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const guestToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiZ3Vlc3QiLCJ1c2VyIjp7InVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlcyI6WyJBZG1pbiJdfSwicmVzb3VyY2VzIjpbeyJ0eXBlIjoiZGFzaGJvYXJkIiwiaWQiOiI3YWQyNWZiZC04YzI1LTRkNjgtODU5ZC1mNTQxMmVhY2VhNTAifV0sInJscyI6W10sInJsc19ydWxlcyI6W10sImV4cCI6MjA2MzcyMDk0OCwiYXVkIjoic3VwZXJzZWNyZXQxMjMifQ.I0wJg_Dn-du1YwIZCBQeei0i2G_p3PZ0qwhacB16hXs"; // Keep your real token here

    embedDashboard({
      id: '7ad25fbd-8c25-4d68-859d-f5412eacea50', // Replace with actual UUID
      supersetDomain: 'http://65.2.49.230:8088',
      mountPoint: document.getElementById('dashboard-container')!,
      fetchGuestToken: async () => guestToken, // CORRECTED this assignment
      dashboardUiConfig: {
        hideTitle: false,
        hideChartControls: true,
      },
    }).catch(error => {
      console.error('Failed to embed dashboard:', error);
    });
  }

}
