import { isIP } from "node:net";
//#region src/node/utils.ts
function isObject(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}
function normalizeHttpServerUrl(host, port) {
	return `http://${host === "127.0.0.1" ? "localhost" : isIP(host) === 6 ? `[${host}]` : host}:${port}`;
}
//#endregion
export { normalizeHttpServerUrl as n, isObject as t };
