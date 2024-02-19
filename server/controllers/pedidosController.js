
const firebird = require('node-firebird');
// PEDIDOS_ITENS

function buscarPedidos(request, response, dbConfig) {
    const vendedorId = request.session.vendedorId;
    firebird.attach(dbConfig, (err, db) => {
        if (err) {
            console.log("Erro ao conectar no banco: ", err);
            return;
        }

        db.query("SELECT pedidos.*, cad_clientes.NOME FROM pedidos INNER JOIN cad_clientes ON (pedidos.cliente = cad_clientes.codigo) WHERE pedidos.vendedor = ?", [vendedorId], (err, result) => {
            if (err) {
                console.log('Erro ao buscar a tabela: ', err);
                response.status(500).send('Erro interno do servidor');
                db.detach();
                return;
            }
            const pedidos = result.map(row => ({
                codigo: row.CODIGO,
                cliente: row.NOME,
                totalProdutos: row.QTDE_TOTAL,
                valorDesconto: row.VLR_DESCONTO,
                valorParcial: row.VLR_PRODUTOS,
                total: row.VLR_TOTAL
            }))
            
            response.setHeader('Content-Type', 'application/json');
            response.json(pedidos);
            db.detach();
        })
    })
}

function editarPedidos(request, response, dbConfig) {
    console.log(request.body);
    const { id, cliente } = request.body; // Usando request.params para obter o id da URL
    console.log(id, cliente);
    firebird.attach(dbConfig, (err, db) => {
        if (err) {
            console.log("Erro ao conectar no banco: ", err);
            return;
        }
        db.transaction(firebird.ISOLATION_READ_COMMITTED, (err, transaction) => {
            
            if (err) {
                throw err;
            }
            transaction.query('UPDATE pedidos SET CLIENTE = ? WHERE CODIGO = ?', [request.body.cliente, request.body.id], (err, result) => {
                if (err) {
                    transaction.rollback();
                    return;
                }
                transaction.commit();
                response.setHeader('Content-Type', 'application/json');
                response.json({ success: true });
                db.detach();
            })
        })
    })
}

function buscarItensPedido(request, response, dbConfig) {
    console.log(request.params.id);
    

    firebird.attach(dbConfig, (err, db) => {
        if (err) {
            console.log("Erro ao conectar no banco: ", err);
            return;
        }

        const sql = `
            SELECT pedidos_itens.*
            FROM pedidos_itens 
            WHERE pedidos_itens.CODIGO = ?
        `;

        db.query(sql, [request.params.id], (err, result) => {
            if (err) {
                console.log('Erro ao buscar a tabela: ', err);
                response.status(500).send('Erro interno do servidor');
                db.detach();
                return;
            }

            const pedidos = result.map(row => ({
                id: row.IDX,
                codigo: row.CODIGO,
                produto: row.DESCRICAO,
                qtde: row.QTDE,
                valor: row.VLR_TOTAL
            }));
            
            response.setHeader('Content-Type', 'application/json');
            response.json(pedidos);
            db.detach();
        });
    });
}

function excluirItensPedidos(request, response, dbConfig) {
    console.log(request.params.id);
    firebird.attach(dbConfig, (err, db) => {
        if (err) {
            console.log("Erro ao conectar no banco: ", err);
            return;
        }
        db.query('DELETE FROM pedidos_itens WHERE IDX = ?', [request.params.id], (err, result) => {
            if (err) {
                console.log('Erro ao buscar a tabela: ', err);
                response.status(500).send('Erro interno do servidor');
                db.detach();
                return;
            }
            response.setHeader('Content-Type', 'application/json');
            response.json({ success: true });
            db.detach();
        })
    })
}


module.exports = {
    buscarPedidos,
    editarPedidos,
    buscarItensPedido,
    excluirItensPedidos,
}