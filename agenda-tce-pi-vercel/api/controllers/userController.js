const User = require('../models/User');

// Renderizar página de login
exports.getLoginPage = (req, res) => {
  res.render('login');
};

// Processar login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.render('login', { error: 'Usuário ou senha inválidos' });
    }
    
    // Verificar senha
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.render('login', { error: 'Usuário ou senha inválidos' });
    }
    
    // Criar sessão
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.userRole = user.role;
    req.session.userName = user.name;
    
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Erro ao fazer login. Tente novamente.' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

// Renderizar página de usuários (apenas admin)
exports.getUsersPage = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users', { users, currentUser: { id: req.session.userId, role: req.session.userRole } });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar usuários' });
  }
};

// Renderizar página de adicionar usuário
exports.getAddUserPage = (req, res) => {
  res.render('add-user');
};

// Adicionar novo usuário
exports.addUser = async (req, res) => {
  const { username, password, name, email, role } = req.body;
  
  try {
    // Verificar se usuário já existe
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    
    if (userExists) {
      return res.render('add-user', { 
        error: 'Usuário ou email já cadastrado',
        user: { username, name, email, role }
      });
    }
    
    // Criar novo usuário
    await User.create({
      username,
      password,
      name,
      email,
      role
    });
    
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.render('add-user', { 
      error: 'Erro ao cadastrar usuário',
      user: { username, name, email, role }
    });
  }
};

// Renderizar página de editar usuário
exports.getEditUserPage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.render('error', { message: 'Usuário não encontrado' });
    }
    
    res.render('edit-user', { user });
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao carregar usuário' });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  const { name, email, role } = req.body;
  const password = req.body.password;
  
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.render('error', { message: 'Usuário não encontrado' });
    }
    
    // Atualizar campos
    user.name = name;
    user.email = email;
    user.role = role;
    
    // Atualizar senha apenas se fornecida
    if (password && password.trim() !== '') {
      user.password = password;
    }
    
    await user.save();
    
    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.render('error', { message: 'Erro ao atualizar usuário' });
  }
};

// Excluir usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    
    // Não permitir excluir o próprio usuário
    if (user._id.toString() === req.session.userId) {
      return res.status(400).json({ success: false, message: 'Não é possível excluir o próprio usuário' });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro ao excluir usuário' });
  }
};
