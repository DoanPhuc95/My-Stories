root "pages#show", page: "home"
get "pages/:page", to: "pages#show", as: "page"
resources :stories, except: :destroy
resources :searches, only: :index
resources :autocomplete, only: :index, format: :json
resources :votes, only: [:create, :destroy]
