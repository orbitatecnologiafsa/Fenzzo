const URL = 'http://localhost:3000';
new Vue({
    el: '#app',
    data: {
      produtos: [],
      total: 0,
      desconto: 0,
      produtosSelecionados: [],
      endereco: {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''    
      }
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

          },
          calcularTotal(){
            this.total = 0;
            this.produtosSelecionados.forEach(produto => {
                this.total += produto.preco * produto.qtd
            });
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
      desconto: 'aplicarDesconto'
    }

});
