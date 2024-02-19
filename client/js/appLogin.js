const URL = 'http://131.0.245.253:3000';
new Vue({
    el: '#appLogin',
    data: {
        login: '',
        senha: '',
    },
    methods: {
        async login() {
            const config = {
                headers: {
                    'Content-Type': 'Application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: this.email,
                    senha: this.senha
                })
            }
            const response = await fetch(`${URL}/login`, config);
            const data = await response.json();
            console.log(data);
        }
    }
})
                