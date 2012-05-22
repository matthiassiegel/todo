class Task < ActiveRecord::Base
  
  attr_accessible :name, :description
  
  validates_presence_of :name
  
  
  def self.open_tasks
    Task.where(:status => 'open')
  end
  
  def self.completed_tasks
    Task.where(:status => 'complete')
  end
  
end
