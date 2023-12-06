import { getProdutos, postVendas } from './Config.js';
carregarModulo();
//Pode ignorar essa função, porque ela serve apenas para deixar todo processo assincrono básicamente porque eu mudei a estrutura para ficar mais legivel
// e entender o processo
async function carregarModulo (){

//GET PRODUTOS
const produtos = await getProdutos();//Chamando função getProdutos do arquivo Config.js, para pegar os dados do banco de dados e acionar a função exibirProdutosNoModal
console.log(produtos);
exibirProdutosNoModal(produtos);

//GET BLABLABLA
function exibirProdutosNoModal(produtos) {
  const listaProdutosModal = document.getElementById('listaProdutosModal');
  const listaProdModal = document.getElementById('listaProdModal');

 
  listaProdModal.innerHTML = '';

 
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.classList.add('produto');
    li.setAttribute('data-produto-id', produto.id);

    li.innerHTML = `
      <!-- Conteúdo do produto no modal -->
      <span>${produto.nome} - R$ ${produto.preco.toFixed(2)}</span>
      <a href="${trocarModal}" key="${produto.id}" class="btnModal">Selecionar</a>
      <!-- Adicione outros campos conforme necessário -->
    `;

    listaProdModal.appendChild(li);
  });

}
function atualizarLista() {
  var listaProds = document.getElementById('listaProdsID');

 
  listaProds.innerHTML = '';

 
  produtos.forEach(produtos => {
    const li = document.createElement('li');
    li.classList.add('produto');

    li.innerHTML = `
      <!-- Conteúdo do produto no modal -->
      <span>${produtos.nome} - R$ ${produtos.preco.toFixed(2)}</span>
      <a href="#" key="${produtos.id}" class="btnModal">Selecionar</a>
      <!-- Adicione outros campos conforme necessário -->
    `;

  });
}


var selects = document.getElementsByTagName('a')

for (var i = 0; i < selects.length; i++) {
  selects[i].addEventListener("click", function(){
    atualizarLista()
    return false;
  })
  
}



function exibirProdutosNoModal(produtos) {
  const listaProdutosModal = document.getElementById('listaProdutosModal');
  const listaProdModal = document.getElementById('listaProdModal');

 
  listaProdModal.innerHTML = '';

 
  produtos.forEach(produto => {
    const li = document.createElement('li');
    li.classList.add('produto');

    li.innerHTML = `
      <!-- Conteúdo do produto no modal -->
      <span>${produto.nome} - R$ ${produto.preco.toFixed(2)}</span>
      <a href="#" key="${produto.id}" class="btnModal">Selecionar</a>
      <!-- Adicione outros campos conforme necessário -->
    `;

    listaProdModal.appendChild(li);
  });

}







//POST VENDAS
function finalização() {
  const vendedorCliente = document.getElementById('vendedorInput').value;
  const cnpjCliente = document.getElementById('cnpjInput').value;
  const nomeCliente = document.getElementById('clienteNomeInput').value;
  const cepCliente = document.getElementById('cepInput').value;
  const enderecoCliente = document.getElementById('addressInput').value;
  const ufCliente = document.getElementById('UFinput').value;
  const clienteCidade = document.getElementById('cidadeInput').value;
  const telefoneCliente = document.getElementById('telefoneInput').value;
  
  const bodyRequest = {
    vendedor: vendedorCliente,
    cnpj: cnpjCliente,
    clienteNome: nomeCliente,
    clienteCEP: cepCliente,
    clienteEndereco: enderecoCliente,
    clienteUF: ufCliente,
    clienteCidade: clienteCidade,
    clienteTelefone: telefoneCliente
  }
  
  postVendas(bodyRequest)  
}

const btn1 = document.getElementById('enviarVendasBtn');
btn1.addEventListener('click', finalização);









}