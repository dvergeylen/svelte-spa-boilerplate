const path2url = (path) => {
  const sanitized = (Array.isArray(path)
    ? path : [path]).map((s) => s.replace(/^\/+/, ''));

  return `${window.location.protocol}//${window.location.host}/${sanitized.join('/')}`;
};

export {
  path2url,
};
