import { BirpcFn, BirpcReturn } from "birpc";
import { GenericSchema, InferInput } from "valibot";

//#region src/cache.d.ts
interface RpcCacheOptions {
  functions: string[];
  keySerializer?: (args: unknown[]) => string;
}
/**
 * @experimental API is expected to change.
 */
declare class RpcCacheManager {
  private cacheMap;
  private options;
  private keySerializer;
  constructor(options: RpcCacheOptions);
  updateOptions(options: Partial<RpcCacheOptions>): void;
  cached<T>(m: string, a: unknown[]): T | undefined;
  apply(req: {
    m: string;
    a: unknown[];
  }, res: unknown): void;
  validate(m: string): boolean;
  clear(fn?: string): void;
}
//#endregion
//#region src/utils.d.ts
/** Infers TypeScript tuple type from Valibot schema array */
type InferArgsType<S extends RpcArgsSchema | undefined> = S extends readonly [] ? [] : S extends readonly [infer H, ...infer T] ? H extends GenericSchema ? T extends readonly GenericSchema[] ? [InferInput<H>, ...InferArgsType<T>] : never : never : never;
/** Infers TypeScript return type from Valibot return schema */
type InferReturnType<S extends RpcReturnSchema | undefined> = S extends RpcReturnSchema ? InferInput<S> : void;
//#endregion
//#region src/types.d.ts
type Thenable<T> = T | Promise<T>;
type EntriesToObject<T extends readonly [string, any][]> = { [K in T[number] as K[0]]: K[1] };
/**
 * Type of the RPC function,
 * - static: A function that returns a static data, no arguments (can be cached and dumped)
 * - action: A function that performs an action (no data returned)
 * - event: A function that emits an event (no data returned), and does not wait for a response
 * - query: A function that queries a resource
 *
 * By default, the function is a query function.
 */
type RpcFunctionType = 'static' | 'action' | 'event' | 'query';
/**
 * Manages dynamic function registration and provides a type-safe proxy for accessing functions.
 */
interface RpcFunctionsCollector<LocalFunctions, SetupContext = undefined> {
  /** User-provided context passed to setup functions */
  context: SetupContext;
  /** Type-safe proxy for calling registered functions */
  readonly functions: LocalFunctions;
  /** Map of registered function definitions keyed by function name */
  readonly definitions: Map<string, RpcFunctionDefinitionAnyWithContext<SetupContext>>;
  /** Register a new function definition */
  register: (fn: RpcFunctionDefinitionAnyWithContext<SetupContext>) => void;
  /** Update an existing function definition */
  update: (fn: RpcFunctionDefinitionAnyWithContext<SetupContext>) => void;
  /** Subscribe to function changes, returns unsubscribe function */
  onChanged: (fn: (id?: string) => void) => (() => void);
}
/**
 * Result returned by a function's setup method.
 */
interface RpcFunctionSetupResult<ARGS extends any[], RETURN = void> {
  /** Function handler */
  handler?: (...args: ARGS) => RETURN;
  /** Optional dump definition (overrides definition-level dump) */
  dump?: RpcDumpDefinition<ARGS, RETURN>;
}
/** Valibot schema array for validating function arguments */
type RpcArgsSchema = readonly GenericSchema[];
/** Valibot schema for validating function return value */
type RpcReturnSchema = GenericSchema;
/**
 * Single record in a dump store with pre-computed results.
 */
interface RpcDumpRecord<ARGS extends any[] = any[], RETURN = any> {
  /** Function arguments */
  inputs: ARGS;
  /** Result (value or lazy function) */
  output?: RETURN;
  /** Error if execution failed */
  error?: {
    /** Error message */message: string; /** Error type name (e.g., "Error", "TypeError") */
    name: string;
  };
}
/**
 * Defines argument combinations to pre-compute for a function.
 */
interface RpcDumpDefinition<ARGS extends any[] = any[], RETURN = any> {
  /** Argument combinations to pre-compute by executing handler */
  inputs?: ARGS[];
  /** Pre-computed records to use directly (bypasses handler execution) */
  records?: RpcDumpRecord<ARGS, RETURN>[];
  /** Fallback value when no match found */
  fallback?: RETURN;
}
/**
 * Dynamically generates dump definitions based on context.
 */
type RpcDumpGetter<ARGS extends any[] = any[], RETURN = any, CONTEXT = any> = (context: CONTEXT, handler: (...args: ARGS) => RETURN) => Thenable<RpcDumpDefinition<ARGS, RETURN>>;
/**
 * Dump configuration (static object or dynamic function).
 */
type RpcDump<ARGS extends any[] = any[], RETURN = any, CONTEXT = any> = RpcDumpDefinition<ARGS, RETURN> | RpcDumpGetter<ARGS, RETURN, CONTEXT>;
/**
 * Base function definition metadata.
 */
interface RpcFunctionDefinitionBase {
  /** Function name (unique identifier) */
  name: string;
  /** Function type (static, action, event, or query) */
  type?: RpcFunctionType;
}
/**
 * Dump store containing pre-computed results.
 * Flat structure for serialization and efficient lookups.
 */
interface RpcDumpStore<T = any> {
  /** Function definitions keyed by name */
  definitions: Record<string, RpcFunctionDefinitionBase>;
  /** Records keyed by '<function-name>---<hash>' or '<function-name>---fallback' */
  records: Record<string, RpcDumpRecord | (() => Promise<RpcDumpRecord>)>;
  /** @internal */
  _functions?: T;
}
/**
 * Dump client options.
 */
interface RpcDumpClientOptions {
  /** Called when arguments don't match any pre-computed entry */
  onMiss?: (functionName: string, args: any[]) => void;
}
/**
 * Options for collecting dumps.
 */
interface RpcDumpCollectionOptions {
  /**
   * Concurrency control for parallel execution.
   * - `false` or `undefined`: sequential execution (default)
   * - `true`: parallel execution with concurrency limit of 5
   * - `number`: parallel execution with specified concurrency limit
   */
  concurrency?: boolean | number | null;
}
/**
 * RPC function definition with optional dump support.
 */
type RpcFunctionDefinition<NAME extends string, TYPE extends RpcFunctionType = 'query', ARGS extends any[] = [], RETURN = void, AS extends RpcArgsSchema | undefined = undefined, RS extends RpcReturnSchema | undefined = undefined, CONTEXT = undefined> = [AS, RS] extends [undefined, undefined] ? {
  /** Function name (unique identifier) */name: NAME; /** Function type (static, action, event, or query) */
  type?: TYPE; /** Whether the function results should be cached */
  cacheable?: boolean; /** Valibot schema array for validating function arguments */
  args?: AS; /** Valibot schema for validating function return value */
  returns?: RS; /** Setup function called with context to initialize handler and dump */
  setup?: (context: CONTEXT) => Thenable<RpcFunctionSetupResult<ARGS, RETURN>>; /** Function implementation (required if setup doesn't provide one) */
  handler?: (...args: ARGS) => RETURN; /** Dump definition (setup dump takes priority) */
  dump?: RpcDump<ARGS, RETURN, CONTEXT>;
  __resolved?: RpcFunctionSetupResult<ARGS, RETURN>;
  __promise?: Thenable<RpcFunctionSetupResult<ARGS, RETURN>>;
} : {
  /** Function name (unique identifier) */name: NAME; /** Function type (static, action, event, or query) */
  type?: TYPE; /** Whether the function results should be cached */
  cacheable?: boolean; /** Valibot schema array for validating function arguments */
  args: AS; /** Valibot schema for validating function return value */
  returns: RS; /** Setup function called with context to initialize handler and dump */
  setup?: (context: CONTEXT) => Thenable<RpcFunctionSetupResult<InferArgsType<AS>, InferReturnType<RS>>>; /** Function implementation (required if setup doesn't provide one) */
  handler?: (...args: InferArgsType<AS>) => InferReturnType<RS>; /** Dump definition (setup dump takes priority) */
  dump?: RpcDump<InferArgsType<AS>, InferReturnType<RS>, CONTEXT>;
  __resolved?: RpcFunctionSetupResult<InferArgsType<AS>, InferReturnType<RS>>;
  __promise?: Thenable<RpcFunctionSetupResult<InferArgsType<AS>, InferReturnType<RS>>>;
};
type RpcFunctionDefinitionToFunction<T extends RpcFunctionDefinitionAny> = T extends {
  args: infer AS;
  returns: infer RS;
} ? AS extends RpcArgsSchema ? RS extends RpcReturnSchema ? (...args: InferArgsType<AS>) => InferReturnType<RS> : never : never : T extends RpcFunctionDefinition<string, any, infer ARGS, infer RETURN, any, any, any> ? (...args: ARGS) => RETURN : never;
type RpcFunctionDefinitionAny = RpcFunctionDefinition<string, any, any, any, any, any, any>;
type RpcFunctionDefinitionAnyWithContext<CONTEXT = undefined> = RpcFunctionDefinition<string, any, any, any, any, any, CONTEXT>;
type RpcDefinitionsToFunctions<T extends readonly RpcFunctionDefinitionAny[]> = EntriesToObject<{ [K in keyof T]: [T[K]['name'], RpcFunctionDefinitionToFunction<T[K]>] }>;
type RpcDefinitionsFilter<T extends readonly RpcFunctionDefinitionAny[], Type extends RpcFunctionType> = { [K in keyof T]: T[K] extends {
  type: Type;
} ? T[K] : never };
//#endregion
//#region src/collector.d.ts
declare class RpcFunctionsCollectorBase<LocalFunctions extends Record<string, any>, SetupContext> implements RpcFunctionsCollector<LocalFunctions, SetupContext> {
  readonly context: SetupContext;
  readonly definitions: Map<string, RpcFunctionDefinition<string, any, any, any, any, any, SetupContext>>;
  readonly functions: LocalFunctions;
  private readonly _onChanged;
  constructor(context: SetupContext);
  register(fn: RpcFunctionDefinition<string, any, any, any, any, any, SetupContext>, force?: boolean): void;
  update(fn: RpcFunctionDefinition<string, any, any, any, any, any, SetupContext>, force?: boolean): void;
  onChanged(fn: (id?: string) => void): () => void;
  getHandler<T extends keyof LocalFunctions>(name: T): Promise<LocalFunctions[T]>;
  getSchema<T extends keyof LocalFunctions>(name: T): {
    args: RpcArgsSchema | undefined;
    returns: RpcReturnSchema | undefined;
  };
  has(name: string): boolean;
  get(name: string): RpcFunctionDefinition<string, any, any, any, any, any, SetupContext> | undefined;
  list(): string[];
}
//#endregion
//#region src/define.d.ts
declare function defineRpcFunction<NAME extends string, TYPE extends RpcFunctionType, ARGS extends any[], RETURN = void, const AS extends RpcArgsSchema | undefined = undefined, const RS extends RpcReturnSchema | undefined = undefined>(definition: RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN, AS, RS>): RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN, AS, RS>;
declare function createDefineWrapperWithContext<CONTEXT>(): <NAME extends string, TYPE extends RpcFunctionType, ARGS extends any[], RETURN = void, const AS extends RpcArgsSchema | undefined = undefined, const RS extends RpcReturnSchema | undefined = undefined>(definition: RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN, AS, RS, CONTEXT>) => RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN, AS, RS, CONTEXT>;
//#endregion
//#region src/dumps.d.ts
/**
 * Collects pre-computed dumps by executing functions with their defined input combinations.
 * Static functions without dump config automatically get `{ inputs: [[]] }`.
 *
 * @example
 * ```ts
 * const store = await dumpFunctions([greet], context, { concurrency: 10 })
 * ```
 */
declare function dumpFunctions<T extends readonly RpcFunctionDefinitionAny[]>(definitions: T, context?: any, options?: RpcDumpCollectionOptions): Promise<RpcDumpStore<RpcDefinitionsToFunctions<T>>>;
/**
 * Creates a client that serves pre-computed results from a dump store.
 * Uses argument hashing to match calls to stored records.
 *
 * @example
 * ```ts
 * const client = createClientFromDump(store)
 * await client.greet('Alice')
 * ```
 */
declare function createClientFromDump<T extends Record<string, any>>(store: RpcDumpStore<T>, options?: RpcDumpClientOptions): BirpcReturn<T>;
/**
 * Filters function definitions to only those with dump definitions.
 * Note: Only checks the definition itself, not setup results.
 */
declare function getDefinitionsWithDumps<T extends readonly RpcFunctionDefinitionAny[]>(definitions: T): RpcFunctionDefinitionAny[];
//#endregion
//#region src/handler.d.ts
declare function getRpcResolvedSetupResult<NAME extends string, TYPE extends RpcFunctionType, ARGS extends any[], RETURN = void, CONTEXT = undefined>(definition: RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN, any, any, CONTEXT>, context: CONTEXT): Promise<RpcFunctionSetupResult<ARGS, RETURN>>;
declare function getRpcHandler<NAME extends string, TYPE extends RpcFunctionType, ARGS extends any[], RETURN = void, CONTEXT = undefined>(definition: RpcFunctionDefinition<NAME, TYPE, ARGS, RETURN, any, any, CONTEXT>, context: CONTEXT): Promise<(...args: ARGS) => RETURN>;
//#endregion
//#region src/validation.d.ts
/**
 * Validates RPC function definitions.
 * Action and event functions cannot have dumps (side effects should not be cached).
 *
 * @throws {Error} If an action or event function has a dump configuration
 */
declare function validateDefinitions(definitions: readonly RpcFunctionDefinitionAny[]): void;
/**
 * Validates a single RPC function definition.
 *
 * @throws {Error} If an action or event function has a dump configuration
 */
declare function validateDefinition(definition: RpcFunctionDefinitionAny): void;
//#endregion
export { type BirpcFn, type BirpcReturn, EntriesToObject, RpcArgsSchema, RpcCacheManager, RpcCacheOptions, RpcDefinitionsFilter, RpcDefinitionsToFunctions, RpcDump, RpcDumpClientOptions, RpcDumpCollectionOptions, RpcDumpDefinition, RpcDumpGetter, RpcDumpRecord, RpcDumpStore, RpcFunctionDefinition, RpcFunctionDefinitionAny, RpcFunctionDefinitionAnyWithContext, RpcFunctionDefinitionBase, RpcFunctionDefinitionToFunction, RpcFunctionSetupResult, RpcFunctionType, RpcFunctionsCollector, RpcFunctionsCollectorBase, RpcReturnSchema, Thenable, createClientFromDump, createDefineWrapperWithContext, defineRpcFunction, dumpFunctions, getDefinitionsWithDumps, getRpcHandler, getRpcResolvedSetupResult, validateDefinition, validateDefinitions };