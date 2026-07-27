import { EventEmitter } from 'events';

export const notifier = new EventEmitter();

// Keep the listener count reasonable in dev
notifier.setMaxListeners(50);

export type NotificationPayload = {
  id?: string;
  type: string;
  message: string;
  data?: any;
};
