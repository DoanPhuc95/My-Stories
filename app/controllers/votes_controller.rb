class VotesController < ApplicationController
  before_action :find_vote, only: :destroy

  def create
    @story = Story.find params[:story_id]
    @vote = Vote.new(user: current_user, voteable: @story)

    return unless @vote.save
    respond_to do |format|
      format.html{redirect_to :back}
      format.js
    end
  end

  def destroy
    @story = @vote.voteable

    return unless @vote.destroy
    respond_to do |format|
      format.html{redirect_to :back}
      format.js
    end
  end

  private

  def find_vote
    @vote = Vote.find params[:id]
  end
end
