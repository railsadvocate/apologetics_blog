require 'test_helper'

class CategoryTest < ActiveSupport::TestCase

  # runs before any of the tests
  def setup
    @category = Category.new(name: 'sports')
  end

  test 'category should be valid' do
    assert @category.valid?
  end

  test 'name should be present' do
    @category.name = ' '
    assert_not @category.valid?
  end

  test 'name should be unique' do
    @category.save
    category2 = Category.new(name: 'sports')
    assert_not category2.valid?
  end

  test 'name should not be too long' do
    @category.name = 'a' * 26
    assert_not @category.valid?
  end

  test 'name should not be too short' do
    @category.name = 'aa'
    assert_not @category.valid?
  end

  test 'name is minimum acceptable length' do
    @category.name = 'aaa'
    assert @category.valid?
  end

  test 'name is maximum acceptable length' do
    @category.name = 'a' * 25
    assert @category.valid?
  end

end