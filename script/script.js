const textoLogin = document.getElementById('texto-login');
const url = `${window.location.origin}/`;

window.onload = async() => {
    try{
        const res = await fetch(url + 'dashboard');
        if(res.ok){
            const data = await res.json();
            textoLogin.innerHTML = `<span>Logado como: </span><span style="color: #587bd6">${data.nome}</span>`
        }
        if(res.status == 401){
            textoLogin.innerText = 'Anônimo'
        }
    }
    catch(erro){
        console.error('Erro ao buscar informações do usuário')
    }
}