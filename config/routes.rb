Willywonga::Application.routes.draw do
  root to: 'home#index', :controller => 'home'
  match '/projects', to: 'home#projects', via: 'get'
  match '/about',    to: 'home#about',    via: 'get'
  match '/contact',  to: 'home#contact',  via: 'get'
  resources :writings
end
