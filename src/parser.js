export default (rss) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(rss, 'application/xml');
  const items = parsed.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const feedLink = parsed.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    posts.push({
      feedLink, title, description, link,
    });
  });
  const channel = {
    title: parsed.querySelector('title').textContent,
    description: parsed.querySelector('description').textContent,
    link: parsed.querySelector('link').textContent,
  };
  return {
    channel, posts,
  };
};
