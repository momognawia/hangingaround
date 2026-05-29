import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="page-content"><h2>Événement</h2><p>Coming soon…</p></div>`,
})
export class EventDetailComponent {}
