//#region src/node/cli-commands.d.ts
interface StartOptions {
  root?: string;
  config?: string;
  host: string;
  port?: string | number;
  open?: boolean;
}
declare function start(options: StartOptions): Promise<void>;
interface BuildOptions {
  root: string;
  config?: string;
  outDir: string;
  base: string;
}
declare function build(options: BuildOptions): Promise<void>;
//#endregion
export { BuildOptions, StartOptions, build, start };