Rails.application.routes.draw do
  root to: "text_files#index"
  resources :text_files
end
