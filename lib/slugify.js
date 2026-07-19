export function slugify(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 75)
    .replace(/-$/, '');
}

export function articlePath(article) {
  return `/article/${article.id}-${slugify(article.title)}`;
}

export function articleUrl(article) {
  return `https://www.newsoracle.online/article/${article.id}-${slugify(article.title)}`;
}
