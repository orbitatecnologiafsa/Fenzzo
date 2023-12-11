const URL = 'http://localhost:3000';
new Vue({
    el: '#app',
    data: {
      produtos: [],
      total: 0,
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
                this.total += produto.preco;
            });
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
                produtos: this.produtosSelecionados,
                total: this.total
            }
            // const config = {
            //     headers: {
            //     'Content-Type': 'Application/json'
            //   },
            //   method:'POST',
            //   body: JSON.stringify(obj),
            // }

            // const response = await fetch(`${URL}/vendas`,config);
            // const data = await response.json();

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
        produtosSelecionados(){
            this.calcularTotal();
        }

    }

});
