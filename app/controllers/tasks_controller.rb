# coding: utf-8

class TasksController < ApplicationController
  
  layout false, :except => [:index]
  
  before_filter :only_allow_xml_http_requests, :except => [:index]
  
  
  
  
  #
  # Methods that are always accessible
  #
  public
  
  
  #
  # Tasks list
  #
  def index
  end
  
  
  #
  # Tasks list
  #
  def list
  end
  
  
  #
  # Form for a new task
  #
  def new
    @task = Task.new
  end
  
  
  #
  # Create a new task
  #
  def create
    @task = Task.new(params[:task])
    
    if @task.save
      
      #
      # Move down all other items by 1
      #
      for task in Task.open_tasks do
        unless task == @task
          task.position += 1
          task.save
        end
      end
      
      flash[:success] = "New task successfully saved"
      render :text => ''
      
    else
      render 'new' and return
    end
  end
  
  
  #
  # Remove a task
  #
  def delete
    task = Task.find(params[:id])
    
    if task.delete
      render :text => 'true'
      
    else
      flash[:error] = "Task could not be deleted"
      render 'index'
    end
  end
  
  
  #
  # Mark a task as completed
  #
  def done
    task = Task.find(params[:id])
    
    task.status = 'complete'
    
    if task.save
      render :text => 'true'
      
    else
      flash[:error] = "Task could not be deleted"
      render 'index'
    end
  end
  
  
  #
  # Move up task priority
  #
  def up
    task = Task.find(params[:id])
    tasks = Task.open_tasks.order("position ASC")
    
    if tasks.index(task) == 0
      flash[:error] = "Can't move up first task"
      render 'index'
      
    else
      task.position = tasks.index(task) - 1
    
      if task.save and Task.open_tasks.each { |t|
        if tasks.index(t) == task.position and t != task
          t.position = tasks.index(t) + 1
          t.save
        elsif t != task
          t.position = tasks.index(t)
          t.save
        end
      }
        render :text => 'true'
      
      else
        flash[:error] = "Error while moving up task"
        render 'index'
      end
    end
  end
  
  
  #
  # Move down task priority
  #
  def down
    task = Task.find(params[:id])
    tasks = Task.open_tasks.order("position ASC")
    
    if tasks.index(task) == tasks.index(tasks.last)
      flash[:error] = "Can't move down last task"
      render 'index'
      
    else
      task.position = tasks.index(task) + 1
    
      if task.save and Task.open_tasks.each { |t|
        if tasks.index(t) == task.position and t != task
          t.position = tasks.index(t) - 1
          t.save
        elsif t != task
          t.position = tasks.index(t)
          t.save
        end
      }
        render :text => 'true'
      
      else
        flash[:error] = "Error while moving up task"
        render 'index'
      end
    end
  end
  
  
  #
  # Update the task description
  #
  def description
    task = Task.find(params[:id])
    
    task.description = params[:description]
    
    if task.save
      render :text => ''
      
    else
      render :text => 'false'
    end
  end
  
  
  
  
  #
  # Methods that are only used internally in this class
  #
  private
  
  
  #
  # Redirect to index if Ajax methods are not accessed via XMLHttpRequest
  # (Example case: user copies URL of an Ajax form action into the browser address bar)
  #
  def only_allow_xml_http_requests
    unless request.xhr?
      redirect_to '/'
    end
  end
  
end