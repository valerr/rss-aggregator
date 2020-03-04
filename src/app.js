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
    requestStatus: 'waiting',
    urls: [], // input urls
    feeds: [], // [{ title, description, link }, {}, ...]
    posts: [], // [{ feedLink, title, description, link }, {}, ...]
  };

  const inputElement = document.getElementById('urlRss');
  const form = document.getElementById('submitForm');
  const exampleLinks = document.getElementsByClassName('example');

  [...exampleLinks].forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const { href } = link;
      inputElement.setAttribute('value', href);
      if (state.urls.includes(href)) {
        state.form.valid = false;
        state.form.notification = 'notifications.alreadyExists';
      } else {
        state.form.valid = true;
        state.form.value = href;
        state.form.notification = '';
      }
    });
  });

  inputElement.addEventListener('input', (e) => {
    e.preventDefault();
    const { value } = e.target;
    state.form.value = value;

    if (!validator.isURL(value)) {
      state.form.valid = false;
      state.form.notification = 'notifications.wrongUrl';
      return;
    }
    if (state.urls.includes(value)) {
      state.form.valid = false;
      state.form.notification = 'notifications.alreadyExists';
      return;
    }
    state.form.valid = true;
    state.form.notification = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = state.form;
    addFeed(state, value);
  });

  watch(state.form, 'valid', () => renderInput(state));
  watch(state.form, 'value', () => {
    inputElement.value = state.form.value;
  });
  watch(state, 'feeds', () => renderFeeds(state.feeds));
  watch(state, 'posts', () => renderPosts(state.posts));
  watch(state.form, 'notification', () => renderNotificationMessage(state));
  watch(state, 'requestStatus', () => renderInput(state));

  updateFeed(state);
};

export default app;
