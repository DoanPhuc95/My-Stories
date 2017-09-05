module Serializers
  module Stories
    class StorySerializer < Serializers::SupportSerializer
      attrs :id, :name, :description, :total_vote, :is_public, :category_id
      attrs :due_date, :user_id, :created_at, :updated_at, :picture, :user_name
      attrs :steps, :comments, :users_voted, :cloners, :avatar

      delegate :id, to: :object
      def steps
        Serializers::Steps::StepSerializer
          .new(object: object.steps).serializer
      end

      def comments
        Serializers::Comments::CommentSerializer
          .new(object: object.comments).serializer
      end

      def users_voted
        User.find_users_votes object.id, object.class
      end

      def user_name
        object.user.name
      end

      def cloners
        Serializers::Users::UserMinForClonerSerializer
          .new(object: object.cloners).serializer
      end

      def avatar
        object.user.avatar
      end
    end
  end
end
