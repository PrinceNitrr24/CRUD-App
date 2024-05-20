const express = require("express");
const app = express();
const path = require("path");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {
  let { name, email, imageUrl } = req.body;
  await userModel.create({
    name,
    email,
    imageUrl,
  });
  res.redirect("/read");
});

app.get("/read", async (req, res) => {
  const users = await userModel.find();
  res.render("read", { users });
});

app.get("/delete/:id", async (req, res) => {
  let deletedUser = await userModel.findOneAndDelete({ _id: req.params.id });
  res.redirect("/read");
});

app.get("/edit/:id", async (req, res) => {
  let user = await userModel.findOne({ _id: req.params.id });
  res.render("edit", { user });
});

app.post("/update/:userid", async (req, res) => {
  let { imageUrl, name, email } = req.body;
  let updateUser = await userModel.findOneAndUpdate(
    { _id: req.params.userid },
    { imageUrl, name, email },
    { new: true }
  );
  res.redirect("/read");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
