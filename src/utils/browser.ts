export function getWindowUrl() {
  let protocol = window.location.protocol;
  let hostname = window.location.hostname;
  let port = window.location.port;

  return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}

export function isValidURL(url: string): boolean {
  var res = url.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
}
