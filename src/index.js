import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import validator from 'validator';
import axios from 'axios';
import { renderInput, renderFeed } from './renderers';
import parse from './parser';

const state = {
  form: {
    valid: null,
    value: null,
  },
  link: [],
  feed: [],
};

const isValid = (url) => validator.isURL(url) && !state.link.includes(url);

const url = document.querySelector('#urlRss');
const button = document.querySelector('#rssButton');

url.addEventListener('input', (e) => {
  e.preventDefault();
  const { value } = e.target;
  state.form.value = value;
  state.form.valid = isValid(state.form.value);
});

button.addEventListener('click', (e) => {
  e.preventDefault();
  const { link, feed } = state;
  const { value } = state.form;
  link.push(value);
  const cors = `https://cors-anywhere.herokuapp.com/${value}`;
  axios.get(cors).then((response) => feed.push(parse(response.data)))
    .catch((error) => console.log(error));
  state.form.value = null;
  state.form.valid = null;
});

watch(state.form, () => renderInput(state));
watch(state, 'feed', () => renderFeed(state.feed));
