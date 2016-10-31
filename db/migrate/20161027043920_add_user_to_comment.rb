class AddUserToComment < ActiveRecord::Migration[5.0]
  def change
    add_column :comments, :string, :user_id
  end
end
