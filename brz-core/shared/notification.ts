export type NotificationClientAdapter = {
  notify: (message: string, type: "success" | "error") => void;
};

export type NotificationServerAdapter = {
  notify: (source: number, message: string, type: "success" | "error") => void;
};
