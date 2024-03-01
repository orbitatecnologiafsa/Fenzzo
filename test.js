
// async function getPlaces() {
//     const url = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities?location=-12.2555595-38.9651809';
//     const options = {
//     method: 'GET',
//     headers: {
//         'X-RapidAPI-Key': 'a5d19780abmsh059b695da190cf8p1676fbjsn74a023294c66',
//         'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
//     }
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.json();
//         console.log(result.links[0].href);
//     } catch (error) {
//         console.error(error);
//     }
// }

// getPlaces()


function getLink() {
    let cep = document.getElementById('cep').value
    let url = `https://viacep.com.br/ws/${cep}/json/`

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP inválido')
            } else{
                var endereco = "https://www.google.com/maps/place/" + encodeURIComponent(cep);
                document.getElementById('endereco').innerText = endereco;
            }
        })
}
