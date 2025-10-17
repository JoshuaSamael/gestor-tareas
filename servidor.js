const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const puerto = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Datos simulados
let tareas = [
  { id: 1, titulo: 'Aprender Node.js', completada: false },
  { id: 2, titulo: 'Crear API REST', completada: true }
];

let proximoId = 3;

// RUTAS GET
app.get('/api/tareas', (req, res) => {
  res.json(tareas);
});

app.get('/api/tareas/:id', (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  if (!tarea) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }
  res.json(tarea);
});

// RUTAS POST
app.post('/api/tareas', (req, res) => {
  const { titulo } = req.body;
  
  if (!titulo) {
    return res.status(400).json({ mensaje: 'El título es requerido' });
  }

  const nuevaTarea = {
    id: proximoId++,
    titulo,
    completada: false
  };

  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

// RUTAS PUT
app.put('/api/tareas/:id', (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));
  
  if (!tarea) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }

  if (req.body.titulo) tarea.titulo = req.body.titulo;
  if (req.body.completada !== undefined) tarea.completada = req.body.completada;

  res.json(tarea);
});

// RUTAS DELETE
app.delete('/api/tareas/:id', (req, res) => {
  const indice = tareas.findIndex(t => t.id === parseInt(req.params.id));
  
  if (indice === -1) {
    return res.status(404).json({ mensaje: 'Tarea no encontrada' });
  }

  const tareaEliminada = tareas.splice(indice, 1);
  res.json(tareaEliminada[0]);
});

// Ruta para servir el HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(puerto, () => {
  console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});