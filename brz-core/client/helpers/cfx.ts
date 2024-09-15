export const emitNetTyped = <
  K extends { [key in string]: any[] },
  T extends keyof K
>(
  eventName: T extends string ? T : never,
  ...data: K[T]
) => {
  emitNet(eventName, ...data);
};
