import { Identifiers } from '../types';

export default function roomService(
  connectedSocketIds: string[],
  room: Identifiers[],
): Identifiers[] {
  return room.reduce(
    (array: Identifiers[], item: Identifiers): Identifiers[] => {
      if (connectedSocketIds.includes(item.socketId)) {
        array.push(item);
      }
      return array;
    },
    [] as Identifiers[],
  );
}
