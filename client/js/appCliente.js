const URL = 'http://131.0.245.253:3000';
const cepURL = 'https://viacep.com.br/ws';
new Vue({
    el: '#appCliente',
    data: {
        listaClientes: [],
        search: '',
        linkMapa: ''
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
        },

        async getLink() {
            const cep = "44006080";
            const response = await fetch(`${cepURL}/${cep}/json`);
            if (response.ok) {
                const data = await response.json();
                this.linkMapa = "https://www.google.com/maps/place/" + encodeURIComponent(cep);
            } else {
                this.linkMapa = "CEP não encontrado"
            }
            
            
        },
    },
    mounted() {
        this.getClientes();
        this.getLink();
    },
    watch: {
        search: function () {
            this.pesquisarClientes();
        }
    }
})