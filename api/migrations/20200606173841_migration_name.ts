import * as Knex from "knex"

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("id")
    table.string("name", 255).notNullable()
    table.string("state", 64).notNullable()
    table.string("group", 128).notNullable()
    table.string("reference_id", 128).notNullable()
    table.json("metadata").notNullable()
    table.dateTime("created_at").notNullable()
    table.dateTime("updated_at")
  })
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable("tasks")
}
