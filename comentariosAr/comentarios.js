usuarioNome = sessionStorage.getItem("nome");
if(usuarioNome == null){
    usuarioNome = 'Anônimo';
}

document.getElementById('submitComment').addEventListener('click', function() {
    const commentText = document.getElementById('newComment').value;
    if (commentText) {
        const commentSection = document.getElementById('commentSection');
        const newComment = document.createElement('div');
        newComment.classList.add('comment');
        newComment.innerHTML = `
            <p><span style="color: #587bd6""><strong>${usuarioNome} </strong></span><span style="color: #313131">${commentText}</span></p>
            <div style="display: flex; justify-content: space-between; margin-left: 78%">
                <button class="likeBtn">👍 0</button>
                <button class="replyBtn">Responder</button>
            </div>
            <div class="replySection"></div>
        `;
        commentSection.appendChild(newComment);
        document.getElementById('newComment').value = '';
    }
});

document.getElementById('commentSection').addEventListener('click', function(event) {
    if (event.target.classList.contains('likeBtn')) {
        const likeBtn = event.target;
        var count = parseInt(likeBtn.textContent.split(' ')[1]) + 1;
        likeBtn.textContent = `👍 ${count}`;
    } else if (event.target.classList.contains('replyBtn')) {
        const replySection = event.target.closest('.comment').querySelector('.replySection');
        const replyInput = document.createElement('textarea');
        const replySubmit = document.createElement('button');
        replySubmit.textContent = 'Responder';
        
        replySection.appendChild(replyInput);
        replySection.appendChild(replySubmit);
        
        replySubmit.addEventListener('click', function() {
            const replyText = replyInput.value;
            if (replyText) {
                const replyComment = document.createElement('div');
                replyComment.innerHTML = `<p><span style="color: #587bd6"><strong>${usuarioNome} </strong></span><span style="color: #313131">${replyText}</span></p>`;
                replySection.appendChild(replyComment);
                replyInput.value = '';
                replyInput.remove();
                replySubmit.remove();
            }
        });
    }
});