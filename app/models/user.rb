class User < ActiveRecord::Base
  has_many :articles
  before_save { self.email = email.downcase }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates :username,
            :presence => true,
            :uniqueness => {case_sensitive: false},
            :length => {in: 3..25}

  validates :email,
            :presence => true,
            length: {in: 5..100},
            :uniqueness => {case_sensitive: false},
            :format => {:with => VALID_EMAIL_REGEX}

  has_secure_password
end
