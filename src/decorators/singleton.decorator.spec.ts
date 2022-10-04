import { Singleton } from './singleton.decorator'


describe('Singleton decorator', () => {
  it('should only create one instance of a class', () => {
    class MySuperClass {
      private readonly randomFloat: number = Math.random()
    }

    @Singleton
    class MySingleton extends MySuperClass {
      private readonly randomInt: number = Math.floor(Math.random() * 10)
    }

    const superClass: MySuperClass = new MySuperClass()
    const firstSingleton: MySingleton = new MySingleton()
    const socondSingleton: MySingleton = new MySingleton()

    expect(firstSingleton).toMatchObject(firstSingleton)
    expect(superClass).not.toMatchObject(firstSingleton)
    expect(superClass).not.toMatchObject(socondSingleton)
  })
})
