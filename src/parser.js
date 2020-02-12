export default (rss) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(rss, 'application/xml');
  const items = parsed.querySelectorAll('item');
  const channelTitle = parsed.querySelector('title').textContent;
  const channelDescription = parsed.querySelector('description').textContent;
  const channelLink = parsed.querySelector('link').textContent;
  const postsArr = [];
  items.forEach((item) => {
    const feedLink = channelLink;
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;
    postsArr.push({
      feedLink, itemTitle, itemDescription, itemLink,
    });
  });
  const channel = { channelTitle, channelDescription, channelLink };
  return {
    channel, postsArr,
  };
};
