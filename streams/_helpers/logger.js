import chalk from 'chalk';

export class Logger {
  #prefix;
  #chalkedFn;
  #chalkStringsOnly = false

  constructor(
    {
      prefix = '',
      prefixSettings = {}, // { value, color }
      color = '',
      chalkStringsOnly = false
    } = {}
  ) {
    this.#chalkedFn = this.#createChalkedFn(color);

    this.setPrefix(
      Reflect.has(prefixSettings, 'value') ? prefixSettings.value : prefix,
      Reflect.has(prefixSettings, 'color') ? prefixSettings.color : color
    );

    this.#chalkStringsOnly = chalkStringsOnly;
  }

  setPrefix(prefix, color = '') {
    if (!prefix) {
      this.#prefix = '';
      return;
    }

    const chalkedFn = this.#createChalkedFn(color);
    this.#prefix = chalkedFn(`[${prefix}]`);
  }

  log(...args) {
    const formattedArgs = this.#prefixArgsWithChalk(args);

    console.log(...formattedArgs);
  }

  warn(...args) {
    const formattedArgs = this.#prefixArgsWithChalk(args);
    console.warn('🟠', ...formattedArgs);
  }

  error(...args) {
    const formattedArgs = this.#prefixArgsWithChalk(args);

    console.error('🔴', ...formattedArgs);
  }

  #createChalkedFn(color) {
    if (!color || typeof chalk[color] !== 'function') {
      return (value) => value;
    }

    return (value) => chalk[color](value);
  }

  #prefixArgsWithChalk(
    args
  ) {
    const chalkedArgs = args.map((arg) => {
      if (!this.#chalkStringsOnly || typeof arg === 'string') {
        return this.#chalkedFn(arg);
      }
      return arg;
    });

    if (!this.#prefix) {
      return chalkedArgs;
    }

    return [this.#prefix, ...chalkedArgs];
  }
}
