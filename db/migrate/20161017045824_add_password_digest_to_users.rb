class AddPasswordDigestToUsers < ActiveRecord::Migration[5.0]
  def up
    add_column :users, :password_digest, :string
  end

  def down
  end
end
