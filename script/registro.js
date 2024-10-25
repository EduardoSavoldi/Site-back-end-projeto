const btnConfirmar = document.getElementById('btnConfirmar');
const form = document.getElementById('formulario')
const nome = document.getElementById('firstname');
const sobrenome = document.getElementById('lastname');
const email = document.getElementById('email');
const celular = document.getElementById('number');
const senha = document.getElementById('password');
const confirmarSenha = document.getElementById('confirmPassword');
const url = `${window.location.origin}/`;

form.addEventListener('submit', registrar);

async function registrar(e){
    e.preventDefault();
    function checkCel(){
        const cLen = celular.value.replaceAll(' ', '').length
        return cLen >= 8 && cLen <= 15 || cLen == 0 ? true : false
    }
    function checkSenha(){
        return senha.value === confirmarSenha.value && senha.value.length >= 8 ? true : false
    }

    if(checkSenha() && checkCel()){
        try{
            const res = await fetch(url + 'registro', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: JSON.stringify({
                    nome: validarVariaveis(nome.value),
                    sobrenome: validarVariaveis(sobrenome.value),
                    email: validarVariaveis(email.value),
                    celular: validarVariaveis(celular.value).replaceAll(' ', ''),
                    senha: senha.value
                })
            });

            const data = res.json();
            
            if(res.status == 201){
                window.location.href = `${url}login.html`
            }
            else if(res.status == 409){
                alert('Email já cadastrado');
            }
            else if(res.status == 500){
                alert('Erro inesperado')
            }
            else if(res.status == 400){
                alert('O celular deve possuir no máximo 15 números')
            }
        }
        catch(erro){
            console.error('Erro ao enviar dados:', erro);
            alert('Erro ao se comunicar com o servidor.');
        }
    }
    else if(senha.value.length < 8){
        alert('A senha deve possuir no mínimo 8 caracteres')
        confirmarSenha.value = ''
        senha.value = ''
    }
    else if(senha.value !== confirmarSenha.value){
        alert('As senhas não coincidem')
        confirmarSenha.value = ''
    }
    else if(!checkCel()){
        alert('O número de celular deve possuir no mínimo 8 e no máximo 15 números')
    }
}

function validarVariaveis(variavel){
    return variavel.trim().toLowerCase()
}
