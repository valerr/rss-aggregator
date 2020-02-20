import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import validator from 'validator';
import {
  renderInput, renderFeeds, renderPosts, renderNotificationMessage,
} from './renderers';
import { updateFeed, addFeed } from './requests';

const app = () => {
  const state = {
    form: {
      valid: false,
      value: '',
      notification: '',
    },
    urls: [], // input url
    feeds: [], // [{ channelTitle, channelDescription, channelLink }, {}, ...]
    posts: [], // [{ feedLink, itemTitle, itemDescription, itemLink }, {}, ...]
  };

  const isValid = (url) => validator.isURL(url) && !state.urls.includes(url);

  const url = document.getElementById('urlRss');
  const form = document.getElementById('submitForm');

  url.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.form.value = value;
    state.form.valid = isValid(state.form.value);

    if (!validator.isURL(value)) {
      state.form.notification = 'notifications.wrongUrl';
    }
    if (state.urls.includes(value)) {
      state.form.notification = 'notifications.alreadyExists';
    }
    if (state.form.valid) {
      state.form.notification = '';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { urls } = state;
    const { value } = state.form;
    urls.push(value);
    addFeed(state, value);
  });

  watch(state.form, () => renderInput(state));
  watch(state, 'feeds', () => renderFeeds(state.feeds));
  watch(state, 'posts', () => renderPosts(state.posts));
  watch(state.form, 'notification', () => renderNotificationMessage(state));

  updateFeed(state);
};

export default app;
