class Comment < ActiveRecord::Base
  belongs_to :article

  validates :text, presence: true,
                   length: {in: 5..100}

end
