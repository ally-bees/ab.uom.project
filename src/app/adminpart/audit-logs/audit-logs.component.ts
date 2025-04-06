
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../pages/header/header.component';
import { SidebarComponent } from '../../pages/sidebar/sidebar.component';
import { FooterComponent } from "../../footer/footer.component";

interface LogEntry {
  action: string;
  user: string;
  timestamp: string;
  status: string;
}

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  logs: LogEntry[] = [
    {
      action: 'User Login',
      user: 'johnsmt@example.com',
      timestamp: '2024-12-28 10:30:00',
      status: 'Success'
    },
    {
      action: 'Permission Change',
      user: 'Admin',
      timestamp: '2024-12-28 10:30:00',
      status: 'Success'
    },
    {
      action: 'access assign',
      user: 'godzl@example.com',
      timestamp: '2024-12-28 10:30:00',
      status: 'Pending'
    }
  ];

  searchText: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  exportLogs(): void {
    // Implement export logs functionality
    console.log('Export logs clicked');
  }
}