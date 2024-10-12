const commentSection = document.getElementById('commentSection');
const local = window.location.pathname;
var nomePag = local.split("/").pop().split('.').splice(0, 1);
let comentarios = JSON.parse(sessionStorage.getItem(`comentarios${nomePag}`));

for(let i = 0; i < comentarios.length; i++){
    const comment = document.createElement('div');
    comment.classList.add('comment');

    comment.innerHTML = comentarios[i];
    commentSection.appendChild(comment);
}
