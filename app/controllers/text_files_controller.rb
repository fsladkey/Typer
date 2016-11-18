class TextFilesController < ApplicationController

  def index
    @text_files = TextFile.all
  end

  def show
    @text_file = TextFile.find(params[:id])
  end

end
