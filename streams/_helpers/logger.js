import chalk from 'chalk';

export class Logger {
  #prefix;
  #chalkedFn;
  #chalkStringsOnly = false

  constructor(
    {
      prefix = '',
      prefixSettings = {}, // { value, color, bgColor }
      color = '',
      bgColor = '',
      chalkStringsOnly = false
    } = {}
  ) {
    this.#chalkedFn = this.#createChalkedFn(color, bgColor);

    this.setPrefix(
      Reflect.has(prefixSettings, 'value') ? prefixSettings.value : prefix,
      Reflect.has(prefixSettings, 'color') ? prefixSettings.color : color,
      Reflect.has(prefixSettings, 'bgColor') ? prefixSettings.bgColor : bgColor
    );

    this.#chalkStringsOnly = chalkStringsOnly;
  }

  setPrefix(prefix, color = '', bgColor = '') {
    if (!prefix) {
      this.#prefix = '';
      return;
    }

    const chalkedFn = this.#createChalkedFn(color, bgColor);
    this.#prefix = chalkedFn(`[${prefix}]`);
  }

  log(...args) {
    const formattedArgs = this.#prefixArgsWithChalk(args);

    console.log(...formattedArgs);
  }

  warn(...args) {
    const formattedArgs = this.#prefixArgsWithChalk(args);
    console.warn(...formattedArgs);
  }

  error(...args) {
    const formattedArgs = this.#prefixArgsWithChalk(args);

    console.error(...formattedArgs);
  }

  #getFormattedBGColorName = (colorName) => {
    if (!colorName) {
      return '';
    }
    return `bg${colorName[0].toUpperCase()}${colorName.slice(1)}`;
  }

  #createChalkedFn(color, bgColor) {
    const formattedBGColorName = this.#getFormattedBGColorName(bgColor);

    const coloredFn = (color) ? chalk[color] : chalk;
    const coloredBgFn = (formattedBGColorName)
      ? coloredFn[formattedBGColorName] : coloredFn;

    return (value) => coloredBgFn(value);
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
