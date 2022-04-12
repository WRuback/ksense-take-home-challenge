// Pointers to the page details.
const loadingDisplay = $('#loadingDisplay');
const userTableInfo = $('#userTableInfo');
const postNameDisplay = $('#postNameDisplay');
const postDisplay = $('#postDisplay');

// Fetches the user data. Returns null if there is an error.
async function fetchUsers() {
  const output = await fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => response.json())
    .catch((error) => {
      console.error(error);
      return null;
    });
  return output;
};

// Fetches the post data based on id. Returns null if there is an error.
async function fetchPost(id) {
  const output = await fetch(`https://jsonplaceholder.typicode.com/users/${id}/posts`)
    .then(response => response.json())
    .catch((error) => {
      console.error(error);
      return null;
    });
  return output;
};

// Renders the user data after clearing information. Adds modal information from Bulma to create the post links.
function renderUsers(userData) {
  userTableInfo.text('');
  for (user of userData) {
    userTableInfo.append(`
          <tr>
            <th>${user.id}</th>
            <th><a class="js-modal-trigger" data-name="${user.name}" data-username="${user.username}" data-id="${user.id}" data-target="postModal">${user.name}</a></th>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</td>
            <td>${user.phone}</td>
            <td>${user.website}</td>
            <td>${user.company.name}</td>
            <td>${user.company.catchPhrase}</td>
            <td>${user.company.bs}</td>
            <th><a class="js-modal-trigger" data-name="${user.name}" data-username="${user.username}" data-id="${user.id}" data-target="postModal">See Posts</a></th>
          </tr>`);
  }

  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      $target.classList.add('is-active');
      modalPosts($trigger.dataset.name, $trigger.dataset.username, $trigger.dataset.id);
    });
  });
};

// Renders the post data after clearing information onto the modal.
function renderPosts(postData) {
  postDisplay.text('');
  postDisplay.append('<hr>');
  for (post of postData) {
    postDisplay.append(`
    <h4>${post.title}</h4>
    <p>${post.body}</p>
    <hr>`);
  }
}

// Changes the title, fetches the post data, and displays it on the modal.
async function modalPosts(name, username, id) {
  postNameDisplay.text(`${name} (${username}) Posts`);
  postDisplay.text('');
  postDisplay.append('<p>Loading post data...</p>');
  const data = await fetchPost(id);
  if (data) {
    renderPosts(data);
  }
}

// Fetches and renders the user data on startup.
async function startUp() {
  const data = await fetchUsers();
  if (data) {
    loadingDisplay.hide();
    renderUsers(data);
  }
};

// Runs the startup
startUp();

// Modal code unchanged from https://bulma.io/
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});