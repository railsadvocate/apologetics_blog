class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_filter :get_user_if_session

  private
  def get_user_if_session
    @user = User.find_by(id: session[:user_id])
  end
end
