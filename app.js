require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const { connectDB } = require('./config/db');

// Inicializar app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'agenda-tce-pi-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicializar banco de dados e criar usuário admin
const initializeDB = async () => {
  try {
    // Conectar ao MongoDB
    await connectDB();
    
    // Verificar se já existe um usuário admin
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (!adminExists) {
      // Criar usuário admin padrão
      await User.create({
        username: 'admin',
        password: 'admin', // Será criptografado pelo middleware pre-save
        name: 'Administrador',
        email: 'admin@tce-pi.gov.br',
        role: 'admin'
      });
      
      console.log('Usuário admin padrão criado com sucesso!');
    } else {
      console.log('Usuário admin já existe, pulando criação.');
    }
  } catch (err) {
    console.error(`Erro ao inicializar banco de dados: ${err.message}`);
    process.exit(1);
  }
};

// Rotas
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Importar rotas
app.use('/', userRoutes);
app.use('/', appointmentRoutes);

// Inicializar banco de dados e iniciar servidor
initializeDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});

module.exports = app;
