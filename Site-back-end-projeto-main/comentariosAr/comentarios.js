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
            <div style="margin: auto; max-width: 90%; padding-bottom: 10px;">
                <p><span style="color: #587bd6""><strong>${usuarioNome} </strong></span><br><span style="color: #313131">${commentText}</span></p>
                <div style="">
                    <button class="likeBtn">👍 0</button>
                    <button class="replyBtn">Responder</button>
                </div>
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
                replyComment.innerHTML = `
                    <div style="margin-left: 7%">
                        <p><span style="color: #587bd6"><strong>${usuarioNome} </strong><br></span><span style="color: #313131">${replyText}</span></p>
                        <div style="">
                            <button class="likeBtn">👍 0</button>
                            <button class="replyReplyBtn">Responder</button>
                        </div>
                    </div>
                    `;
                replySection.appendChild(replyComment);
                replyInput.value = '';
                replyInput.remove();
                replySubmit.remove();
            }

        });
    }
    if(event.target.classList.contains('replyReplyBtn')){
        const replyReplySection = event.target.closest('.comment').querySelector('.replySection');
        const replyReplyInput = document.createElement('textarea');
        const replyReplySubmit = document.createElement('button');
        replyReplySubmit.textContent = 'Responder';

        replyReplySection.appendChild(replyReplyInput);
        replyReplySection.appendChild(replyReplySubmit);

        replyReplySubmit.addEventListener('click', function() {
            const replyReplyText = replyReplyInput.value;
            if (replyReplyText) {
                const replyComment = document.createElement('div');
                replyComment.innerHTML = `
                    <div style="margin-left: 14%">
                        <p><span style="color: #587bd6"><strong>${usuarioNome} </strong></span><br><span style="color: #313131">${replyReplyText}</span></p>
                        <div style="">
                            <button class="likeBtn">👍 0</button>
                            <button class="replyReplyBtn">Responder</button>
                        </div>
                    </div>
                    `;
                replyReplySection.appendChild(replyComment);
                replyReplyInput.value = '';
                replyReplyInput.remove();
                replyReplySubmit.remove();
            }

        });
    }
});