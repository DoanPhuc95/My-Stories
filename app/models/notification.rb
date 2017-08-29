class Notification < ApplicationRecord
  belongs_to :notificationable, polymorphic: true

  lambda_find_notification = lambda do |recipient_id|
    where recipient_id: recipient_id
  end

  scope :find_notification, lambda_find_notification
end
