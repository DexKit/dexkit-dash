export function getWindowUrl() {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;

  return `${protocol}://${hostname}${port ? ':' + port : ''}`;
}
