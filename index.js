const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { Client } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

(async () => {
  try {
    await client.connect();
    console.log('Conectado a PostgreSQL');

    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err);
    process.exit(1);
  }
})();

app.set('view engine', 'ejs');
app.set('views', path.join('views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Middleware de autenticación
const isAuth = async (req, res, next) => {
  if (req.cookies && req.cookies.user) {
    try {
      const result = await client.query(
        'SELECT username FROM users WHERE username = $1',
        [req.cookies.user],
      );
      if (result.rows.length > 0) {
        return next();
      } else {
        return res.redirect('/login');
      }
    } catch (err) {
      console.error('Error autenticando usuario:', err);
      return res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
};

const isAdmin = async (req, res, next) => {
  if (req.cookies && req.cookies.user && req.cookies.role === 'admin') {
    return next();
  }
  if (req.cookies && req.cookies.user && req.cookies.role === 'user') {
    return res.redirect('/home');
  }
  res.redirect('/login');
};

// Rutas
app.get('/', (req, res) => {
  res.render('index', { title: 'Mi super página', name: 'Nombre' });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [user],
    );
    const foundUser = result.rows[0];

    if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
      res.cookie('user', foundUser.username, { httpOnly: true });
      res.cookie('role', foundUser.role, { httpOnly: true });

      if (foundUser.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/home');
      }
    } else {
      res.status(401).redirect('/login');
    }
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/admin', isAuth, isAdmin, (req, res) => {
  res.render('admin');
});

app.get('/home', isAuth, (req, res) => {
  res.render('home');
});

app.get('/logout', (req, res) => {
  res.clearCookie('user', { path: '/' });
  res.clearCookie('role', { path: '/' });
  res.redirect('/login');
});

// Ruta 404 para cualquier URL no encontrada
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});
