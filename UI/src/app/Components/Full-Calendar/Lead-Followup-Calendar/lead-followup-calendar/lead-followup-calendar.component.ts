import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
  DatesSetArg,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { LeadFollowupService } from 'src/app/Services/Presales/Leads/lead-followup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/Models/User/User';

@Component({
  selector: 'app-lead-followup-calendar',
  templateUrl: './lead-followup-calendar.component.html',
  styleUrls: ['./lead-followup-calendar.component.css'],
})
export class LeadFollowupCalendarComponent implements OnInit {
  start: any;
  end: any;
  userRole: any;
  user: User = new User();
  mainUser: User = new User();
  userId: any;
  @Input() isMemberDashBoard?: boolean = false; // Optional Input with default value
  @Input() isManagerDashBoard?: boolean = false; // Optional Input with default value
  @Input() isSalesHeadDashboard?: boolean = false; // Optional Input with default value
  @Input() expried?:any


  ngOnInit() {
    console.log(this.isMemberDashBoard);
    console.log(this.isManagerDashBoard);
    console.log(this.isSalesHeadDashboard);
    console.log(this.expried)
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');

    if (user) {
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.userId = this.user.userId;
    }
    if (MainUser) {
      this.mainUser = JSON.parse(MainUser);
      //this.userId = this.mainUser.userId;
    }
  }
  
  constructor(
    private leadFollowService: LeadFollowupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  events: any = [];
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    timeZone: 'local',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    dayCellClassNames: (arg) => {
      const today = new Date();
      const cellDate = arg.date;

      if (cellDate > today) {
        return ['fc-day-disabled']; // Add a custom class to future dates
      }
      return [];
    },
    
    events: this.events,
    // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    datesSet: this.handleDatesSet.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  handleDatesSet(datesSetInfo: DatesSetArg) {
    console.log(datesSetInfo.view.currentStart.toISOString());
    console.log(datesSetInfo.view.currentEnd.toISOString());
    this.start = datesSetInfo.view.currentStart.toISOString();
      // Set `this.end` to the current date
  const currentDate = new Date();
 
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(currentDate.getTime() + istOffset);
  
  // Convert to ISO string and replace 'Z' (UTC indicator) with IST timezone offset
  const isoString = istDate.toISOString();
  this.end = isoString
    //this.end = datesSetInfo.view.currentEnd.toISOString();
    console.log(this.start);
    console.log(this.end);
    this.getLeadFollowEvents();
    // this.calendarOptions.visibleRange = {
    //   start: this.start,
    //   end: this.end,
    // };
  }

  handleDateSelect(selectInfo: DateSelectArg) {}
  navigateToFollowups(value?: any) {}

  handleEventClick(clickInfo: EventClickArg) {
    console.log(this.isMemberDashBoard);
    console.log(this.isManagerDashBoard);
    console.log(this.isSalesHeadDashboard);
    console.log(clickInfo.event.extendedProps);
    console.log(clickInfo.event.extendedProps['followUpIds']);
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/dashboard/followups/PST'
      : 'layout/sales/dashboard/followups/ST';

    this.router.navigate([route], {
      state: {
        followupIds: clickInfo.event.extendedProps['followUpIds'],
        isMemberDashBoard: this.isMemberDashBoard,
        isManagerDashBoard: this.isManagerDashBoard,
        isSalesHeadDashboard: this.isSalesHeadDashboard,
         expried:this.expried
      },
    });
  }

  handleEvents(events: EventApi[]) {}

  getLeadFollowEvents() {
    this.leadFollowService
      .fetchLeadFollowEvents(this.start, this.end, this.userId,this.expried)
      .subscribe({
        next: (response) => {
          this.events = response;
          this.calendarOptions.events = this.events;
        },
        error: (error) => {
          console.error('Error fetching team wise data:', error);
        },
      });
  }
    ngOnChanges(changes: SimpleChanges): void {
    if (changes['expried']) {
      console.log('CHANGED:', changes['expried'].currentValue);
      // Call your logic here, like re-fetching events
      this.getLeadFollowEvents();
    }
  }
  
}
