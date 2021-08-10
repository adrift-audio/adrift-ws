export default function getConnections(io: any) {
  const ids = [];
  io.in('/').sockets.sockets.forEach(({ id }) => ids.push(id));
  return ids;
}
