const URL = 'http://131.0.245.253:3000';
new Vue({
    el: '#app',
    data: {
      produtos: [],
      produtosExibir: [],
      total: 0,
      desconto: 0,
      search: '',
      searchCliente: '',
      searchCor: '',
      produtosSelecionados: [],
      dadosClientes: [],
      nomeCliente: '',
      vendedores: [],
      pagamentos: [],
      cores: [],
      quantidadeProduto: 1,
    },
    methods: {
        
        async getProdutos(){

            const config = {
                headers: {
                'Content-Type': 'Application/json'
              },
              method:'GET',
            }

            const response = await fetch(`${URL}/produtos`,config);
            const data = await response.json();
            this.produtos = data;
            console.log(this.produtos);
            console.log(this.produtos[0].cores);
          },
          calcularTotal(){
            this.total = 0;
            this.produtosSelecionados.forEach(produto => {
                this.total += produto.preco * parseFloat(produto.quantidade);
            });
          },
          
          selecionarProduto(index) {
            // Chame a função para obter as cores disponíveis para o produto selecionado
            this.getCores(index);
            
            // Chame a função para adicionar o produto à lista de produtos selecionados
            this.armazenarProdutoTemporariamente (index);
          },
          armazenarProdutoTemporariamente(index) {
            this.indiceProdutoTemporario = index;
        },
          armazenarCorTemporariamente(index) {
            this.indiceCorTemporario = index;
          },
        adicionarCor() {
            if (this.indiceProdutoTemporario === null) {
                console.error('Índice do produto temporário não está definido.');
                return;
            }
            const produtoSelecionado = this.produtos[this.indiceProdutoTemporario];
            const corSelecionada = this.cores[this.indiceCorTemporario]; // Ou qualquer outra maneira de obter a cor selecionada
            const quantidadeDef = this.quantidadeProduto;
            const quantidade = parseInt(quantidadeDef);
            // Verifique se o produto e a cor selecionados existem e são válidos
            if (!produtoSelecionado || !corSelecionada) {
                console.error('Produto ou cor selecionada não encontrados.');
                return;
            }
    
            // Agora você tem o produto selecionado e a cor selecionada
            // Adicione a lógica para adicionar o produto com a cor selecionada à lista de produtos selecionados
            const produtoComCor = {
                id: produtoSelecionado.id,
                nome: produtoSelecionado.nome,
                preco: produtoSelecionado.preco,
                referencia: produtoSelecionado.referencia,
                quantidade: quantidade, // Defina a quantidade conforme necessário
                corID: corSelecionada.corId, // Supondo que você tenha um ID para a cor
                cor: corSelecionada.cor, // Ou qualquer outro atributo que represente a cor selecionada
                // Outros atributos do produto, como grade, podem ser adicionados aqui conforme necessário
            };
    
            // Adicione o produto com a cor selecionada à lista de produtos selecionados
            this.produtosSelecionados.push(produtoComCor);
    
            // Limpe o índice do produto temporário para uso futuro
            this.indiceProdutoTemporario = null;
    
            // Exemplo de console.log para verificar o produto adicionado
            console.log('Produto com cor selecionada:', produtoComCor);
            console.log('Lista de produtos selecionados:', this.produtosSelecionados);
            // Chame a função para calcular o total, se necessário
            this.calcularTotal();
        },
          async getClientes(){
  
            const config = {
                headers: {
                  'Content-Type': 'Application/json'
                },
                method: 'GET'
            }
  
            const response = await fetch(`${URL}/clientes`, config);
            const data =  await response.json();
            this.dadosClientes = data;
            console.log(this.dadosClientes);
            
  
          },
          async getVendedor(){
  
            const config = {
                headers: {
                  'Content-Type': 'Application/json'
                },
                method: 'GET'
            }
  
            const response = await fetch(`${URL}/vendedores`, config);
            const data =  await response.json();
            this.vendedores = data;
            console.log(this.vendedores);
            
  
          },

 
          //   const config = {
          //       headers: {
          //         'Content-Type': 'Application/json'
          //       },
          //       method: 'GET'
          //   }

          //   const response = await fetch(`${URL}/exibir`, config);
          //   const data =  await response.json();
          //   this.produtosExibir = data;
          //   console.log(this.produtosExibir);
          // },
          async getCores (index){
            
            const config = {
                headers: {
                  'Content-Type': 'Application/json'
                },
                method: 'GET'
            }
            const response = await fetch(`${URL}/cores/${this.produtos[index].referencia}`, config);
            const data =  await response.json();
            this.cores = data;
          },
          aplicarDesconto(index) {
            const idDesconto = 'descontos_' + index;
            const valorDesconto = document.getElementById(idDesconto).value;
            const precoInicial = this.produtosSelecionados[index].preco * this.produtosSelecionados[index].quantidade;
              console.log(this.produtosSelecionados[index].quantidade);

            if (valorDesconto === '') {
              this.desconto = 0;
              this.produtosSelecionados[index].desconto = 0;
              
              console.log(this.desconto);
              const valorFinal = precoInicial 
              this.produtosSelecionados[index].vlr_desconto = valorFinal;
              console.log(this.produtosSelecionados[index].vlr_desconto);
              console.log(valorFinal);
              this.total = valorFinal;
              document.getElementById(idDesconto).value = '';
              console.log(this.produtosSelecionados[index]);
              
            } else {
              this.desconto = parseFloat(valorDesconto) / 100;
              this.produtosSelecionados[index].desconto = parseFloat(valorDesconto);
            
              console.log(this.desconto);
              const valorFinal = precoInicial * this.desconto;
              this.produtosSelecionados[index].vlr_desconto = valorFinal;
              console.log(this.produtosSelecionados[index].vlr_desconto);
              console.log(valorFinal);
              this.total = this.total - valorFinal;
              document.getElementById(idDesconto).value = '';
              console.log(this.produtosSelecionados[index]);
              
            }
            
              
              

              
          },

          pesquisarProduto(val){
            this.search = val;
            console.log(this.search);
            console.log(val);
            if (this.search.length === 0 ) {
              this.getProdutos();
            } else {
              this.produtos = this.produtos.filter(item => item.nome.toLowerCase().includes(this.search.toLowerCase()));
            }
          },
          pesquisarCor(val){
            this.searchCor = val;
            console.log(this.searchCor);
            console.log(val);
            if (this.searchCor.length === 0 ) {
              this.getCores();
            } else {
              this.cores = this.cores.filter(item => item.cor.toLowerCase().includes(this.searchCor.toLowerCase()));
            }

          },
          pesquisarCliente(valor){
            this.searchCliente = valor;
            console.log(this.search);
            console.log(valor);
            if (this.searchCliente.length === 0 ) {
              this.getClientes();
            } else {
              this.dadosClientes = this.dadosClientes.filter(cliente => cliente.nome.toLowerCase().includes(this.searchCliente.toLowerCase()));
            }
          },
          async salvarVenda(){
            const formaPag = document.getElementById('inputGroupSelect01').value;
            console.log(formaPag);
            const quantidadeTotaldeProdutos = this.produtosSelecionados.reduce((total, item) => total + item.quantidade, 0);
            const obj = {
                codigoCliente: this.dadosClientes.find(cli => cli.nome === this.$refs.clienteNome.value).id,
                vendedor: this.vendedores.find(ven => ven.nome === this.$refs.vendedor.value).id,
                cnpj: this.$refs.cnpj.value,
                qtde_produtos: quantidadeTotaldeProdutos,
                qtdeUnitaria: this.produtosSelecionados.length,
                itensVenda: this.produtosSelecionados,
                total: this.total,
                formaPagamento: parseInt(formaPag),
            }
            const config = {
                headers: {
                'Content-Type': 'Application/json'
              },
              method:'POST',
              body: JSON.stringify(obj),
            }

            const response = await fetch(`${URL}/vendas`,config);
            const data = await response.json();
            return data
          },
          selecionarCliente(nomeCliente) {
            const clienteSelecionado = this.dadosClientes.find(cli => cli.nome === nomeCliente);
          
            if (clienteSelecionado) {
              // Definir o valor do campo de nome do cliente
              this.$refs.clienteNome.value = nomeCliente;
          
              // Preencher os outros campos com os dados do cliente
              this.$refs.cnpj.value = clienteSelecionado.cnpj;
              this.$refs.address.value = clienteSelecionado.cep + " - " + clienteSelecionado.endereco + ", " + clienteSelecionado.numero + ", " + clienteSelecionado.bairro;
              this.$refs.city.value = clienteSelecionado.cidade + " - " + clienteSelecionado.uf;
              this.$refs.phone.value = clienteSelecionado.telefone;
            } else {
              // Limpar os outros campos se o cliente não for encontrado
              this.limparCampos();
            }
          
            // Fechar o modal após selecionar um cliente
            
          },



          async getPagamentos() {
            const config = {
              headers: {
                'Content-Type': 'Application/json'
              },
              method:'GET',
            }

            const response = await fetch(`${URL}/pagamentos`,config);
            const data = await response.json();
            this.pagamentos = data;
            console.log(this.pagamentos);
          },
          

          },

          
      
    
    mounted(){
        this.getProdutos();
        this.getPagamentos();
        this.getClientes();
        this.getVendedor();
    },
    watch: {
      produtosSelecionados: {
        handler: function () {
          this.calcularTotal();
        }, 
        deep: true // Este é o ponto crucial para garantir a detecção de mudanças profundas
      },
      search: 'pesquisarProduto',
      searchCliente: 'pesquisarCliente',
      searchCor:'pesquisarCor',

    }

});

