require 'test_helper'

class CreateCategoriesTest < ActionDispatch::IntegrationTest

  def setup
    @user = User.create(username: 'mark', email: 'mdstevens94@gmail.com', password: 'Swimmer12', admin: true)
  end

  test 'get new category form and create category' do
    sign_in_as(@user, 'Swimmer12')
    get new_category_path
    assert_template 'categories/new'
    assert_difference 'Category.count', 1 do
      post categories_path,
           params: {category: { name: 'sports' } }
      follow_redirect!
    end
    assert_template :index
    assert_match 'sports', response.body
  end

  test 'invalid category submission results in failure' do
    sign_in_as(@user, 'Swimmer12')
    get new_category_path
    assert_template 'categories/new'
    assert_no_difference 'Category.count' do
      post categories_path,
           params: {category: { name: '' } }
    end
    assert_template :new
    assert_select '.form-error-messages'
  end
end