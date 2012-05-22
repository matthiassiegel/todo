Todo::Application.routes.draw do
  
  scope 'tasks' do
    match '/'                                   => 'tasks#list',                :via => :get
    match '/'                                   => 'tasks#create',              :via => :post
    match '/new'                                => 'tasks#new',                 :via => :get
    match '/:id'                                => 'tasks#delete',              :via => :delete
    match '/:id/done'                           => 'tasks#done',                :via => :get
    match '/:id/up'                             => 'tasks#up',                  :via => :get
    match '/:id/down'                           => 'tasks#down',                :via => :get
    match '/:id/description'                    => 'tasks#description',         :via => :post
  end
  
  root :to => 'tasks#index'
  
end
