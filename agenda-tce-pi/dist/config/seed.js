// Arquivo para inicializar o banco de dados com o usuário padrão admin
const User = require('../models/User');
const { connectDB, closeDB } = require('./db');

const createDefaultAdmin = async () => {
  try {
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
    console.error('Erro ao criar usuário admin padrão:', err);
  }
};

module.exports = { createDefaultAdmin };
