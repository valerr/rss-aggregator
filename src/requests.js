/* eslint-disable no-param-reassign */
import axios from 'axios';
import { concat, reverse } from 'lodash';
import parse from './parser';
import translate from './locales/translate';

const getPostLinks = (posts) => {
  const links = [];
  posts.forEach((post) => links.push(post.link));
  return links;
};

export const updateFeed = (appState) => {
  const promises = appState.urls.map((url) => axios.get(`https://cors-anywhere.herokuapp.com/${url}`));
  const time = 5000;
  const links = concat(getPostLinks(appState.posts), getPostLinks(appState.newPosts));
  Promise.all(promises).then((res) => {
    res.forEach(({ data }) => {
      const { postsArr } = parse(data);
      const updated = postsArr.filter((item) => !links.includes(item.link));
      if (updated.length > 0) {
        appState.posts.push(...appState.newPosts);
        appState.newPosts.length = 0;
        appState.newPosts.unshift(...updated);
      }
    });
  })
    .finally(() => setTimeout(() => updateFeed(appState), time));
};

export const addFeed = (appState, inputValue) => {
  translate((t) => {
    appState.form.notification = t('notifications.loading');
  });
  axios.get(`https://cors-anywhere.herokuapp.com/${inputValue}`).then(({ data }) => {
    const { channel, postsArr } = parse(data);

    appState.feeds.push(appState.newFeeds);
    appState.newFeeds.length = 0;
    appState.newFeeds.push(channel);

    appState.newPosts.unshift(...reverse(postsArr));
    translate((t) => {
      appState.form.notification = t('notifications.finished');
    });
  })
    .catch(() => {
      translate((t) => {
        appState.form.notification = t('notifications.failedLoading');
      });
    });
  appState.form.value = null;
  appState.form.valid = null;
};
