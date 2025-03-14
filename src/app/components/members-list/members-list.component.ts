import { Component, Input } from '@angular/core';
import { Member } from '../../models/member.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent {
  @Input() members: Member[] = [];
}