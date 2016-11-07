class CommentsController < ApplicationController

  def create
    if !logged_in?
      flash[:danger] = "You must be logged in to perform that action"
      redirect_to articles_path
    else
      @article = Article.find(params[:article_id])
      @comment = Comment.new(get_comment)
      @comment.article = @article
      @comment.user = current_user
      @articles = Article.all
      @comment.save
      respond_to do |format|
        format.html { redirect_to articles_path }
        format.json { head :no_content }
        format.js   { render layout: false }
     end
   end
  end

  def update
    @article = Article.find(params[:article_id])
    @comment = Comment.find(params[:id])
    if !logged_in? || current_user.username != @comment.user.username
      debugger
      flash[:danger] = "You must be logged in to perform that action"
      redirect_to articles_path
    else
      @comment.update(get_comment)
      respond_to do |format|
        format.html { redirect_to articles_path }
        format.json { head no_content }
        format.js { render layout: false}
      end
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @article = Article.find(params[:article_id])
    @articles = Article.all
    @comment_id = @comment.id
    @comment.destroy
    respond_to do |format|
      format.html { redirect_to articles_path(@articles) }
      format.json { head :no_content }
      format.js { render layout: false }
    end
  end

  private
  def get_comment
    params.require(:comment).permit(:text)
  end

end
