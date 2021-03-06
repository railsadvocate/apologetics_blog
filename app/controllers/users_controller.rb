class UsersController < ApplicationController

  before_action :get_user_from_params, only: [:show, :edit, :update, :destroy]
  before_action :require_same_user, only: [:edit, :update]
  before_action :require_not_logged_in_user, only: [:new]

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
      session[:user_id] = @user.id
      redirect_to user_path(@user)
    else
      render 'new'
    end
  end

  def show
    @articles = @user.articles.paginate(per_page: 5, page: params[:page])
    @comment = Comment.new
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
  def require_not_logged_in_user
    if logged_in?
      redirect_to user_path(current_user)
    end
  end

  def require_same_user
    if !logged_in? || current_user != @user
      flash[:danger] = "You can only edit your own account"
      redirect_to articles_path
    end
  end

  def whitelisted_user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end

  def get_user_from_params
    @user = User.find(params[:id])
  end
end
