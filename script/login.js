const usuarioInput = document.getElementById('textfield-usuario');
const senhaInput = document.getElementById('textfield-senha');
const mostrarSenhaInput = document.getElementById('mostrar-senha');
const btnLogin = document.getElementById('btn-login');
const formulario = document.getElementById('formulario');
const url = `${window.location.origin}/`;

document.getElementById('card-login').addEventListener('click', function(loginSub){
    if(mostrarSenhaInput.checked == true){
        senhaInput.type = 'text';
    }
    else if(mostrarSenhaInput.checked == false){
        senhaInput.type = 'password';
    }
});

formulario.addEventListener('submit', loginDB)

async function loginDB(e){
    e.preventDefault();
    try{
        const res = await fetch(url + 'login', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                email: usuarioInput.value.toLowerCase(),
                senha: senhaInput.value
            })
        });

        const data = res.json()

        if(res.status == 200){
            window.location.href = `${url}index.html`
        }
        else if(res.status == 404){
            alert('Email não cadastrado');
        }
        else if(res.status == 401){
            alert('Senha incorreta');
        }
        else if(res.status == 500){
            alert('Erro inesperado');
        }
    }
    catch(erro){
        console.error('Erro ao enviar dados:', erro);
        alert('Erro ao se comunicar com o servidor.');
    }
}