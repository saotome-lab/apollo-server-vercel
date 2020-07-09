export const setHeaders = (res, headers) => {
  for (const [name, value] of Object.entries(headers)) {
    res.setHeader(name, value);
  }
};