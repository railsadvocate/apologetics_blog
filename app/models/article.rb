class Article < ActiveRecord::Base
    belongs_to :user
    has_many :comments
    validates :title, :presence => true, :length => { :minimum => 3, :maximum => 50 }
    validates :short_description, :presence => true, length: { in: 50..250 }
    validates :description, :presence => true, :length => { :minimum => 100, :maximum => 10000 }
    validates :user_id, :presence => true
end
