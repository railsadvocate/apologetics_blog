class CreateArticles < ActiveRecord::Migration[5.0]
  def up
    create_table :articles do |t|
      t.string :title
    end
  end

  def down
    drop_table :articles
  end
end
