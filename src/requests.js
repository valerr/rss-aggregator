/* eslint-disable no-param-reassign */
import axios from 'axios';
import { reverse, uniqueId } from 'lodash';
import parse from './parser';

const getPostLinks = (posts) => {
  const links = [];
  posts.forEach((post) => links.push(post.link));
  return links;
};

export const updateFeed = (appState) => {
  const promises = appState.urls.map((url) => axios.get(`https://cors-anywhere.herokuapp.com/${url}`));
  const time = 5000;
  Promise.all(promises).then((res) => {
    res.forEach(({ data }) => {
      const { posts } = parse(data);
      const links = getPostLinks(appState.posts);
      const updated = posts.filter((item) => !links.includes(item.link));
      if (updated.length > 0) {
        appState.posts.unshift(...updated);
      }
    });
  })
    .finally(() => setTimeout(() => updateFeed(appState), time));
};

export const addFeed = (appState, inputValue) => {
  appState.form.notification = 'notifications.loading';

  axios.get(`https://cors-anywhere.herokuapp.com/${inputValue}`).then(({ data }) => {
    const { channel, posts } = parse(data);

    channel.feedId = uniqueId();
    appState.feeds.push(channel);

    appState.posts.unshift(...reverse(posts));

    appState.form.notification = 'notifications.finished';
  })
    .catch(() => {
      appState.form.notification = 'notifications.failedLoading';
    });
  appState.form.value = null;
  appState.form.valid = null;
};