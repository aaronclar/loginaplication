const express = require('express')
const cookierParser = require('cookie-parser')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use(express.urlencoded());
app.use(express.json());
app.use(cookierParser());

isAuth = (req, res, next) => {
    if( req.cookies && req.cookies.user){
        return next()
    }
    res.redirect("/login");
}

llamadaLogin = 

app.get('/', (req, res) => {
    //sql
  res.render('index', {title: "Mi super página", name: "Nombre"});
})

// gestion de la vista
app.get('/login', (req, res) => {
  res.render('login');
})

// gestion de los parametros post
app.post('/login', (req, res) => {
    const {user, password} = req.body;

    if (req.body.user == "aaron" && req.body.password == "1234"){
        res.cookie("user", user) //options - js no secure si 
        res.redirect("home")
    } else {
        res.send('Usuario y contraseña incorrectos')
    }
  
})

app.get('/home', isAuth, (req, res) => {
  res.render("home");
})

app.get("/logout", (req, res) => {
    res.clearCookie("user");
    res.redirect("login");
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})