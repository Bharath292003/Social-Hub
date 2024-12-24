"use strict"
document.addEventListener("DOMContentLoaded", async () => {


    renderAllPosts();

    const searchInput = document.querySelector('.searchInput');
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.toLowerCase();

        if (query === '') {
            renderAllPosts();
        } else {
            const searchedPosts = await fetchSearchedPosts(query);
            console.log('searchedposts', searchedPosts);
            renderAllPosts(searchedPosts);
        }
    });

    const sortButton = document.getElementById('sort-button');
    const ascCheckbox = document.getElementById('asc-check');
    const descCheckbox = document.getElementById('desc-check');
    ascCheckbox.addEventListener('click', () => {
        descCheckbox.checked = false;
    })
    descCheckbox.addEventListener('change', () => {
        ascCheckbox.checked = false;
    })
    sortButton.addEventListener('click', async () => {
        const sortByDropdown = document.getElementById('dropdown-sortBy');
        const sortBy = sortByDropdown.value.toLowerCase();

        let order = '';
        if (ascCheckbox.checked) {
            console.log('hi');
            order = 'asc';
            descCheckbox.checked = false;
        } else if (descCheckbox.checked) {
            order = 'desc';
            ascCheckbox.checked = false;
        }

        if (sortBy && order) {
            // const sortedPosts = await fetchSortPosts(sortBy, order);
            const sortedPosts = await fetchAllPosts();
            if (sortBy === 'likes' || sortBy === 'dislikes') {
                sortedPosts.sort((post1, post2) => {
                    const val1 = post1.reactions[sortBy];
                    const val2 = post2.reactions[sortBy];
                    console.log(val1, val2);
                    return order === 'asc' ? val1 - val2 : val2 - val1;
                });
            }
            console.log('sorted', sortedPosts);
            renderAllPosts(sortedPosts);
        }
    });
});

function printToastMessage(error) {
    Toastify({
        text: `${error}`,
        duration: 2000,
        gravity: "top",
        position: "right",
        className: "toastify",
        backgroundColor: "linear-gradient(to right, #dc3545, #c82333)",
    }).showToast();
}

// async function fetchCommon(api) {
//     try {
//         const response = await fetch(api);
//         if (!response.ok) {
//             throw new Error("cant fetch data");
//         }
//         return response.json();
//     } catch (error) {
//         console.error(error);
//     }
// }
async function fetchAllPosts() {
    try {
        const response1 = await fetch('https://dummyjson.com/posts');
        if (!response1.ok) {
            throw new Error("Failed to fetch post data.");
        }
        const data = await response1.json();
        return data.posts;
    } catch (error) {
        printToastMessage(error.message);
    }

}

async function fetchSearchedPosts(query) {
    try {

        const response2 = await fetch(`https://dummyjson.com/posts/search?q=${query}`);
        if (!response2.ok) {
            throw new Error(`Failed to fetch posts for Search`);
        }
        const data = await response2.json();
        console.log('data', data)
        return data.posts;
    } catch (error) {
        printToastMessage(error.message);
    }
}

async function fetchSortPosts(sortBy, order) {
    // console.log(sortBy, order);
    try {

        const response3 = await fetch(`https://dummyjson.com/posts?sortBy=${sortBy}&order=${order}`);
        if (!response3.ok) {
            throw new Error(`Failed to fetch posts for query: ${sortBy}`);
        }
        const data = await response3.json();
        return data.posts;
    } catch (error) {
        console.log('sort-error', error);
    }
}
async function deletePostsbyId(postId) {
    try {

        const response4 = await fetch(`https://dummyjson.com/postss/${postId}`, {
            method: 'DELETE',
        });
        if (!response4.ok) {
            throw new Error(`Failed to delete post with id: ${postId}`);
        }
        const data = await response4.json();
        return data.posts;
    } catch (error) {
        printToastMessage(error.message);
    }
}

async function renderAllPosts(postsToRender) {
    const cardContainer = document.getElementById('cards-container');
    cardContainer.innerHTML = '';

    const posts = postsToRender ? postsToRender : await fetchAllPosts();

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h2');
        title.textContent = post.title;

        const body = document.createElement('p');
        body.textContent = post.body;

        const likes = document.createElement('span');
        likes.className = 'likes';
        likes.textContent = `❤️ ${post.reactions.likes}`;

        const dislikes = document.createElement('span');
        dislikes.className = 'dislikes';
        dislikes.textContent = `👎 ${post.reactions.dislikes}`;
        const deleteIcon = document.createElement('span');
        deleteIcon.className = 'deleteIcon';
        deleteIcon.textContent = '🗑️';

        deleteIcon.addEventListener('click', () => {
            const removeConfirm = document.getElementById('delete-confirmation');
            const yesBtn = document.getElementById('yes-btn');
            const noBtn = document.getElementById('no-btn');
            removeConfirm.style.display = 'block';
            yesBtn.addEventListener('click', async () => {
                await deletePostsbyId(post.id);

                cardContainer.removeChild(card);

                removeConfirm.style.display = 'none';

            })
            noBtn.addEventListener('click', () => {
                removeConfirm.style.display = 'none';
            })
        });
        card.appendChild(deleteIcon);
        card.appendChild(title);
        card.appendChild(body);
        card.appendChild(likes);
        card.appendChild(dislikes);
        cardContainer.appendChild(card);
    });
}
