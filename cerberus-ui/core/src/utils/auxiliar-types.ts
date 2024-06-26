/**
 * Maps all possible paths of a given object and returns in string format.
 * @param {T} T -The type that you want to map all its possible paths in string format.
 * @type {string}
 */
export type Paths<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${'' | `.${Paths<T[K]>}`}`;
    }[keyof T]
  : never;
