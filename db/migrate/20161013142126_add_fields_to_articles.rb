class AddFieldsToArticles < ActiveRecord::Migration[5.0]
  def up
    add_column :articles, :description, :text
    add_column :articles, :updated_at, :datetime
    add_column :articles, :created_at, :datetime
  end

  def down
    remove_column :articles, :description, :text
    remove_column :articles, :updated_at, :datetime
    remove_column :articles, :created_at, :datetime
  end
end
