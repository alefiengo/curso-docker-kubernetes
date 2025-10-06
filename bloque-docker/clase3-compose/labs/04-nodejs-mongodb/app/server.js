const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/tasksdb';

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log('✓ Conectado a MongoDB'))
  .catch(err => console.error('✗ Error al conectar a MongoDB:', err));

// Modelo de Tarea
const TaskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, default: '' },
  completada: { type: Boolean, default: false },
  fechaCreacion: { type: Date, default: Date.now }
});

const Task = mongoose.model('Task', TaskSchema);

// Rutas

// GET / - Bienvenida
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Tareas con Node.js y MongoDB',
    version: '1.0.0',
    endpoints: {
      'GET /': 'Información de la API',
      'GET /api/tasks': 'Listar todas las tareas',
      'GET /api/tasks/:id': 'Obtener una tarea por ID',
      'POST /api/tasks': 'Crear una nueva tarea',
      'PUT /api/tasks/:id': 'Actualizar una tarea',
      'DELETE /api/tasks/:id': 'Eliminar una tarea',
      'GET /health': 'Estado de la API'
    }
  });
});

// GET /api/tasks - Listar todas las tareas
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ fechaCreacion: -1 });
    res.json({
      total: tasks.length,
      tareas: tasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas', detalle: error.message });
  }
});

// GET /api/tasks/:id - Obtener tarea por ID
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tarea', detalle: error.message });
  }
});

// POST /api/tasks - Crear nueva tarea
app.post('/api/tasks', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;

    if (!titulo) {
      return res.status(400).json({ error: 'El título es obligatorio' });
    }

    const newTask = new Task({
      titulo,
      descripcion: descripcion || ''
    });

    const savedTask = await newTask.save();
    res.status(201).json({
      mensaje: 'Tarea creada exitosamente',
      tarea: savedTask
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea', detalle: error.message });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { titulo, descripcion, completada } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, completada },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({
      mensaje: 'Tarea actualizada exitosamente',
      tarea: updatedTask
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea', detalle: error.message });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({
      mensaje: 'Tarea eliminada exitosamente',
      tarea: deletedTask
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea', detalle: error.message });
  }
});

// GET /health - Health check
app.get('/health', (req, res) => {
  const estado = mongoose.connection.readyState;
  const estadoTexto = {
    0: 'desconectado',
    1: 'conectado',
    2: 'conectando',
    3: 'desconectando'
  };

  res.json({
    estado: 'activo',
    mongodb: estadoTexto[estado],
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`✓ Health check disponible en http://localhost:${PORT}/health`);
});
