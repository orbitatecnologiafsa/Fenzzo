// vendasController.js
const firebird = require('node-firebird');

function realizarVenda(request, response, dbconfig) {
  const { codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, itensVenda, total, formaPagamento } = request.body;
  const totall = parseFloat(total);
  console.log('Parou aqui' , codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, itensVenda, total, formaPagamento);
  
try {
  console.log("Oiiiiii");
  firebird.attach(dbconfig, async (err, db) => {
  console.log("Oiii 2222");
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }
    console.log("Conectado ao banco de dados");
    try {
      let descontoTotal = 0;
      let totalProdutosSemDesconto = 0;
      console.log("Parou aqui 2222" , codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, itensVenda, total);
      // Calcular desconto total
      itensVenda.forEach((item) => {
        if (item.desconto == undefined) {
          item.desconto = 0;
          item.vlr_desconto = 0;
        }
        console.log("Parou aqui 3333" , codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, itensVenda, total);
        descontoTotal += item.vlr_desconto;
        console.log(descontoTotal);
        totalProdutosSemDesconto += item.preco * item.quantidade;
      });

      // Inserir dados na tabela de vendas
      const result = await new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO PEDIDOS (CLIENTE, VENDEDOR, QTDE_PRODUTOS, QTDE_TOTAL, TIPO, APROVADO, PRODUZINDO, SELECIONADO, VLR_TOTAL, VLR_DESCONTO, VLR_PRODUTOS, FORMAPAGTO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING CODIGO',
          [codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, 'VENDA', 'N', 'N', 'N', totall, descontoTotal, totalProdutosSemDesconto, formaPagamento],
          (err, result) => {
            if (err) {
              reject(err);
              console.log('Erro ao inserir dados na tabela de vendas: ', err);
              console.log([codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, 'VENDA', 'N', 'N', 'N', totall, descontoTotal, totalProdutosSemDesconto])
            } else {
              resolve(result);
              console.log('Resultado da inserção na tabela de vendas: ', result);
              console.log([codigoCliente, vendedor, qtdeUnitaria, qtde_produtos, 'VENDA', 'N', 'N', 'N', totall, descontoTotal, totalProdutosSemDesconto])

            }
          }
        );
      });
      console.log('Resultado da inserção na tabela de vendas: ', result);

      const idVenda = result.CODIGO;
      console.log('ID da venda inserida: ', idVenda);

      // Inserir itens de venda associados à venda
      await Promise.all(
        itensVenda.map((item) => {
          

          const vlrTotal = (item.quantidade * item.preco) - item.vlr_desconto;

          // Inserir dados na tabela de itens de venda
          const insertItemQuery = new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO PEDIDOS_ITENS (CODIGO, REFERENCIA, DESCRICAO, QTDE, VLR_UNIT, VLR_TOTAL, EMPRESA, DATA, CLIENTE, DESCONTO, VLR_DESCONTO) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [idVenda, item.referencia, item.nome, item.quantidade, item.preco, vlrTotal, 1, new Date(), codigoCliente, item.desconto, item.vlr_desconto],
              (err, result) => {
                if (err) {
                  reject(err);
                  console.log("Deu ruim",[idVenda, item.referencia, item.nome, item.quantidade, item.preco, vlrTotal, 1, new Date(), codigoCliente, item.desconto, item.vlr_desconto])
                } else {
                  resolve("Sucesso" ,result);
                }
              }
            );
          });
          console.log([idVenda, item.referencia, item.nome, item.quantidade, item.preco, vlrTotal, 1, new Date(), codigoCliente, item.desconto, item.vlr_desconto])
          // Inserir dados na tabela de itens de venda (grade)
          const insertGradeQuery = new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO PEDIDOS_ITENS_GRADE (IDX, CODIGO, REFERENCIA, EMPRESA, COR_ID, COR, TAMANHO_ID, APROVADO, GRADE_ID, QUANTIDADE, VALOR_UNIT) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [idVenda, idVenda, item.referencia, 1, item.idCor, item.cor, 26, 'N', item.gradeID, item.quantidade, item.preco],
              (err, result) => {
                if (err) {
                  reject(err);
                  console.log("Deu ruim",[idVenda, idVenda, item.referencia, 1, item.idCor, item.cor, 26, 'N', 26, item.quantidade, item.preco])
                } else {
                  resolve(result);
                  console.log("Sucesso" ,result);
                }
              }
            );
          });

          // Executar ambas as queries em paralelo
          return Promise.all([insertItemQuery, insertGradeQuery]);
        })
      );

      response.send('Dados inseridos com sucesso');
    } catch (error) {
      console.log('Erro ao executar operações no banco de dados: ', error);
      response.status(500).send('Erro interno do servidor');
    } finally {
      db.detach();
    }
  });
} catch (error) {
  console.error('Erro ao conectar no banco de dados:', error);
  response.status(500).send('Erro interno');
}
}

function buscarProdutosVendas(request, response, dbConfig) {
  firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }

    db.query('SELECT cad_produtos.codigo, cad_produtos.referencia, CAD_PRODUTOS.descricao, cad_produtos.prc_venda, cad_produtos_grades.grade_id, cad_produtos_grades.cor_id, cad_cores.nome FROM CAD_PRODUTOS INNER JOIN CAD_PRODUTOS_GRADES ON (cad_produtos.codigo = cad_produtos_grades.codigo) LEFT JOIN CAD_CORES ON (cad_produtos_grades.cor_id = CAD_CORES.codigo)', [], (err, result) => {
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
        referencia: row.REFERENCIA,
        grade: row.GRADE_ID,
        cor: row.NOME,
        idCor: row.COR_ID

      }));
      
      response.setHeader('Content-Type', 'application/json');
      response.json(produtos);
      db.detach();
    });
  });

}

function buscarPagamentos(request, response, dbConfig) {
  firebird.attach(dbConfig, (err, db) => {
    if (err) {
      console.log("Erro ao conectar no banco de dados: ", err);
      response.status(500).send('Erro interno');
      return;
    }


    db.query('SELECT * FROM CAD_FORMAPAGTO', [], (err, result) => {
      if (err) {
        console.log('Erro ao buscar pagamentos: ', err);
        response.status(500).send('Erro interno do servidor');
        db.detach();
        return;
      }

      const pagamentos = result.map(row => ({
        id: row.CODIGO,
        nome: row.NOME
      }))

      response.setHeader('Content-Type', 'application/json');
      response.json(pagamentos);
      db.detach();
    })
  })
  
}

module.exports = {
  realizarVenda,
  buscarProdutosVendas,
  buscarPagamentos,
};