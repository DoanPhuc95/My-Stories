import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IStory } from '../shared/story.model';
import { StoryResolverService } from '../shared/story-resolver.service';
import { VoteService } from './vote.service';
import * as $ from 'jquery';
import { IMG_URL } from '../../constants';
import { TranslateService } from 'ng2-translate';
import { MdSnackBar, MdDialog } from '@angular/material';
import { EditStoryComponent } from './edit/edit.component';
import { StoryService } from '../shared/story.service';
import { FollowService } from '../shared/follow-story.server';

@Component({
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss'],
  providers: [StoryResolverService, VoteService, StoryService, FollowService, MdSnackBar]
})

export class StoryDetailsComponent implements OnInit {

  story: IStory;
  image_url = IMG_URL;
  current_user: any;
  status_follow: any;
  public follow_title: String;
  commentMapping:
  { [k: string]: string } = {
    '=1': '# ' + this.translate.instant('single_story.comment'),
    'other': '# ' + this.translate.instant('single_story.comments')
  };
  voteMapping:
  { [k: string]: string } = {
    '=1': '# ' + this.translate.instant('single_story.vote'),
    'other': '# ' + this.translate.instant('single_story.votes')
  };

  constructor(private route: ActivatedRoute, private voteService: VoteService,
    private translate: TranslateService, private dialog: MdDialog, private snackBar: MdSnackBar,
    private storyservice: StoryService, private followService: FollowService, private _router: Router) {
  }

  ngOnInit() {
    this.story = this.route.snapshot.data['story'];
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.checkVoted();
    if (this.current_user) {
      this.storyservice.getFollow(this.story.id, this.current_user.token).subscribe(
        response => this.setStatusFollow(response));
    }
  }

  setStatusFollow(response) {
    this.status_follow = response;
    this.setTitleFollow();
  }

  setTitleFollow() {
    if (!this.status_follow) {
      this.follow_title = this.translate.instant('single_story.follow');
    } else {
      this.follow_title = this.translate.instant('single_story.unfollow');
    }
  }

  checkImageExist() {
    return !!this.story.picture;
  }

  onComment() {
    if (!this.current_user) {
      this.snackBar.open(this.translate.instant('single_story.notloggedin'), '', {
        duration: 5000
      });
      return;
    }
    window.scroll(0, window.innerHeight);
    $('#cmt_target').focus();
  }

  onVote() {
    if (this.current_user) {
      this.voteService.voteStory(this.story.id, this.current_user.token).subscribe(
        response => this.onVoteSuccess(response));
    } else {
      this.snackBar.open(this.translate.instant('single_story.notloggedin'), '', {
        duration: 5000
      });
    }
  }

  onVoteSuccess(response) {
    if (response) {
      const total_vote = JSON.parse(response._body).data.total_vote;
      this.story.total_vote = total_vote.total_vote;
      if ($('#heart').hasClass('voted')) {
        $('#heart').removeClass('voted');
      } else {
        $('#heart').addClass('voted');
      }
    }
  }

  checkVoted() {
    if (this.story.users_voted === null) {
      this.story.users_voted = [];
    };
    const user_voted = this.story.users_voted;

    if (user_voted === null) {
      return;
    };

    if (this.current_user) {
      if (user_voted.find(user => user.id === this.current_user.id)) {
        $('#heart').addClass('voted');
      } else {
        $('#heart').removeClass('voted');
      }
    }
  }

  edit() {
    const height = 649;
    const width = 800;

    const dialogRef = this.dialog.open(EditStoryComponent, {
      height: height + 'px',
      width: width + 'px'
    });
    dialogRef.componentInstance.story = this.story;
  }

  delete() {
    this.storyservice.deleteStory(this.story.id, this.current_user.token).
      subscribe(response => this.onDeleteSuccess(response),
      response => this.onDeleteError());
  }

  onDeleteSuccess(response) {
    if (response) {
      this._router.navigate(['/']);
    }
  }

  onDeleteError() {
    this.snackBar.open(this.translate.instant('single_story.deleteerror'), '', {
      duration: 5000
    });
  }

  onCloneButtom(id_story: number) {
    if (this.current_user) {
      this.storyservice.cloneStory(id_story, this.current_user.token).
        subscribe(response => this.onCloneSuccess())
    } else {
      this.snackBar.open(this.translate.instant('single_story.notloggedin'), '', {
        duration: 5000
      });
    }
  }

  onCloneSuccess() {
    let snackBarRef = this.snackBar.open(this.translate.instant('single_story.clonesuccess'), '', {
      duration: 2000
    });
    snackBarRef.onAction().subscribe(() => {
      this._router.navigate(['/user']);
    });
  }

  onButtomFollow(id: number) {
    if (this.current_user) {
      if (this.status_follow === false) {
        this.followStory(id);
      } else {
        this.unfollowstory(id);
      }
    } else {
      this.snackBar.open(this.translate.instant('single_story.notloggedin'), '', {
        duration: 5000
      });
    }
  }

  followStory(id: number) {
    this.followService.createFollow(id, this.current_user.token).
      subscribe(response => this.follow_toggle_success(response));
  }

  follow_toggle_success(response) {
    if (this.status_follow === false) {
      this.status_follow = response.data.id;
    } else {
      this.status_follow = false;
    }
    this.setTitleFollow();
  }

  unfollowstory(id: number) {
    this.followService.destroyFollow(this.status_follow, id, this.current_user.token).
      subscribe(response => this.follow_toggle_success(response));
  }

  showEditDialog(): boolean {
    if (this.current_user) {
      return this.story.user_id === this.current_user.id;
    }
    return false;
  }
}
