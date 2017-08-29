class Api::V1::NotificationsController < Api::BaseController
  before_action :find_user, only: %i(index update)
  before_action :find_object, only: :update
  before_action :find_owner, only: :update

  def index
    @notifications = Notification.find_notification(user.id).reverse
    render json: {
      messages: I18n.t("messages.index_notifications_have_showed"),
      data: {notifications: notifications}
    }, status: :ok
  end

  def update
    if correct_user owner
      update_fail unless notification.update_attributes! read: true
      update_successfully
    else
      dont_have_permission
    end
  end

  private

  attr_reader :user, :notifications, :notification, :owner

  def find_owner
    @owner = User.find_by id: notification.recipient_id
  end

  def find_user
    @user = User.find_by id: params[:user_id]
    cant_find_user if user.blank?
  end

  def cant_find_user
    render json: {
      messages: I18n.t("notifications.cant_find_user")
    }, status: :unprocessable_entity
  end

  def dont_have_permission
    render json: {
      messages: I18n.t("notifications.dont_have_permission")
    }, status: :unprocessable_entity
  end

  def update_fail
    render json: {
      messages: I18n.t("notifications.update_fail")
    }, status: :unprocessable_entity
  end

  def update_successfully
    render json: {
      messages: I18n.t("notifications.update_successfully"),
      data: {notification: notification}
    }, status: :ok
  end
end
