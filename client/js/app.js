const URL = 'http://localhost:3000';
new Vue({
    el: '#app',
    data: {
      produtos: [],
      total: 0,
      desconto: 0,
      search: '',
      produtosSelecionados: [],
      endereco: {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''    
      }
    },
    methods: {
        console(){
          console.log(this.quantidade);
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

          },
          calcularTotal(){
            this.total = 0;
            this.produtosSelecionados.forEach(produto => {
                this.total += produto.preco * parseFloat(produto.quantidade);
            });
          },
         adicionarProduto(index){
            this.produtosSelecionados.push({
              nome: this.produtos[index].nome,
              preco: this.produtos[index].preco,
              estoque: this.produtos[index].estoque,
              quantidade: parseInt(this.produtos[index].quantidade = prompt('Quantidade')),
            });
            console.log(this.produtosSelecionados);
            this.calcularTotal();
          },
          aplicarDesconto() {
            const valorDesconto = parseFloat(this.desconto)/100 * this.total;
            console.log(valorDesconto);
            if (valorDesconto === 0 || isNaN(valorDesconto)) {
              return this.total             
            } else{
              this.total = this.total - valorDesconto;
            }
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

            const obj = {
                vendedor: this.$refs.vendedor.value,
                cnpj: this.$refs.cnpj.value,
                clienteNome: this.$refs.clienteNome.value,
                clienteCEP: this.$refs.cep.value,
                clienteEndereco: this.$refs.address.value,
                clienteUF: this.$refs.uf.value,
                clienteCidade: this.$refs.city.value,
                clienteTelefone: this.$refs.phone.value,
                itensVenda: this.produtosSelecionados,
                total: this.total
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
          async consultarCEP() {
            const cep = this.cep.replace(/\D/g, '');
      
            if (cep.length !== 8) {
              console.error('CEP inválido');
              return;
            }
      
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
      
            if (data.erro) {
              console.error('CEP não encontrado');
              return;
            }
      
            this.endereco = {
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf
            };
          }
    },
    mounted(){
        this.getProdutos();
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
