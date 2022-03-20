const configuredAxios = (incomingConfig) => {
  const config = incomingConfig;
  const defaults = {
    method: 'GET',
    url: config.url,
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
  };
  return defaults;
};

module.exports = configuredAxios;
