const URL = 'http://131.0.245.253:3000';

new Vue({
    el: '#appPedidos',
    data: {
        listaPedidos: [],
        search: '',
        listaPedidosItens: [],
    },
    methods: {
        pesquisarPedidos() {
            console.log(this.search);
            if (this.search.length === 0) {
                this.getPedidos();
            } else {
                this.listaPedidos = this.listaPedidos.filter(item => item.nome.toLowerCase().includes(this.search.toLowerCase()));
            }
        },
        async getPedidos() {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'GET'
            }
            const response = await fetch(`${URL}/pedidos`, config);
            const data = await response.json();
            console.log(data);
            this.listaPedidos = data;
            console.log(this.listaPedidos);
        },

        async deletePedidos(id) {
            const obj = {
                id: this.listaPedidosItens[id].id, // Assumindo que você tem uma propriedade "id" no seu objeto pedido
                
            }
            console.log(obj.id);
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'DELETE',
                body: JSON.stringify(obj)

            }
            const response = await fetch(`${URL}/pedidos/${obj.id}`, config);
            const data = await response.json();
            console.log(data);
            this.listaPedidosItens.splice(id, 1);
        },
        async editPedidos(index) {
            const obj = {
              id: this.listaPedidos[index].codigo, // Assumindo que você tem uma propriedade "id" no seu objeto pedido
              cliente: parseInt(this.$refs['cliente' + index][0].value),
            }
          
            const config = {
              headers: {
                'Content-Type': 'Application/json'
              },
              method: 'PUT',
              body: JSON.stringify(obj)
            }
          
            try {
              const response = await fetch(`${URL}/pedidos/${obj.id}`, config);
              const data = await response.json();
              console.log(data);
              this.getPedidos();
            } catch (error) {
              console.error('Erro ao editar pedido:', error);
            }
          },
        async buscarItens(index) {
            console.log(this.listaPedidos[index].codigo);
            const obj = {
                id: this.listaPedidos[index].codigo

            }
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'GET'
                
            }
            const response = await fetch(`${URL}/pedidosItens/${this.listaPedidos[index].codigo}`, config);
            const data = await response.json();
            this.listaPedidosItens = data;
            console.log(this.listaPedidosItens);
            // this.$refs['itens' + index][0].value = data.itensVenda;
            // console.log(this.$refs['itens' + index][0].value);

        }
    },
    mounted() {
        this.getPedidos();
    },
})