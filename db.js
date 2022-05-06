const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./data.db",
  },
  useNullAsDefault: true,
});

async function init() {
  try {
    await knex.schema.createTable("flags", (table) => {
      table.increments("id").primary();
      table.string("flag");
      table.boolean("is_deleted").defaultTo(false);
    });

    let flags = require("fs").readFileSync("flags.txt", "utf8").split("\n");
    flags.unshift(
      process.env.FLAG ? process.env.FLAG.toString() : "FLAG_NOT_SET"
    );

    for (const flag of flags) {
      await knex("flags").insert({
        flag,
      });
    }

    await knex("flags").where("flag", process.env.FLAG).update({
      is_deleted: true,
    });
  } catch {
  } finally {
    knex.destroy(() => {
      console.log("bye");
    });
  }
}

async function getFlag() {
  const flagsCount = await knex("flags")
    .where({
      is_deleted: false,
    })
    .count("id as count");

  const random = Math.floor(Math.random() * flagsCount[0].count);
  const flag = await knex("flags")
    .where({
      is_deleted: false,
    })
    .select("flag")
    .offset(random)
    .first();
  return flag.flag;
}

module.exports = {
  init,
  getFlag,
};
