class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.string :name
      t.text :description
      t.string :status, :default => 'open'
      t.integer :position, :default => 0

      t.timestamps
    end
  end
end