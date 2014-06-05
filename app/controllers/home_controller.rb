class HomeController < ApplicationController
  def index
  	@writings = Writing.all
  	@writing = Writing.new
  end

  def projects
  end

  def about
  end	 

  def contact
  end
end