const path = require('path');
const firebird = require('node-firebird');

function realizarLogin(request, response, dbConfig, callback) {
  const { login, senha } = request.body;
  console.log(login, senha);

  // Conectar ao banco de dados e verificar as credenciais
  firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco: ", err);
      callback({ success: false, message: 'Erro interno do servidor' });
      return;
    }

    const sql = 'SELECT COD_VENDEDOR FROM USUARIOS WHERE USERNAME = ? AND SENHA = ?';

    db.query(sql, [login, senha], (err, result) => {
      if (err) {
        console.log('Erro ao buscar a tabela: ', err);
        callback({ success: false, message: 'Erro interno do servidor' });
        db.detach();
        return;
      }

      if (result.length > 0) {
        const vendedorId = result[0].COD_VENDEDOR;

        // Armazenar o ID do vendedor na sessão
        request.session.vendedorId = vendedorId;
        request.session.isAuthenticated = true; // Indica que o usuário está autenticado
        callback({ success: true, vendedorId });
        
      } else {
        callback({ success: false, message: 'Credenciais inválidas' });
      }
      
      db.detach();
    });
  });
}


module.exports = {
    realizarLogin
};