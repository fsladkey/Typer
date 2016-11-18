TextFile.destroy_all
TextFile.create!(
  title: "Ruby Dog Class",
  text: File.read("#{Rails.root}/db/files/ruby_file.rb"),
  language: "Ruby"
)
TextFile.create!(
  title: "Jbuilder Template Class",
  text: File.read("#{Rails.root}/db/files/jbuilder.rb"),
  language: "Ruby"
)

TextFile.create!(
  title: "Javascript Dog Class",
  text: File.read("#{Rails.root}/db/files/js_file.js"),
  language: "Javascript"
)

TextFile.create!(
  title: "Skinny Redux",
  text: File.read("#{Rails.root}/db/files/skinny_redux.js"),
  language: "Javascript"
)

TextFile.create!(
  title: "Python Dog Class",
  text: File.read("#{Rails.root}/db/files/python_file.py"),
  language: "Python"
)

TextFile.create!(
  title: "Flask Templating",
  text: File.read("#{Rails.root}/db/files/flask_templates.py"),
  language: "Python"
)
