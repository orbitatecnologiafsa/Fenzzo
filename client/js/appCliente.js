const URL = 'http://131.0.245.253:3000';
new Vue({
    el: '#appCliente',
    data: {
        listaClientes: [],
        search: ''
    },
    methods: {
        async getClientes() {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'GET'
            }
            const response = await fetch(`${URL}/clientes`, config);
            const data = await response.json();
            this.listaClientes = data;
            console.log(this.listaClientes);
            
        },
        pesquisarClientes() {
            console.log(this.search);
            if (this.search.length === 0) {
                this.getClientes();
            } else {
                this.listaClientes = this.listaClientes.filter(item => item.nome.toLowerCase().includes(this.search.toLowerCase()));
            }
        }
    },
    mounted() {
        this.getClientes();
    },
    watch: {
        search: function () {
            this.pesquisarClientes();
        }
    }
})