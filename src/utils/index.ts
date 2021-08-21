export * from './allsettled';
export * from './constants';
export * from './filters';
export * from './knownTokens';
export * from './protocol';
export * from './regex';
export * from './table';
export * from './text';
export * from './tokens';

export function prop<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
