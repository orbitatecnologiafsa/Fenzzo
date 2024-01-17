const URL = 'http://131.0.245.253:3000';
new Vue({
  el: '#appProds',
  data: {
    listaProdutos: [],
    listaImagens: [],
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
      console.log(this.listaProdutos);
    },
    async getImagens(){

      const config = {
          headers: {
          'Content-Type': 'image/jpeg'
        },
        method:'GET',
      }
      
      const response = await fetch(`${URL}/imagens`,config);
      const data = await response.blob();
      this.listaProdutos.imagens = data
      console.log(this.listaProdutos);
      
    }
  },
  mounted() {
    this.getListaProdutos();
    this.getImagens();

  },

})