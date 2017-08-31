import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'

@Injectable()
export class StoryService {
  private apiURL;
  constructor(private http: Http) {
    this.apiURL = URL + 'api/stories/';
  }

  getStories(): Observable<any> {
    const link = this.apiURL;
    return this.http.get(link).map(response => response.json());
  }
}
