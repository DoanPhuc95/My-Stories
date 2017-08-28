module Serializers
  module Comments
    class CommentSerializer < Serializers::SupportSerializer
      attrs :id, :user_id, :commentable_id, :commentable_type, :content
      attrs :user_name, :avatar, :created_at, :updated_at

      def user_name
        object.user.name
      end

      def avatar
        object.user.avatar
      end
    end
  end
end
