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

export const renderFeed = (feed) => {
  const div = document.querySelector('#rssContainer');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  feed.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    const title = document.createElement('h2');
    title.textContent = item.title;
    const description = document.createElement('p');
    description.textContent = item.description;
    li.append(title);
    li.append(description);
    ul.append(li);
  });
  div.append(ul);
};
