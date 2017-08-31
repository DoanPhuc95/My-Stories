import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-step-thumbnail',
  templateUrl: './step-thumbnail.component.html',
  styleUrls: ['./step-thumbnail.component.scss']
})
export class StepThumbnailComponent {
  @Input() step: any;
}
