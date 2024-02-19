const URL = 'http://131.0.245.253:3000';
new Vue({
    el: '#app',
    data: {
      produtos: [],
      total: 0,
      desconto: 0,
      search: '',
      searchCliente: '',
      produtosSelecionados: [],
      dadosClientes: [],
      nomeCliente: '',
      vendedores: [],
      pagamentos: [],
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

          },
          calcularTotal(){
            this.total = 0;
            this.produtosSelecionados.forEach(produto => {
                this.total += produto.preco * parseFloat(produto.quantidade);
            });
          },
      
         adicionarProduto(index){
          // Solicitar a quantidade
          const quantidadeInput = prompt('Quantidade');

          // Verificar se a quantidade é um número válido
          const quantidade = parseInt(quantidadeInput);
          if (isNaN(quantidade) || quantidade <= 0) {
              // Se a quantidade não for válida, você pode exibir uma mensagem ou tomar outra ação
              alert('Por favor, insira uma quantidade válida maior que zero.');
              return; // Sai da função sem adicionar o produto
          }

          // Adicionar o produto à lista produtosSelecionados
          this.produtosSelecionados.push({
              id: this.produtos[index].id,
              nome: this.produtos[index].nome,
              preco: this.produtos[index].preco,
              referencia: this.produtos[index].referencia,
              quantidade: quantidade,
              idCor: this.produtos[index].idCor,
              cor: this.produtos[index].cor,
              gradeID: this.produtos[index].grade,
          });

          console.log(this.produtosSelecionados);
          console.log(this.pagamentos);
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
          limparCampos() {
            this.$refs.cnpj.value = '';
            this.$refs.address.value = '';
            this.$refs.city.value = '';
            this.$refs.phone.value = '';
          },

            pesquisarCliente(val){
              this.searchCliente = val;
              console.log(this.search);
              console.log(val);
              if (this.searchCliente.length === 0 ) {
                this.getClientes();
              } else {
                this.dadosClientes = this.dadosClientes.filter(cliente => cliente.nome.toLowerCase().includes(this.searchCliente.toLowerCase()));
              }
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
        this.$refs.clienteNome.addEventListener('input', () => {
          if (!this.$refs.clienteNome.value.trim()) {
            this.limparCampos();
          }});
        
        
    },
    watch: {
      produtosSelecionados: {
        handler: function () {
          this.calcularTotal();
        }, 
        deep: true // Este é o ponto crucial para garantir a detecção de mudanças profundas
      },
      search: 'pesquisarProduto',
      searchCliente: 'pesquisarCliente'

    }

});
