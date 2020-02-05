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


const renderChannel = (channel) => {
  const {
    channelTitle, channelDescription, channelLink, postsArr,
  } = channel;
  console.log('renderChannel props', channelTitle, channelDescription, channelLink, postsArr);
  const div = document.querySelector('#rssContainer');
  const divChannel = document.createElement('div');
  divChannel.classList.add('container');
  const a = document.createElement('a');
  a.setAttribute('href', channelLink);
  a.textContent = channelTitle;
  const p = document.createElement('p');
  p.textContent = channelDescription;
  divChannel.append(a);
  divChannel.append(p);
  div.append(divChannel);

  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  postsArr.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const title = document.createElement('a');
    title.setAttribute('href', item.itemLink);
    title.textContent = item.itemTitle;
    const description = document.createElement('p');
    description.textContent = item.itemDescription;
    li.append(title);
    li.append(description);
    ul.append(li);
  });
  div.append(ul);
};

export const renderFeed = (feed) => {
  feed.forEach((channel) => {
    renderChannel(channel);
  });
};

export const renderErrorMessage = (state) => {
  const errorDiv = document.querySelector('#errors');
  const message = state.form.error ? `<div class="alert alert-primary role="alert">${state.form.error}</div>` : null;
  errorDiv.innerHTML = message;
};
