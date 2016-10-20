class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(whitelisted_user_params)
    if @user.save
      flash[:notice] = "Welcome to the apologetics blog #{@user.username}"
      redirect_to articles_path
    else
      render 'new'
    end
  end

  def show
  end

  private
  def whitelisted_user_params
    params.require(:user).permit(:username, :email, :password)
  end
end
