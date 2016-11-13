class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :current_user, :get_categories_for_navbar

  helper_method :current_user, :logged_in?, :require_admin

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def logged_in?
    !!current_user
  end

  def require_admin
    if !logged_in? || (logged_in? and !current_user.admin?)
      flash[:danger] = 'You are not permitted to perform that action'
      redirect_to categories_path || root_path
    end
  end

  def require_user
    if !logged_in?
      flash[:danger] = "You must be logged in to perform that action"
      redirect_to articles_path
    end
  end

  def get_categories_for_navbar
    @categories = Category.all
  end

  def require_same_user
    if current_user != @article.user
      flash[:danger] = "You can only edit or delete you own articles"
      redirect_to articles_path
    end
  end
end
