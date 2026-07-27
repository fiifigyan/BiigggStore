import { EventEmitter } from 'events';
export declare const notifier: EventEmitter<[never]>;
export type NotificationPayload = {
    id?: string;
    type: string;
    message: string;
    data?: any;
};
//# sourceMappingURL=notifier.d.ts.map