
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.css']
})
export class StatusCardComponent implements OnInit {
  @Input() title: string = '';
  @Input() value: number =0;
  @Input() subtitle: string = '';
  @Input() icon: string = '';

  userCount: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserCount().subscribe((count) => {
      this.userCount = count;
    });
  }
}