/* eslint-disable no-console */
import { colors, icons } from './colors.js';

export class Logger {
  static success(message: string): void {
    console.log(`${icons.success} ${colors.success(message)}`);
  }

  static error(message: string): void {
    console.log(`${icons.error} ${colors.error(message)}`);
  }

  static warning(message: string): void {
    console.log(`${icons.warning} ${colors.warning(message)}`);
  }

  static info(message: string): void {
    console.log(`${icons.info} ${colors.info(message)}`);
  }

  static log(message: string): void {
    console.log(message);
  }

  static break(): void {
    console.log('');
  }

  static title(message: string): void {
    console.log(`${colors.bold(colors.primary(message))}`);
  }

  static subtitle(message: string): void {
    console.log(`${colors.dim(message)}`);
  }

  static step(message: string): void {
    console.log(`${icons.gear} ${message}`);
  }

  static tip(message: string): void {
    console.log(`${icons.lightbulb} ${colors.dim(message)}`);
  }
}