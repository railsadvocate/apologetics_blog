class ArticlesController < ApplicationController
  before_action :set_article, only: [:edit, :update, :show, :destroy]
  before_action :require_user, except: [:index, :show]
  before_action :require_same_user, only: [:edit, :update, :destroy]
  before_action :strip_html_tags, only: [:create, :update]

  def index
    @articles = Article.paginate(page: params[:page], per_page: 5)
    @comment = Comment.new
  end

  def new
    @article = Article.new
  end

  def edit
  end

  def create
    @article = Article.new(article_params)
    @article.user = current_user
    #@article.user = User.first
    if @article.save
      flash[:notice] = 'Article was successfully created!'
      redirect_to article_path(@article)
    else
      render 'new'
    end
  end

  def show
  end

  def destroy
    @article.destroy
    @articles = Article.all
    respond_to do |format|
      format.html { redirect_to articles_path }
      format.json { head :no_content }
      format.js   { render :layout => false }
   end
  end

  def update
    if @article.update(article_params)
      flash[:notice] = 'Article was successfully updated'
      redirect_to article_path(@article)
    else
      render 'edit'
    end
  end

  private
    def set_article
      @article = Article.find(params[:id])
    end
    def article_params
      params.require(:article).permit(:title, :short_description, :description)
    end

    def strip_html_tags

    end
end
