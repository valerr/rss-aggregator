import axios from 'axios';
import { concat } from 'lodash';
import parse from './parser';

const getPostLinks = (posts) => {
  const links = [];
  posts.forEach((post) => links.push(post.itemLink));
  return links;
};

const updateFeed = (appState) => {
  const promises = appState.urls.map((url) => axios.get(`https://cors-anywhere.herokuapp.com/${url}`));
  const time = 5000;
  const links = concat(getPostLinks(appState.posts), getPostLinks(appState.newPosts));
  Promise.all(promises).then((res) => {
    res.forEach(({ data }) => {
      const { postsArr } = parse(data);
      const updated = postsArr.filter((item) => !links.includes(item.itemLink));
      if (updated.length > 0) {
        appState.posts.push(...appState.newPosts);
        appState.newPosts.length = 0; // eslint-disable-line no-param-reassign
        appState.newPosts.unshift(...updated);
      }
    });
  })
    .finally(() => setTimeout(() => updateFeed(appState), time));
};

export default updateFeed;
