import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { watch } from 'melanke-watchjs';
import validator from 'validator';

const state = {
  form: {
    valid: null,
    value: null,
  },
  links: [],
};

const isValid = (url) => validator.isURL(url) && !state.links.includes(url);

const url = document.getElementById('urlRss');
const button = document.querySelector('#rssButton');

url.addEventListener('input', (e) => {
  e.preventDefault();
  const { value } = e.target;
  state.form.value = value;
  state.form.valid = isValid(state.form.value);
});

const render = (appstate) => {
  const { valid, value } = appstate.form;
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

watch(state.form, () => render(state));
