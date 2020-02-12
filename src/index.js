import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import validator from 'validator';
import axios from 'axios';
import { reverse } from 'lodash';
import {
  renderInput, renderFeeds, renderPosts, renderNotificationMessage,
} from './renderers';
import parse from './parser';
import translate from './locales/translate';
import updateFeed from './updateFeed';

const state = {
  form: {
    valid: null,
    value: null,
    notification: null,
  },
  urls: [], // input url
  feeds: [], // [{ channelTitle, channelDescription, channelLink }, {}, ...]
  newFeeds: [],
  posts: [], // [{ feedLink, itemTitle, itemDescription, itemLink }, {}, ...]
  newPosts: [],
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
    translate((t) => {
      state.form.notification = t('notifications.wrongUrl');
    });
  }
  if (state.urls.includes(value)) {
    translate((t) => {
      state.form.notification = t('notifications.alreadyExists');
    });
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
  translate((t) => {
    state.form.notification = t('notifications.loading');
  });
  const cors = `https://cors-anywhere.herokuapp.com/${value}`;
  axios.get(cors).then(({ data }) => {
    const { channel, postsArr } = parse(data);

    state.feeds.push(state.newFeeds);
    state.newFeeds.length = 0;
    state.newFeeds.push(channel);

    state.posts.push(...state.newPosts);
    state.newPosts.length = 0;
    state.newPosts.unshift(...reverse(postsArr));
    translate((t) => {
      state.form.notification = t('notifications.finished');
    });
  })
    .catch(() => {
      translate((t) => {
        state.form.notification = t('notifications.failedLoading');
      });
    });
  state.form.value = null;
  state.form.valid = null;
});

watch(state.form, () => renderInput(state));
watch(state, 'newFeeds', () => renderFeeds(state.newFeeds));
watch(state, 'newPosts', () => renderPosts(state.newPosts));
watch(state.form, 'notification', () => renderNotificationMessage(state));

updateFeed(state);
