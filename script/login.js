const usuarioInput = document.getElementById('textfield-usuario');
const senhaInput = document.getElementById('textfield-senha');
const mostrarSenhaInput = document.getElementById('mostrar-senha');
const btnLogin = document.getElementById('btn-login');

document.getElementById('card-login').addEventListener('click', function(loginSub){
    if(loginSub.target.classList.contains('btn-login')){
        if(!loginSub.target.classList.contains('login#')){
            if(senhaInput.value == '' || usuarioInput.value == ''){
                alert('Senha ou usuário inválido, tente de novo');
                senhaInput.value = '';
                usuarioInput.value = '';
            }
            else{
                sessionStorage.setItem("nome", usuarioInput.value);
                btnLogin.href = 'index.html';
            }
        }

    };

    if(mostrarSenhaInput.checked == true){
        senhaInput.type = 'text';
    }
    else if(mostrarSenhaInput.checked == false){
        senhaInput.type = 'password';
    }
});