const URL = 'http://localhost:3000';
new Vue ({
    el: '#appClientes',
    data: {
        listaClientes: [],
        search: '',
        isOpen: [],
    },
    methods: {
        async getClientes(){
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'GET'
            }

            const response = await fetch(`${URL}/clientes`, config);
            const data = await response.json();
            this.listaClientes = data;
        },
        toggleAccordion(index) {
            // Inverte o estado do item no índice específico
            this.$set(this.isOpen, index, !this.isOpen[index]);
          },
    },
    mounted(){
        this.getClientes();
        
    },
})