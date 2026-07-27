"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifier = void 0;
const events_1 = require("events");
exports.notifier = new events_1.EventEmitter();
// Keep the listener count reasonable in dev
exports.notifier.setMaxListeners(50);
//# sourceMappingURL=notifier.js.map