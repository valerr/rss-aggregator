/* eslint-disable no-param-reassign */
import axios from 'axios';
import { reverse, uniqueId, differenceBy } from 'lodash';
import parse from './parser';

const proxy = 'https://cors-anywhere.herokuapp.com/';

export const updateFeed = (appState) => {
  const promises = appState.urls.map((url) => axios.get(`${proxy}${url}`));
  const time = 5000;
  Promise.all(promises).then((res) => {
    res.forEach(({ data }) => {
      const { posts } = parse(data);
      const updated = differenceBy(posts, appState.posts, 'link');
      if (updated.length > 0) {
        appState.posts.unshift(...updated);
      }
    });
  })
    .finally(() => setTimeout(() => updateFeed(appState), time));
};

export const addFeed = (appState, inputValue) => {
  appState.form.notification = 'notifications.loading';
  appState.requestStatus = 'processing';

  axios.get(`${proxy}${inputValue}`).then(({ data }) => {
    const { channel, posts } = parse(data);
    channel.feedId = uniqueId();
    appState.feeds.push(channel);
    appState.posts.unshift(...reverse(posts));
    appState.urls.push(inputValue);
  })
    .then(() => {
      appState.form.notification = 'notifications.finished';
      appState.requestStatus = 'success';
      appState.form.value = '';
      appState.form.valid = false;
    })
    .catch(() => {
      appState.form.notification = 'notifications.failedLoading';
      appState.requestStatus = 'failed';
    });
};
