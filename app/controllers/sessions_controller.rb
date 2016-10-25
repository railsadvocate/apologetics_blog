class SessionsController < ApplicationController

  before_action :require_not_logged_in_user, only: [:new]

  def new
  end

  def create
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      session[:user_id] = user.id
      flash[:success] = "#{user.username} signed in successfully"
      redirect_to user_path(user)
    else
      flash.now[:danger] = "There was something wrong with your login information"
      render 'new'
    end
  end

  def destroy
    session[:user_id] = nil
    flash[:success] = "You have successfully logged out"
    redirect_to root_path
  end

  private
  def require_not_logged_in_user
    if logged_in?
      redirect_to user_path(current_user)
    end
  end
end
