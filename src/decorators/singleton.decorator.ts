/* eslint-disable @typescript-eslint/no-explicit-any */
export const SINGLETON_KEY: unique symbol = Symbol()

export type Singleton<T extends new (...args: Array<any>) => any> = T & {
  [SINGLETON_KEY]: T extends new (...args: Array<any>) => infer I ? I : never
}

/**
 * A decorator to implement the singleton pattern.
 * It stores a reference to the instance of a class and returns that reference each time.
 *
 * @param targetClass - the class to be converted to a singleton.
 * @returns an instance of the target class.
 *
 * @remarks
 * Be careful with classes that others might inherit from. In this case, the decorator will use the parent's instance.
 */
export const Singleton = <T extends new (...args: Array<any>) => any>(targetClass: T) =>
  new Proxy<T>(targetClass, {
    construct(target: Singleton<T>, argsList: Array<any>, newTarget: (...args: Array<any>) => any) {
      target[SINGLETON_KEY] || (target[SINGLETON_KEY] = Reflect.construct(target, argsList, newTarget))

      return target[SINGLETON_KEY]
    }
  })
