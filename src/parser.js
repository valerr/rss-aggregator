export default (rss) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(rss, 'application/xml');
  const title = parsed.querySelector('title').textContent;
  const description = parsed.querySelector('description').textContent;
  return { title, description };
};
