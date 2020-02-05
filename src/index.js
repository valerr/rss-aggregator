import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import validator from 'validator';
import axios from 'axios';
import { renderInput, renderFeed, renderErrorMessage } from './renderers';
import parse from './parser';
import translate from './locales/translate';

const state = {
  form: {
    valid: null,
    value: null,
    error: null,
  },
  channels: [],
  feed: [],
};

const isValid = (url) => validator.isURL(url) && !state.channels.includes(url);

const url = document.querySelector('#urlRss');
const form = document.querySelector('form');

// let feedId;
// let postId;

url.addEventListener('input', (e) => {
  e.preventDefault();
  const { value } = e.target;
  state.form.value = value;
  state.form.valid = isValid(state.form.value);

  if (!validator.isURL(value)) {
    translate((t) => {
      state.form.error = t('errors.wrongUrl');
    });
  }
  if (state.channels.includes(value)) {
    translate((t) => {
      state.form.error = t('errors.alreadyExists');
    });
  }
  if (state.form.valid) {
    state.form.error = '';
  }
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { channels, feed } = state;
  const { value } = state.form;
  channels.push(value);
  const cors = `https://cors-anywhere.herokuapp.com/${value}`;
  axios.get(cors).then(({ data }) => feed.push(parse(data)));
  state.form.value = null;
  state.form.valid = null;
});

watch(state.form, () => renderInput(state));
watch(state, 'feed', () => renderFeed(state.feed));
watch(state.form, 'error', () => renderErrorMessage(state));
