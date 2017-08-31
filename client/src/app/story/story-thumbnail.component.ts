import { Component, Input } from '@angular/core';
import { IStory } from './shared/story.model';
import { IMG_URL } from '../constants';
import * as $ from 'jquery';

@Component({
  selector: 'app-story-thumbnail',
  templateUrl: './story-thumbnail.component.html',
  styleUrls: ['./story-thumbnail.component.scss']
})

export class StoryThumbnailComponent {
  @Input() story: IStory;

  checkExistPicture(): string {
    const picture = this.story.picture;
    const type = typeof(picture);
    if (picture) {
      if (type === 'string') {
        return IMG_URL + picture;
      }
      if (type === 'object' && picture.url) {
        return picture.url;
      }
    }
    return '/assets/picture/default_story.jpg';
  }

  user_avatar(): string {
    const avatar = this.story.avatar;
    if (avatar.url) {
      return avatar.url;
    }
    return '../../assets/picture/no-avatar.jpg';
  }

  description(): string {
    var description = this.story.description;
    if (description.length > 73) {
      description = description.substring(0, 69) + '...';
    }
    return description;
  }
}
