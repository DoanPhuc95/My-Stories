import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Ng2Cable, Broadcaster } from 'ng2-cable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private current_user;

  constructor(private translate: TranslateService, private ng2cable: Ng2Cable,
    private broadcaster: Broadcaster, public toastr: ToastsManager, vcr: ViewContainerRef) {
    translate.addLangs(['en', 'jp']);
    translate.setDefaultLang('en');
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser')) {
      this.current_user = JSON.parse(localStorage.getItem('currentUser'));
      if (!sessionStorage.getItem('user_id')) {
        sessionStorage.setItem('user_id', this.current_user.id);
      }
      this.ng2cable.subscribe('https://ng2-cable-example.herokuapp.com/cable', 'ChatChannel');
      this.broadcaster.on<string>('CreateMessage').subscribe(
        message => {
          const noti = <any>message;
          const mes = 'You have notify from ' + noti.sender;
          this.toastr.custom(mes);
        }
      ); 
    }
  }
}
