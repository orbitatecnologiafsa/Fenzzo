const URL = 'http://localhost:3000'
export const getProdutos = async () =>{

  //Criando cabeçalho da requisição do tipo GET, junto com o metodo, caso seja post mudar método para post e colocar um body
  const config = {
      headers: {
      'Content-Type': 'Applicatio/json'
    },
    method:'GET',
    // body: {teste:'test'}
  }
  //Chamada FETCH com await para esperar responder a PROMISSE
  const response = await fetch(`${URL}/produtos`,config); //Fazendo a requisição do tipo get, lá no arquivo index.js na parte de app.get /produtos, ou seja, no server/index.js
  //Fazendo o parse do json e retornando o valor da requisição

  //Tirando resposta do json e transformando em dados(Objeto);
  const data = await response.json();
  //Chamando função exibirProdutosNoModal
  return data;
};

export const postVendas = async (body) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(body)
  };

  const response = await fetch(`${URL}/vendas`, config);

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
};