const mongoose = require('mongoose');

// Configuração para banco de dados persistente em produção
const connectDB = async () => {
  try {
    // Verificar se já existe uma conexão
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB já está conectado');
      return;
    }
    
    // String de conexão para MongoDB Atlas (serviço em nuvem)
    const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:adminpassword@cluster0.mongodb.net/agenda-tce-pi?retryWrites=true&w=majority';
    
    // Conectar ao MongoDB
    const conn = await mongoose.connect(uri);
    
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Erro: ${err.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Conexão com MongoDB fechada');
  } catch (err) {
    console.error(`Erro ao fechar conexão: ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };
