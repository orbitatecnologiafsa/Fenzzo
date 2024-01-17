const URL = 'http://131.0.245.253:3000';
new Vue({
    el: '#appCliente',
    data: {
        listaProdutos: [],
    },
    methods: {
        async getProds() {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'GET'
            }
            const response = await fetch(`${URL}/prods`, config);
            const data = await response.json();
            this.listaProdutos = data;
        }
    }
})