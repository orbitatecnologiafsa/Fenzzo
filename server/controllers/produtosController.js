// produtosController.js
const firebird = require('node-firebird');


function buscarImagens(request, response, dbConfig) {
    firebird.attach(dbConfig, (err, db) => {
        if (err) {
            throw err;
        }

        db.transaction(firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
            if (err) {
                throw err;
            }

            transaction.query('SELECT FIRST 8 FOTO_PATH FROM CAD_PRODUTOS_FOTOS', (err, result) => {
                if (err) {
                    transaction.rollback();
                    return;
                }

                const arrPromises = [];
                for (const item of result) {
                    const fields = Object.keys(item);
                    for (const key of fields) {
                        if (typeof item[key] === 'function') {
                            item[key] = new Promise((resolve, reject) => {
                                item[key](transaction, (error, name, event, row) => {
                                    if (error) {
                                        return reject(error);
                                    }

                                    let value = '';
                                    event.on('data', (chunk) => {
                                        value += chunk.toString('binary');
                                    });

                                    event.on('end', () => {
                                        resolve({ value, column: name, row });
                                    });
                                });
                            });

                            arrPromises.push(item[key]);
                        }
                    }
                }

                Promise.all(arrPromises)
                    .then((blobs) => {
                        return Promise.all(blobs.map((blob) => {
                            return new Promise((resolve, reject) => {
                                // Converte o valor do blob para base64
                                const base64 = Buffer.from(blob.value, 'binary').toString('base64');
                                resolve({ base64, column: blob.column, row: blob.row });
                            });
                        }));
                    })
                    .then((base64Results) => {
                        for (const base64Result of base64Results) {
                            result[base64Result.row][base64Result.column] = base64Result.base64;    
                        }

                        transaction.commit((err) => {
                            if (err) {
                                transaction.rollback();
                                return;
                            }
                            response.end(JSON.stringify(result));
                            db.detach();
                        });
                    })
                    .catch((err) => {
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

    db.query("SELECT FIRST 8 CAD_PRODUTOS.CODIGO, DESCRICAO, PRC_VENDA, FOTO_PATH FROM CAD_PRODUTOS INNER JOIN CAD_PRODUTOS_FOTOS ON (CAD_PRODUTOS.CODIGO = CAD_PRODUTOS_FOTOS.CODIGO)", [], (err, result) => {
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