class Comment < ActiveRecord::Base
  belongs_to :article
  belongs_to :user

  validates :text, presence: true,
                   length: {in: 1..100}

end
