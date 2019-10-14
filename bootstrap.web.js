function cors(fetch) {
  const proxy = process.env.CORS_PROXY;

  return (...args) => {
    args[0] = `${proxy}/${args[0]}`;

    return fetch.apply(window, args);
  };
}

export default function bootstrap() {
  window.fetch = cors(window.fetch);
}
