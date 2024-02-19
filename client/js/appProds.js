const URL = 'http://131.0.245.253:3000';

new Vue({
  el: '#appProds',
  data: {
    listaProdutos: [],
    listaImagens: [],
    search: ''
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

    
    async getImagens() {
      const config = {
          headers: {
              'Content-Type': 'image/jpeg'
          },
          method: 'GET',
      };
  
      try {
          const response = await fetch(`${URL}/imagens`, config);
          const dataArray = await response.json();
  
          dataArray.forEach((data, index) => {
              const base64String = data.FOTO_PATH;
  
              // Verificar se a string é uma base64 válida
              if (/^[A-Za-z0-9+/]*={0,2}$/.test(base64String)) {
                  // Atualiza a propriedade imagens do produto com a string base64
                  this.$set(this.listaProdutos, index, {
                      ...this.listaProdutos[index],
                      imagens: base64String
                  });
              } else {
                  console.warn(`A string base64 não é válida: ${base64String}`);
              }
          });
      } catch (error) {
          console.error('Erro ao obter imagens:', error);
      }
  },
  
  pesquisarProdutos(){
    console.log(this.search);
    if (this.search.length === 0) {
      this.getListaProdutos();
      this.getImagens();
    } else {
        this.listaProdutos = this.listaProdutos.filter(item => item.nome.toLowerCase().includes(this.search.toLowerCase()));
    }
  }
  
  
  
  
  
  },
  mounted() {
    this.getListaProdutos();
    this.getImagens();

  },
  watch: {
    search: function () {
        this.pesquisarProdutos();
    }
}

})