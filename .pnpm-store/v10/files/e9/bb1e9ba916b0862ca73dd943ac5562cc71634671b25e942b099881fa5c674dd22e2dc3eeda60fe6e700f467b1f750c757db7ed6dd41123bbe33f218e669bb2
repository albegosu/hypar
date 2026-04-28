import { DEVTOOLS_RPC_DUMP_DIRNAME } from "@vitejs/devtools-kit/constants";
import { dumpFunctions, getRpcHandler } from "@vitejs/devtools-rpc";
//#region src/node/static-dump.ts
function makeDumpKey(name) {
	return encodeURIComponent(name.replaceAll(":", "~"));
}
function makeStaticPath(name) {
	return `${DEVTOOLS_RPC_DUMP_DIRNAME}/${makeDumpKey(name)}.static.json`;
}
function makeQueryRecordPath(name, hash) {
	return `${DEVTOOLS_RPC_DUMP_DIRNAME}/${makeDumpKey(name)}.record.${hash}.json`;
}
function makeQueryFallbackPath(name) {
	return `${DEVTOOLS_RPC_DUMP_DIRNAME}/${makeDumpKey(name)}.fallback.json`;
}
async function resolveRecord(record) {
	return typeof record === "function" ? await record() : record;
}
async function collectStaticRpcDump(definitions, context) {
	const manifest = {};
	const files = {};
	for (const definition of definitions) {
		const type = definition.type ?? "query";
		if (type === "static") {
			const handler = await getRpcHandler(definition, context);
			const path = makeStaticPath(definition.name);
			files[path] = { output: await Promise.resolve(handler()) };
			manifest[definition.name] = {
				type: "static",
				path
			};
			continue;
		}
		if (type !== "query") continue;
		const store = await dumpFunctions([definition], context);
		if (!(definition.name in store.definitions)) continue;
		const queryEntry = {
			type: "query",
			records: {}
		};
		const prefix = `${definition.name}---`;
		for (const [recordKey, recordOrGetter] of Object.entries(store.records)) {
			if (!recordKey.startsWith(prefix)) continue;
			const key = recordKey.slice(prefix.length);
			const record = await resolveRecord(recordOrGetter);
			if (key === "fallback") {
				const path = makeQueryFallbackPath(definition.name);
				files[path] = record;
				queryEntry.fallback = path;
			} else {
				const path = makeQueryRecordPath(definition.name, key);
				files[path] = record;
				queryEntry.records[key] = path;
			}
		}
		if (!Object.keys(queryEntry.records).length && !queryEntry.fallback) continue;
		manifest[definition.name] = queryEntry;
	}
	return {
		manifest,
		files
	};
}
//#endregion
export { collectStaticRpcDump };
