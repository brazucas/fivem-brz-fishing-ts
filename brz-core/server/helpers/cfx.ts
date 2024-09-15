export const emitNetTyped = <
  K extends { [key in string]: any[] },
  T extends keyof K
>(
  eventName: T extends string ? T : never,
  playerid: number,
  ...data: K[T]
) => {
  emitNet(eventName, playerid, ...data);
};

export const onNetTyped = <
  K extends { [key in string]: any[] },
  T extends keyof K
>(
  eventName: T extends string ? T : never,
  func: (...args: K[T]) => any
) => {
  onNet(eventName, func);
};
