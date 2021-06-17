


export function getWindowUrl() {
  let protocol = window.location.protocol
  let hostname = window.location.hostname
  let port = window.location.port
  
  return `${protocol}://${hostname}${port ? ':'+port : ''}`;
}