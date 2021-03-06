import commandLineArgs from 'command-line-args';
import commandLineUsage, { OptionDefinition } from 'command-line-usage';
import camelCase from 'camelcase';

const defaultOptions: (OptionDefinition & { description: string })[] = [
  {
    name: 'config',
    alias: 'c',
    type: String,
    description: 'The file to read configuration from. Config entries are camelCases flags.',
  },
  {
    name: 'root-dir',
    alias: 'r',
    type: String,
    description:
      'The root directory to serve files from. Defaults to the current working directory.',
  },
  {
    name: 'open',
    alias: 'o',
    type: String,
    description: 'Opens the browser on app-index, root dir or a custom path.',
  },
  {
    name: 'app-index',
    alias: 'a',
    type: String,
    description:
      "The app's index.html file. When set, serves the index.html for non-file requests. Use this to enable SPA routing.",
  },
  {
    name: 'help',
    type: Boolean,
    description: 'Print help commands',
  },
];

export function readCliArgsConfig<T>(
  extraOptions: OptionDefinition[] = [],
  argv = process.argv,
): Partial<T> {
  const options = [...defaultOptions, ...extraOptions];
  const cliArgs = commandLineArgs(options, { argv });
  // when the open flag is used without arguments, it defaults to null. treat this as "true"
  if ('open' in cliArgs && typeof cliArgs.open !== 'string') {
    cliArgs.open = true;
  }

  if ('help' in cliArgs) {
    /* eslint-disable-next-line no-console */
    console.log(
      commandLineUsage([
        {
          header: 'Web Dev Server',
          content: 'Dev Server for web development.',
        },
        {
          header: 'Usage',
          content: 'web-dev-server [options...]' + '\nwds [options...]',
        },
        { header: 'Options', optionList: options },
      ]),
    );
    process.exit();
  }

  const cliArgsConfig: Partial<T> = {};

  for (const [key, value] of Object.entries(cliArgs)) {
    cliArgsConfig[camelCase(key) as keyof T] = value;
  }

  return cliArgsConfig;
}
