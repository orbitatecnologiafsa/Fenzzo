const URL = 'http://localhost:3000';
new Vue({
  el: '#appProds',
  data: {
    listaProdutos: [],
  },
  methods: {
    async getListaProdutos(){

      const config = {
          headers: {
          'Content-Type': 'Application/json'
        },
        method:'GET',
      }

      const response = await fetch(`${URL}/prods`,config);
      const data = await response.json();
      this.listaProdutos = data;
    }
  },
  mounted() {
    this.getListaProdutos();
  },

})