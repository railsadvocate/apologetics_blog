Rails.application.routes.draw do

  get 'sessions/new'

  root 'pages#home'
  get 'about', :to => 'pages#about'

  get 'signup', to: 'users#new'

  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'

  resources :users, execept: [:new]
  resources :articles do
    resources :comments, except: [:index, :new, :show, :edit]
  end

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
