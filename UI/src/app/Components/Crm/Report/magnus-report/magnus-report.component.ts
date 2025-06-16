import { AfterViewInit, Component } from '@angular/core';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { GET_SUPERSET_TOKEN } from 'src/app/Apis/UserApis/User';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-magnus-report',
  templateUrl: './magnus-report.component.html',
  styleUrls: ['./magnus-report.component.css'],
})
export class MagnusReportComponent implements AfterViewInit {
  dashboardId = environment.crmDashBoardId; // Set dynamically as needed
  projectId = 16; // Set dynamically as needed

  async ngAfterViewInit(): Promise<void> {
    // Get the current user from localStorage
    const userJson = localStorage.getItem('user');
    let username = 'corenuts';
    let roles = ['Tech Admin'];
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.userName) {
          // username = user.userName;
          username = 'corenuts'; // Default to 'admin' if userName is not available
        }
        if (user.roleName) {
          roles = ['Tech Admin'];
          //roles = [user.roleName];
        }
      } catch (e) {
        console.warn('Failed to parse user from localStorage:', e);
      }
    }
    let guestToken = '';
    try {
      const response = await fetch(
        `${environment.userBaseUrl}${GET_SUPERSET_TOKEN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            roles,
            dashboardId: this.dashboardId,
            project_id: this.projectId,
          }),
        }
      );
      const data = await response.json();
      guestToken = data.token;
    } catch (error) {
      console.error('Failed to fetch Superset token:', error);
      return;
    }

    embedDashboard({
      id: this.dashboardId, // Use dynamic dashboardId
      supersetDomain: environment.supersetBaseUrl, // Use the environment variable for Superset base URL
      mountPoint: document.getElementById('dashboard-container')!,
      fetchGuestToken: async () => guestToken,

      dashboardUiConfig: {
        hideTitle: true, // Hide the main dashboard title
        hideTab: true,
        urlParams: {
          project_id: 16,
        },
      },
    }).catch((error) => {
      console.error('Failed to embed dashboard:', error);
    });
  }
}
