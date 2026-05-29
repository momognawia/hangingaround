import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-content"><h2>Mes conversations</h2><p>Coming soon…</p></div>`,
})
export class ChatListComponent {}
