import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';

@Component({
  selector: 'app-cpapprove',
  templateUrl: './cpapprove.component.html',
  styleUrls: ['./cpapprove.component.css'],
})
export class ChannelPartnerApproveComponent implements OnInit {
  destroy$ = new Subject<void>();
  CPData: any;
  remarks: string = '';
  isCpApproval: boolean = true;
  user = new User();
  isApprovel: boolean = true;

  constructor(
    public dialog: MatDialog,
    private commanService: CommanService,
    private router: Router,
    private channelPartnerRegisterService: ChannelPartnerRegisterService
  ) {
    // if (history.state.isApproval != undefined) {
    //   console.log(" entering to approveal   ",history.state.isApproval)
    //   this.isApprovel = history.state.isApproval;
    // }
    // if (history.state.channelPartnerData != undefined) {
    //   console.log("entering chenalpatnerdata" ,history.state.channelPartnerData);
    //   this.CPData = history.state.channelPartnerData[0];
    // }
  }

  ngOnInit(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
    }
    if (history.state.isApproval !== undefined) {
      console.log('Entering to approval:', history.state.isApproval);
      this.isApprovel = history.state.isApproval;
    }

    if (history.state.channelPartnerData !== undefined) {
      console.log(
        'Entering channelPartnerData:',
        history.state.channelPartnerData
      );
      // selectedId IS Channel Partner Id
      const selectedId = history.state.selectedId;

      if (selectedId) {
        this.channelPartnerRegisterService
          .getApprovalChannelPartners(
            0,
            1000,
            true,
            '',
            this.user.userId,
            '',
            selectedId
          )
          .subscribe({
            next: (response) => {
              console.log('Channel Partner data:', response);
              this.CPData = response.records[0];
            },
            error: (error) => {
              console.error('Error fetching channel partner:', error);
            },
          });
      }

      // this.CPData = history.state.channelPartnerData.find(
      //   (data: any) => data.id === selectedId
      // );

      // if (this.CPData) {
      //   console.log('Displaying data for selected ID:', this.CPData);
      // } else {
      //   console.log('No data found for the selected ID.');
      // }
    }
  }

  handleChannelPartnerApproval(status: string) {
    console.log('status ' + status);

    console.log(this.CPData.workFlowTypeId);
    this.commanService.openApprovalDialog(
      status,
      this.CPData.incidentId || '',
      this.CPData.workFlowTypeId || '',
      this.user.userId,
      this.isCpApproval,
      this.CPData.id
    );
  }
  closeForm(): void {
    this.router.navigate(['layout/presales/cp/approval/ACP'], {});
  }
  gotoViewApproval() {
    this.router.navigate(['layout/presales/view/cp/approvals/VCP'], {});
  }
}
