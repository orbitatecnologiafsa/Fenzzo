const firebird = require('node-firebird');

function buscarCliente(request, response) {
  firebird.attach(dbConfig, (err, db) =>{
    if (err) {
      console.log("Erro ao conectar no banco: ", err);
      response.status(500).send('Erro interno');
      return
    }

    db.query("SELECT * FROM CAD_CLIENTES WHERE TIPO = 'CLIENTE'", [], (err, result) =>{
      if (err) {
        console.log('Erro ao buscar a tabela: ', err);
        response.status(500).send('Erro interno do servidor');
        db.detach();
        return;
      }
      const dadosCliente = result.map(row => ({
        id: row.CODIGO,
        nome: row.NOME,
        cnpj: row.CPF_CNPJ,
        cep: row.CEP,
        endereco: row.ENDERECO,
        numero: row.NUMERO,
        complemento: row.COMPLEMENTO,
        bairro: row.BAIRRO,
        cidade: row.NOMECIDADE,
        uf: row.UF,
        telefone: row.FONE
      }));

      response.setHeader('Content-Type', 'application/json');
      response.json(dadosCliente);
      db.detach();
        
    })
  })
}

function buscarVendedor(request, response) {
  firebird.attach(dbConfig, (err, db) =>{
    if (err) {
      console.log("Erro ao conectar no banco: ", err);
      response.status(500).send('Erro interno');
      return
    }

    db.query("SELECT * FROM CAD_CLIENTES WHERE TIPO = 'VENDEDOR'", [], (err, result) =>{
      if (err) {
        console.log('Erro ao buscar a tabela: ', err);
        response.status(500).send('Erro interno do servidor');
        db.detach();
        return;
      }
      const dadosVendedores = result.map(row => ({
        id: row.CODIGO,
        nome: row.NOME,
        cnpj: row.CPF_CNPJ,
        telefone: row.FONE
      }));

      response.setHeader('Content-Type', 'application/json');
      response.json(dadosVendedores);
      db.detach();
        
    })
  })
}

module.exports = {
  buscarCliente,
  buscarVendedor
}