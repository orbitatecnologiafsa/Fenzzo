const URL = 'http://localhost:3000';
new Vue({
    el: '#app',
    data: {
      produtos: [],
      total: 0,
      desconto: 0,
      search: '',
      produtosSelecionados: [],
      dadosClientes: [],
      vendedores: [],
    },
    methods: {
        console(){
          console.log(this.dadosClientes);
        },
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
            this.produtosSelecionados.push({
              id: this.produtos[index].id,
              nome: this.produtos[index].nome,
              preco: this.produtos[index].preco,
              referencia: this.produtos[index].referencia,
              quantidade: parseInt(this.produtos[index].quantidade = prompt('Quantidade')),
              idCor: this.produtos[index].idCor,
              cor: this.produtos[index].cor,
            });
            console.log(this.produtosSelecionados);
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

            this.desconto = parseFloat(valorDesconto)/100;
            console.log(this.desconto);
            const valorFinal =  precoInicial * this.desconto;
            console.log(valorFinal);
            this.total = this.total - valorFinal;
            document.getElementById(idDesconto).value = '';
          },

          pesquisarProduto(val){
            this.search = val;
            console.log(this.search);
            console.log(val);
            if (this.search.length === 0) {
              this.getProdutos();
            } else {
              this.produtos = this.produtos.filter(item => item.nome.toLowerCase().includes(this.search.toLowerCase()));
            }
          },
          async salvarVenda(){
            console.log(this.produtosSelecionados);
            const quantidadeTotaldeProdutos = this.produtosSelecionados.reduce((total, item) => total + item.quantidade, 0);
            const obj = {
                codigoCliente: this.dadosClientes.find(cli => cli.nome === this.$refs.clienteNome.value).id,
                vendedor: this.vendedores.find(ven => ven.nome === this.$refs.vendedor.value).id,
                cnpj: this.$refs.cnpj.value,
                qtde_produtos: quantidadeTotaldeProdutos,
                qtdeUnitaria: this.produtosSelecionados.length,
                itensVenda: this.produtosSelecionados,
                total: this.total,
                
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
          selecionarCliente() {
            const clienteSelecionado = this.dadosClientes.find(cli => cli.nome === this.$refs.clienteNome.value);
      
            if (clienteSelecionado) {
              // Preencher os outros campos com os dados do cliente
              this.$refs.cnpj.value = clienteSelecionado.cnpj;
              this.$refs.address.value = clienteSelecionado.cep + " - " + clienteSelecionado.endereco + ", " + clienteSelecionado.numero + ", " + clienteSelecionado.bairro;
              this.$refs.city.value = clienteSelecionado.cidade + " - " + clienteSelecionado.uf;
              this.$refs.phone.value = clienteSelecionado.telefone;
              
            } else {
              this.$refs.cnpj.value = '';
              this.$refs.address.value = '';
              this.$refs.city.value = '';
              this.$refs.phone.value = '';
            }
            }
          },
      
    
    mounted(){
        this.getProdutos();
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
      search: 'pesquisarProduto'
    }

});
