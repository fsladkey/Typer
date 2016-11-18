class CreateTextFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :text_files do |t|
      t.text :text, null: false
      t.string :title, null: false
      t.string :language
      t.timestamps
    end
  end
end
