class CreateWritings < ActiveRecord::Migration
  def change
    create_table :writings do |t|
      t.string :title
      t.string :content
      t.string :date

      t.timestamps
    end
  end
end
