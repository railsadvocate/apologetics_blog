class UsersController < ApplicationController

  before_action :get_user_from_params, only: [:show, :edit, :update, :destroy]

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

  def edit
  end

  def update
    if @user.update(whitelisted_user_params)
      flash[:notice] = "Your account was successfully updated"
      redirect_to articles_path
    else
      render 'edit'
    end
  end

  private
  def whitelisted_user_params
    params.require(:user).permit(:username, :email, :password)
  end

  def get_user_from_params
    @user = User.find(params[:id])
  end
end
