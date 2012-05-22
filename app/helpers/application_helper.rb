module ApplicationHelper
  
  #
  # Shortcut to display a spinner image tag
  #
  def spinner
    image_tag('wait.gif', :class => 'spinner', :alt => "Please wait...")
  end
  
end
