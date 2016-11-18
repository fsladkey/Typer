class CreateScores < ActiveRecord::Migration[5.0]
  def change
    create_table :scores do |t|
      t.string :username
      t.integer :wpm
      t.integer :text_file_id, null: false
      t.timestamps
    end
  end
end
