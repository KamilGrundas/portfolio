const resolveApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://portfolio-backend:8000/api/v1/';
  }

  const { protocol, hostname } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/v1/';
  }

  const rootDomain = hostname.startsWith('portfolio.')
    ? hostname.slice('portfolio.'.length)
    : hostname.replace(/^api\./, '');

  return `${protocol}//api.${rootDomain}/api/v1/`;
};

export const environment = {
  apiUrl: resolveApiUrl(),
};
