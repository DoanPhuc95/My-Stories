import { Component } from '@angular/core';

@Component({
  selector: 'app-story',
  template: `
    <div class="hdd">
    <router-outlet></router-outlet>
    </div>`,
  styles: [`
    .hdd {
      height: 100vh;
      background-size: cover;
    }
  `],
  providers: [ ]

})
export class StoryComponent {

  constructor() {}
}
