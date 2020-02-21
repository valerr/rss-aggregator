import i18next from './locales/translate';

export const renderInput = (appstate) => {
  const { valid } = appstate.form;
  const input = document.querySelector('#urlRss');
  const button = document.querySelector('#rssButton');

  if (appstate.requestStatus === 'processing') {
    button.disabled = true;
    input.setAttribute('disabled', 'true');
  } else {
    input.removeAttribute('disabled');

    if (valid) {
      input.classList.add('is-valid');
      input.classList.remove('is-invalid');
      button.disabled = false;
    } else {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      button.disabled = true;
    }
  }
};


export const renderFeeds = (feeds) => {
  const ulFeed = document.querySelector('#channels');
  const channelIdElements = ulFeed.getElementsByTagName('li');
  const channelIds = [...channelIdElements].map((elem) => elem.getAttribute('id'));
  const channelsToRender = feeds.filter((channel) => !channelIds.includes(channel.feedId));

  channelsToRender.forEach((channel) => {
    const {
      title, description, link, feedId,
    } = channel;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('id', feedId);
    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.textContent = title;
    const p = document.createElement('p');
    p.textContent = description;
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
  const postLinksElements = ulPosts.getElementsByTagName('a');
  const postLinks = [...postLinksElements].map((elem) => elem.getAttribute('href'));
  const postsToRender = posts.filter((post) => !postLinks.includes(post.link));

  postsToRender.forEach((post) => {
    const { title, description, link } = post;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const a = document.createElement('a');
    a.setAttribute('href', link);
    a.innerHTML = `<span class="badge badge-secondary">New</span> ${title}`;
    const p = document.createElement('p');
    p.textContent = description;
    li.append(a);
    li.append(p);
    ulPosts.prepend(li);
  });
};

export const renderNotificationMessage = (state) => {
  const messageDiv = document.querySelector('#message');
  const message = state.form.notification ? `<div class="alert alert-primary role="alert">${i18next.t(state.form.notification)}</div>` : null;
  messageDiv.innerHTML = message;
};
