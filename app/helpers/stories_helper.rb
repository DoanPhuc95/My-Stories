module StoriesHelper
  def is_voted?
    Vote.find_by user: current_user, voteable: @story
  end

  def vote_count
    @story.votes.count
  end
end
