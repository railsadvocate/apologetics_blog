class AddShortDescriptionToArticles < ActiveRecord::Migration[5.0]
  def up
    add_column :articles, :short_description, :string
  end

  def down
    remove_column :articles, :short_description
  end
end
