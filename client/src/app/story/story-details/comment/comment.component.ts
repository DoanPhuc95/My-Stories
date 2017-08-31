import { Component, OnInit, Input } from '@angular/core';
import { IComment } from '../../shared/story.model';
import { CommentService } from './comment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  providers: [CommentService]
})

export class CommentComponent implements OnInit {
  current_user: any;
  commentForm: FormGroup;
  packageCommentForm: FormGroup;
  @Input() comments: IComment[];
  @Input() commentable_id: number;
  @Input() story_id: number;
  @Input() commentable_type: string;
  @Input() user_of_story: number;

  constructor(private commentService: CommentService, private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.current_user = JSON.parse(localStorage.getItem('currentUser'));
    this.createForm();
  }

  avatar(i: number): string {
    const avatar = this.comments[i].avatar;
    if (avatar.url) {
      return avatar.url;
    }
    return '../../../assets/picture/no-avatar.jpg';
  }

  createForm() {
    this.packageCommentForm = this.formbuilder.group({
      comment: this.commentForm = this.formbuilder.group({
        content: ['', Validators.required]
      })
    });
  }

  resetForm() {
    this.commentForm.controls['content'].setValue('');
  }

  onSubmit() {
    const now = new Date();
    const comment = {
      commentable_id: this.commentable_id,
      commentable_type: this.commentable_type,
      content: this.commentForm.controls['content'].value,
      created_at: now.toString(),
      user_name: this.current_user.name,
      user_id: this.current_user.id,
      avatar: {
        url: '../../../assets/picture/no-avatar.jpg'
      }
    };
    this.sendComment(comment, this.packageCommentForm);
    this.comments.push(comment);
    this.resetForm();
  }

  onSuccess(response, cmt: IComment) {
    if (response) {
      const res = JSON.parse(response._body);
      const comment = <IComment>res.data.comment;
      cmt.id = comment.id;
      cmt.avatar.url = comment.avatar.url;
    }
  }

  sendComment(cmt, form) {
    if (this.commentable_type === 'story') {
      this.commentService.postCommentStory(form.value, this.commentable_id,
        this.current_user.token).subscribe(response => this.onSuccess(response, cmt),
        response => this.onError(response));
    } else {
      this.commentService.postCommentStep(form.value, this.story_id ,
        this.commentable_id, this.current_user.token).subscribe(
        response => this.onSuccess(response, cmt), response => this.onError(response));
    }
  }

  onError(response) {
    if (response) {
      const cmt_div = '#cmt_' + (this.comments.length - 1);
      const user = '#user_' + (this.comments.length - 1);
      const resendbtn = '#resend_' + (this.comments.length - 1);
      $(cmt_div).addClass('unsendable');
      $(user).addClass('unsendable');
      $(resendbtn).fadeIn();
    }
  }

  resend(cmt_id: number) {
    const cmt = this.comments[cmt_id];
    const resendForm = this.formbuilder.group({
      comment: this.formbuilder.group({
        content: cmt.content
      })
    });
    this.sendComment(cmt, resendForm);
    const cmt_div = '#cmt_' + cmt_id;
    const user = '#user_' + cmt_id;
    const resendbtn = '#resend_' + cmt_id;
    $(cmt_div).removeClass('unsendable');
    $(user).removeClass('unsendable');
    $(resendbtn).fadeOut();
  }

  canComment(): boolean {
    return !!this.current_user;
  }

  canDropdown(id: number) {
    if (this.current_user) {
      return this.canDelete(id) || this.canEdit(id);
    }
    return false;
  }

  canEdit(user_id: number): boolean {
    return user_id === this.current_user.id;
  }

  canDelete(user_id: number): boolean {
    return this.user_of_story === this.current_user.id || user_id === this.current_user.id;
  }

  edit(e, id: number) {
    e.preventDefault();
    const p_card = '#cmt_' + id;
    const input_card = '#cmt_input_' + id;
    const cmt_content = document.getElementById('cmt_' + id).innerHTML;
    document.getElementById('cmt_input_' + id).setAttribute("value", cmt_content);
    $(p_card).fadeOut();
    $(input_card).fadeIn();
  }

  checkEsc(e, id_card: number, id: number) {
    const p_card = '#cmt_' + id_card;
    const input_card = '#cmt_input_' + id_card;
    switch (e.keyCode) {
      case 13: {
        const cmt_content = $(input_card).val();
        const value = {
          comment: {
            content: cmt_content
          }
        };
        if (this.commentable_type === 'story') {
          this.commentService.editCommentStory(value, this.commentable_id,
            this.current_user.token, id).subscribe(response => this.editCommentSuccess(response));
        } else {
          this.commentService.editCommentStep(value, this.story_id ,
            this.commentable_id, this.current_user.token, id).subscribe(
            response => this.editCommentSuccess(response)
          );
        }
      }

      case 27: {
        console.log("esc is catured");
        $(input_card).fadeOut();
        $(p_card).fadeIn();
        return;
      }
    }
  }

  editCommentSuccess(response) {
    if (response.status === 200) {
      const cmt = JSON.parse(response._body).data.comment;
      const comment = this.comments.find(comment => comment.id === cmt.id);
      comment.content = cmt.content;
    }
  }

  delete(e, id: number) {
    e.preventDefault();
    if (this.commentable_type === 'story') {
      this.commentService.deleteCommentStory(id, this.current_user.token, this.story_id).
        subscribe(response => this.deleteElement(id));
    } else {
      this.commentService.deleteCommentStep(id, this.current_user.token, this.story_id,
        this.commentable_id).subscribe(response => this.deleteElement(id));
    }
  }

  deleteElement(id) {
    this.comments = this.comments.filter(function (comment) {
      return comment.id !== id;
    });
  }
}
