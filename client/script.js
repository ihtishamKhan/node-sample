const postsContainer = document.querySelector('.posts-container');

function formSubmitted(event, form) {
    event.preventDefault();
    let title = form.title.value;

    axios.post('http://127.0.0.1:3000/posts', {
            title
        })
        .then((response) => {
            console.log(response.data);
        }, (error) => {
            console.log(error);
        });

    title = '';
}

function getPosts(theUrl) {
    axios.get(theUrl)
        .then((response) => {
            const posts = response.data;
            const renderedPosts = Object.values(posts).map(post => {
                let commentsData = [];
                let comments = axios.get(`http://127.0.0.1:3001/posts/${post.id}/comments`)
                    .then((response) => {
                        const commentsData = response.data;
                        commentsData.map(comment => {
                            commentContainer = document.querySelector(`#comment-container${post.id}`);
                            commentContainer.innerHTML += `<li>${comment.content}</li>`;
                        });

                    }).catch((error) => {
                        console.log(error);
                    });

                return `
                    <div class="card" style="width: 30%; margin-bottom: 20px;">
                        <div class="card-body">
                            <h3>${post.title}</h3>
                            <ul id="comment-container${post.id}"></ul>
                            <form name="myCommentform" action="" method="POST">
                                <div class="form-group mb-3">
                                    <label>New Comment</label>
                                    <input type="text" class="form-control" name="content">
                                </div>
                                <div class="form-group">
                                    <button type="button" class="btn btn-primary btn-sm" onClick="commentFormSubmitted(event, this.form, '${post.id}')">Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `
            }).join(" ");

            postsContainer.innerHTML = renderedPosts;
        }, (error) => {
            console.log(error);
        });
}

function commentFormSubmitted(event, form, postId) {
    event.preventDefault();
    let content = form.content.value;

    axios.post(`http://127.0.0.1:3001/posts/${postId}/comments`, {
            content
        })
        .then((response) => {
            console.log(response.data);
        }, (error) => {
            console.log(error);
        });

    content = '';
}

const allPosts = getPosts('http://127.0.0.1:3000/posts');