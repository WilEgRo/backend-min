// DES421 — Backend ultra-minimal (con TODOs)
// Tema sugerido: Recetas (name, category). Cambia si lo deseas.

/**
 * Tareas:
 * 1) Inicializa proyecto: npm init -y
 * 2) Instala dependencias: npm i express cors express-validator dotenv mongoose
 * 3) Crea app Express con CORS y JSON
 * 4) Crea GET /api/health que devuelva { ok: true }
 * 5) Implementa recurso /api/recipes (o tu propio recurso)
 *    - GET /api/recipes  -> lista (in-memory)
 *    - POST /api/recipes -> validación: name (min 3), category (obligatoria)
 * 6) Integra MongoDB (Mongoose)
 *    - Modelo Recipe { name:String, category:String }
 *    - Reemplaza in-memory por DB
 *    - PUT /api/recipes/:id (200/404), DELETE /api/recipes/:id (204/404)
 * 7) Auth mock
 *    - POST /api/login -> { token: 'demo-jwt' }
 *    - Middleware requireAuth para proteger POST/PUT/DELETE
 * 8) Códigos HTTP correctos: 200/201/204/400/401/404
 */

// Sugerencia de estructura (no implementado):
// const express = require('express');
// const cors = require('cors');
// const { body, validationResult } = require('express-validator');
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get('/api/health', (req, res) => { /* TODO */ });

// // In-memory (paso 1)
// // let recipes = [];

// // GET /api/recipes  -> TODO
// // POST /api/recipes -> TODO (validación con express-validator)

// // PASO 2: Mongo + Mongoose
// // require('dotenv').config();
// // const mongoose = require('mongoose');
// // mongoose.connect(process.env.MONGO_URI);
// // const Recipe = mongoose.model('Recipe', new mongoose.Schema({ name:String, category:String }, { timestamps:true }));

// // PASO 4: Auth mock
// // const DEMO_TOKEN = 'demo-jwt';
// // app.post('/api/login', (req,res)=> res.json({ token: DEMO_TOKEN }));
// // function requireAuth(req,res,next){ /* TODO: verificar Authorization */ }

// // app.listen(3000, ()=> console.log('API en http://localhost:3000'));


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const recipesRouter = require('./routes/recipes');
const authRouter = require('./routes/auth');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Rutas
app.use('/api/recipes', recipesRouter);
app.use('/api', authRouter);

// montar routers
app.get('/api/recipes', recipesRouter);
app.post('/api', authRouter);

// Error handler simple (Json)
app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status ||500).json({ error: err.message ||'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://lamartinabo_db_user:qGtIlTf2WECNZwe9@fullstack.i6s601y.mongodb.net/?appName=FullStack';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  });

module.exports = app;
