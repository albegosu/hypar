import { t as isObject } from "./utils-Cq2qA7Q3.js";
//#region src/node/config.ts
function normalizeDevToolsConfig(config, host) {
	return {
		enabled: config === true || !!(config && config.enabled),
		config: {
			...isObject(config) ? config : {},
			clientAuth: isObject(config) ? config.clientAuth ?? true : true,
			clientAuthTokens: isObject(config) ? config.clientAuthTokens ?? [] : [],
			host: isObject(config) ? config.host ?? host : host
		}
	};
}
//#endregion
export { normalizeDevToolsConfig };
