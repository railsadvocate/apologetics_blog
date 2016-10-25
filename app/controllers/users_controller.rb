class UsersController < ApplicationController

  before_action :get_user_from_params, only: [:show, :edit, :update, :destroy]

  def index
    @users = User.paginate(page: params[:page], per_page: 5)
  end

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
    @articles = @user.articles.paginate(per_page: 5, page: params[:page])
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
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end

  def get_user_from_params
    @user = User.find(params[:id])
  end
end
