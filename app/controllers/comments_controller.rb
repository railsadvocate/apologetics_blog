class CommentsController < ApplicationController

  def create
    @article = Article.find(params[:article_id])
    @comment = Comment.new(get_comment)
    @comment.article = @article
    @articles = Article.all
    @comment.save
    respond_to do |format|
      format.html { redirect_to articles_path }
      format.json { head :no_content }
      format.js   { render layout: false }
   end
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private
  def get_comment
    params.require(:comment).permit(:text)
  end

end
