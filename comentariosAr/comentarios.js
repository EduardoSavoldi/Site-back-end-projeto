const textoLogin = document.getElementById('texto-login');
const cSection = document.getElementById('commentSection');
let usuarioNome;
const url = `${window.location.origin}/`;
const materia = window.location.pathname.split("/").pop().split('.').splice(0, 1)[0]

async function comentario(msg, tipo){
    try{
        const res = await fetch(url + 'addcomentario',{
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                mensagem: msg,
                tipo: tipo,
                materia: materia,
                html: JSON.stringify(document.getElementById('commentSection').innerHTML)
            })
        })
    }
    catch(erro){

    }
}

window.onload = async() => {
    try{
        const res = await fetch(url + 'dashboard');
        if(res.ok){
            const data = await res.json();
            usuarioNome = data.nome;
            usuarioId = data.id;
            textoLogin.innerHTML = `<span>Logado como: </span><span style="color: #587bd6">${data.nome}</span>`
        }
        if(res.status == 401){
            textoLogin.innerText = 'Anônimo'
            usuarioNome = 'anônimo';
            usuarioId = 1;
        }
    }
    catch(erro){
        console.error('Erro ao buscar informações do usuário')
    }
/*
    try{
        const res = await fetch(url + 'comment', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                materia: materia
            })
        });
        const data = await res.json()
        html = data.html
        function unescapeHtml(escapedHtml) {
            return escapedHtml
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'");
          }
        cSection.innerHTML = unescapeHtml(html)
        console.log(unescapeHtml(html))
    }
    catch(erro){
        console.error(`Erro ao importar os comentarios de ${materia}`)
    }*/
}

document.getElementById('submitComment').addEventListener('click', function() {
    const commentText = document.getElementById('newComment').value;
    if (commentText) {
        const commentSection = document.getElementById('commentSection');
        const newComment = document.createElement('div');
        newComment.classList.add('comment');
        newComment.innerHTML = `
            <div style="margin: auto; max-width: 90%; padding-bottom: 10px;">
                <p><span class="comment-nome" style="color: #587bd6"><strong>${usuarioNome}</strong></span><br><span class="comment-texto" style="color: #f0ffffde;">${commentText}</span></p>
                <div style="display: flex; align-items: center; justify-content: space-between; width: 165px;">
                    <button class="likeBtn"><img style="width: 13px; margin: 2px 4px 0 2px;" src="imagens/likeBtn.png" alt="likeBtn">0</button>
                    <button class="dislikeBtn"><img style="width: 13px; margin: 2px 4px 0 2px; transform: scale(-1, -1)" src="imagens/likeBtn.png" alt="likeBtn">0</button>
                    <button class="replyBtn">Responder</button>
                </div>
            </div>
            <div class="replySection"></div>
        `;
        commentSection.appendChild(newComment);
        document.getElementById('newComment').value = '';

        //comentario(commentText, 'comentario');
    }
});

document.getElementById('commentSection').addEventListener('click', function(event) {
    if (event.target.classList.contains('likeBtn') || event.target.classList.contains('dislikeBtn')) {
        const btn = event.target;
        var count = parseInt(btn.innerHTML.split('>')[1]);
        console.log(count)

        if (btn.classList.contains('likeBtn')){
            if(!event.target.classList.contains('checked')){
                btn.innerHTML = `<img style="width: 13px; margin: 2px 4px 0 2px;" src="imagens/likeBtn.png" alt="likeBtn">${count += 1}`;
                event.target.classList.add('checked');
                if(event.target.parentElement.querySelector('.dislikeBtn').classList.contains('checked')){
                    event.target.parentElement.querySelector('.dislikeBtn').innerHTML = `<img style="width: 13px; margin: 2px 4px 0 2px; transform: scale(-1, -1)" src="imagens/likeBtn.png" alt="likeBtn">${count -= 1}`;
                    event.target.parentElement.querySelector('.dislikeBtn').classList.remove('checked');
                }
            }
            else if(event.target.classList.contains('checked')){
                btn.innerHTML = `<img style="width: 13px; margin: 2px 4px 0 2px;" src="imagens/likeBtn.png" alt="likeBtn">${count -= 1}`;
                event.target.classList.remove('checked');
            }

        }
        else if (btn.classList.contains('dislikeBtn')){
            if(!event.target.classList.contains('checked')){
                btn.innerHTML = `<img style="width: 13px; margin: 2px 4px 0 2px; transform: scale(-1, -1)" src="imagens/likeBtn.png" alt="likeBtn">${count += 1}` ;
                event.target.classList.add('checked');
                if(event.target.parentElement.querySelector('.likeBtn').classList.contains('checked')){
                    event.target.parentElement.querySelector('.likeBtn').innerHTML = `<img style="width: 13px; margin: 2px 4px 0 2px;" src="imagens/likeBtn.png" alt="likeBtn">${count -= 1}`;
                    event.target.parentElement.querySelector('.likeBtn').classList.remove('checked');
                }
            }
            else if(event.target.classList.contains('checked')){
                btn.innerHTML = `<img style="width: 13px; margin: 2px 4px 0 2px; transform: scale(-1, -1)" src="imagens/likeBtn.png" alt="likeBtn">${count -= 1}` ;
                event.target.classList.remove('checked');
            }

        }


    }

    else if (event.target.classList.contains('replyBtn') || event.target.classList.contains('replyReplyBtn')) {
        const replySection = event.target.closest('.comment').querySelector('.replySection');
        const replyInput = document.createElement('textarea');
        const replySubmit = document.createElement('button');
        const replyCancel = document.createElement('button');
        const divBtn = document.createElement('div');

        replyInput.classList.add('replycom');
        divBtn.classList.add('replycom');
        divBtn.classList.add('div-btn-reply')

        replySubmit.textContent = 'Responder';
        replyCancel.textContent = 'Cancelar';
        
        divBtn.appendChild(replySubmit);
        divBtn.appendChild(replyCancel);

        replySection.appendChild(replyInput);
        replySection.appendChild(divBtn);
        
        replySubmit.addEventListener('click', function() {
            const replyText = replyInput.value;
            if (replyText) { 
                const replyComment = document.createElement('div');
                let commentNome;
                let marcadorUsuario;

                if(event.target.classList.contains('replyBtn')){
                    commentNome = ``;
                    marcadorUsuario = ``;
                    pai = [event.target.parentElement.parentElement.querySelector('.comment-nome').textContent,
                        event.target.parentElement.parentElement.querySelector('.comment-texto').textContent];

                    //comentario(replyText, 'resposta');
                }
                else if(event.target.classList.contains('replyReplyBtn')){
                    commentNome = event.target.parentElement.parentElement.querySelector('.comment-nome').textContent;
                    marcadorUsuario = `<span style="color: #587bd6">@${commentNome} </span>`;
                    pai = [event.target.parentElement.parentElement.querySelector('.comment-nome').textContent,
                        event.target.parentElement.parentElement.querySelector('.comment-texto').textContent
                    ]
                    //comentario(replyText, 'respostaAninhada');
                }

                replyComment.innerHTML = `
                    <div style="margin-left: 7%">
                        <p><span class="comment-nome" style="color: #587bd6;"><strong>${usuarioNome}</strong></span><br>${marcadorUsuario}<span class="comment-texto" style="color: #f0ffffde;">${replyText}</span></p>
                        <div style="display: flex; align-items: center; justify-content: space-between; width: 165px;">
                            <button class="likeBtn"><img style="width: 13px; margin: 2px 4px 0 2px;" src="imagens/likeBtn.png" alt="likeBtn">0</button>
                            <button class="dislikeBtn"><img style="width: 13px; margin: 2px 4px 0 2px; transform: scale(-1, -1)" src="imagens/likeBtn.png" alt="likeBtn">0</button>
                            <button class="replyReplyBtn">Responder</button>
                        </div>
                    </div>
                    `;
                replySection.appendChild(replyComment);
                replyInput.value = '';
                replyInput.remove();
                divBtn.remove();
            };
        });

        replyCancel.addEventListener('click', function(){
            replyInput.value = '';
            replyInput.remove();
            replySubmit.remove();
            replyCancel.remove();
        });

    }
    
});

window.addEventListener('beforeunload', function(){
    let btn = document.querySelectorAll('.replycom');
    for(let i = 0; i < btn.length; i++){
        btn[i].remove();
    }
});

window.addEventListener('beforeunload', function(){
    const comentarios = document.querySelectorAll('.comment')
    let salvar = [];
    const local = window.location.pathname;
    var nomePag = local.split("/").pop().split('.').splice(0, 1);
    
    for(let i = 0; i < comentarios.length; i++){
        salvar.push(`${comentarios[i].innerHTML}`)
    };
    
    sessionStorage.setItem(`comentarios${nomePag}`, JSON.stringify(salvar));
})
