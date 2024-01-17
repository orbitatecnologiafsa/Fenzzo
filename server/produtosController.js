// produtosController.js
const firebird = require('node-firebird');


function buscarImagens(request, response, dbConfig) {
  
  firebird.attach(dbConfig, (err, db) => {
    if (err)
        throw err;
  
    db.transaction(firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
        if (err) {
            throw err;
        }
  
        transaction.query('SELECT FOTO_PATH FROM CAD_PRODUTOS_FOTOS', (err, result) => {
            if (err) {
                transaction.rollback();
                return;
            }
  
            const arrBlob = [];
            for (const item of result) {
                const fields = Object.keys(item);
                for (const key of fields) {
                    if (typeof item[key] === 'function') {
                        item[key] = new Promise((resolve, reject) => {
                            // the same transaction is used (better performance)
                            // this is optional
                            item[key](transaction, (error, name, event, row) => {
                                if (error) {
                                    return reject(error);
                                }
  
                                // reading data
                                let value = '';
                                event.on('data', (chunk) => {
                                    value += chunk.toString('binary');
                                });
                                event.on('end', () => {
                                    resolve({ value, column: name, row });
                                });
                            });
                        });
                        arrBlob.push(item[key]);
                    }
                }
            }
  
            Promise.all(arrBlob).then((blobs) => {
                for (const blob of blobs) {
                    result[blob.row][blob.column] = blob.value;
                }
  
                transaction.commit((err) => {
                    if (err) {
                        transaction.rollback();
                        return;
                    }
                    const image = result.map((item) => item.FOTO_PATH);
                    response.setHeader('Content-Type', 'image/jpeg');
                    console.log(image);
                    response.send(image);
                    db.detach();
                    console.log(result);
                });
            }).catch((err) => {
                transaction.rollback();
            });
        });
    });
  });
}

function buscarProdutos(request, response, dbConfig) {
    firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }

    db.query("SELECT CAD_PRODUTOS.CODIGO, DESCRICAO, PRC_VENDA, FOTO_PATH FROM CAD_PRODUTOS INNER JOIN CAD_PRODUTOS_FOTOS ON (CAD_PRODUTOS.CODIGO = CAD_PRODUTOS_FOTOS.CODIGO)", [], (err, result) => {
      if (err) {
        console.log('Erro ao buscar produtos: ', err);
        response.status(500).send('Erro interno do servidor');
        db.detach();
        return;
      }
      
      const produtos = result.map(row => ({
        id: row.CODIGO,
        nome: row.DESCRICAO,
        preco: row.PRC_VENDA,
        fotos:row.FOTO_PATH 
      }));

      response.setHeader('Content-Type', 'application/json');
      response.json(produtos);
      db.detach();
    });
  });
}

module.exports = {
  buscarProdutos,
  buscarImagens,
};