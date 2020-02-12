export const renderInput = (appstate) => {
  const { valid, value } = appstate.form;
  const url = document.getElementById('urlRss');
  const button = document.querySelector('#rssButton');
  if (value === null) {
    url.classList.remove('is-invalid');
    button.disabled = true;
  }
  if (valid) {
    url.classList.add('is-valid');
    url.classList.remove('is-invalid');
    button.disabled = false;
  } else {
    url.classList.add('is-invalid');
    url.classList.remove('is-valid');
    button.disabled = true;
  }
};


export const renderFeeds = (feeds) => {
  const ulFeed = document.querySelector('#channels');
  feeds.forEach((channel) => {
    const { channelTitle, channelDescription, channelLink } = channel;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.setAttribute('href', channelLink);
    a.textContent = channelTitle;
    const p = document.createElement('p');
    p.textContent = channelDescription;
    li.append(a);
    li.append(p);
    ulFeed.append(li);
  });
};

export const renderPosts = (posts) => {
  const badgesToRemove = document.getElementsByClassName('badge');
  if (badgesToRemove.length > 0) {
    [...badgesToRemove].forEach((badge) => badge.remove());
  }
  const ulPosts = document.querySelector('#posts');
  posts.forEach((post) => {
    const { itemTitle, itemDescription, itemLink } = post;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.setAttribute('href', itemLink);
    a.innerHTML = `<span class="badge badge-secondary">New</span> ${itemTitle}`;
    const p = document.createElement('p');
    p.textContent = itemDescription;
    li.append(a);
    li.append(p);
    ulPosts.prepend(li);
  });
};

export const renderNotificationMessage = (state) => {
  const messageDiv = document.querySelector('#message');
  const message = state.form.notification ? `<div class="alert alert-primary role="alert">${state.form.notification}</div>` : null;
  messageDiv.innerHTML = message;
};
