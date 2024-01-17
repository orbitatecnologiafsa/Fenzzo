const URL = 'http://131.0.245.253:3000';
new Vue({
    el: '#appCliente',
    data: {
        listaClientes: [],
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
            
        }
    },
    mounted() {
        this.getClientes();
    }
})