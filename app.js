const { getFlag } = require("./db");

const app = require("express")();
app.use(require("cors")());

app.get("/flag", async (_, rs) => {
  const flag = await getFlag();
  return rs.send(flag);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
