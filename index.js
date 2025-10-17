const express = require("express");
const cookierParser = require("cookie-parser");
const app = express();
const port = 3000;
const Database = require("better-sqlite3");
const db = new Database("database.sqlite");
const bcrypt = require("bcrypt");

app.set("view engine", "ejs");

app.use(express.urlencoded());
app.use(express.json());
app.use(cookierParser());

isAuth = (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    return next();
  }
  res.redirect("/login");
};

isAdmin = (req, res, next) => {
  if (req.cookies && req.cookies.user && req.cookies.role === "admin") {
    return next();
  }
  if (req.cookies && req.cookies.user && req.cookies.role === "user") {
    return res.redirect("/home");
  }
  res.redirect("/login");
};

llamadaLogin = app.get("/", (req, res) => {
  //sql
  res.render("index", { title: "Mi super página", name: "Nombre" });
});

// gestion de la vista
app.get("/login", (req, res) => {
  res.render("login");
});

// gestion de los parametros post
app.post('/login', (req, res) => {
  const { user, password } = req.body
  console.log(req.body)

  const query = db.prepare('SELECT * FROM users WHERE username = ?')
  const foundUser = query.get(user)

  if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
    res.cookie("user", foundUser.username)
    res.cookie("role", foundUser.role)
    if (foundUser.role === "admin") {
      res.redirect("admin")
    } else {
      res.redirect("home")
    }
  } else {
    res.status(401).redirect("login")
  }
})

app.get("/admin", isAuth, isAdmin, (req, res) => {
  res.render("admin");
});

app.get("/home", isAuth, (req, res) => {
  res.render("home");
});

app.get("/logout", (req, res) => {
  res.clearCookie("role");
  res.clearCookie("user");
  res.redirect("login");
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
