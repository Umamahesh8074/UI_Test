import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayHolidayComponent } from 'src/app/Components/Leave/Holiday/display-holiday/display-holiday.component';
import { HolidayComponent } from 'src/app/Components/Leave/Holiday/holiday/holiday.component';
import { AddTeamLeavesComponent } from 'src/app/Components/Leave/LeaveRequest/My Team Leaves/add-team-leaves/add-team-leaves.component';
import { DisplayTeamLeavesComponent } from 'src/app/Components/Leave/LeaveRequest/My Team Leaves/display-team-leaves/display-team-leaves.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    // DisplayHolidayComponent,
    // HolidayComponent,
    // DisplayLeaveRequestComponent,
    // LeaveRequestComponent,
    // AddTeamLeavesComponent,
    // DisplayTeamLeavesComponent,
  ],
  imports: [CommonModule],
})
export class LeaveModule {}
