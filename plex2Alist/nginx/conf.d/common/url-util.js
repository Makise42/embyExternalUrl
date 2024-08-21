// @author: Ambitious
// @date: 2023-09-04

function proxyUri(uri) {
  return `/proxy${uri}`;
}

function appendUrlArg(u, k, v) {
  if (u.includes(k)) {
    return u;
  }
  return u + (u.includes("?") ? "&" : "?") + `${k}=${v}`;
}

function generateUrl(r, host, uri, skipKeys) {
  skipKeys = skipKeys ?? [];
  let url = host + uri;
  let isFirst = true;
  for (const key in r.args) {
    if (skipKeys.includes(key)) {
      continue;
    }
    url += isFirst ? "?" : "&";
    url += `${key}=${r.args[key]}`;
    isFirst = false;
  }
  return url;
}

function getCurrentRequestUrlPrefix(r) {
  return `${r.variables.scheme}://${r.headersIn["Host"]}`;
}

/**
 * 1.CloudDrive
 * http://mydomain:19798/static/http/mydomain:19798/False//AList/xxx.mkv
 * 2.AList
 * http://mydomain:5244/d/AList/xxx.mkv
 * see: https://regex101.com/r/Gd3JUH/1
 * @param {String} url full url
 * @returns "/AList/xxx.mkv" or "AList/xxx.mkv" or ""
 */
function getFilePathPart(url) {
  const matches = url.match(/(?:\/False\/|\/d\/)(.*)/);
  return matches ? matches[1] : "";
}

/**
 * Parses the URL and returns an object with various components.
 * @param {string} url The URL string to parse.
 * @returns {Object} An object containing protocol, username, password, host, port, pathname, search, and hash.
 */
function parseUrl(url) {
  const regex = /^(?:(\w+)?:\/\/)?(?:(\w+):(\w+)@)?(?:www\.)?([^:\/\n?#]+)(?::(\d+))?(\/[^?\n]*)?(\?[^#\n]*)?(#.*)?$/i;
  const match = url.match(regex);
  if (match) {
      const protocol = match[1] || 'http';
      const username = match[2] || '';
      const password = match[3] || '';
      const host = match[4];
      const port = match[5] || '';
      const pathname = match[6] || '';
      const search = match[7] || '';
      const hash = match[8] || '';
      const fullProtocol = `${protocol}:`;
      const fullPort = port || (fullProtocol === 'https:' ? '443' : '80');
      return {
          protocol: fullProtocol,
          username,
          password,
          host,
          port: fullPort,
          pathname,
          search,
          hash
      };
  }
  return null;
}

export default {
  proxyUri,
  appendUrlArg,
  generateUrl,
  getCurrentRequestUrlPrefix,
  getFilePathPart,
  parseUrl,
}