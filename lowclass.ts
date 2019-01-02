type FunctionToConstructor<T, TReturn> =
	T extends (...a: infer A) => void ? new (...a: A) => TReturn : never;

type ReplaceCtorReturn<T, TReturn> =
	T extends new (...a: infer A) => void ? new (...a: A) => TReturn : never;

type ConstructorOrDefault<T> = T extends { constructor: infer TCtor } ? TCtor : (() => void);
type CreateInstanceType<T> = Pick<T, Exclude<keyof T, 'constructor' | ImplementationKeys>>;
type Id<T> = {} & { [P in keyof T]: T[P] }
type Constructor<T =  any, A extends any[]= any[]> = new (...a: A) => T
type MakeSuper<T extends Constructor<any>> = T extends Constructor<infer I, infer A> ? { constructor: (...a: A) => I } & Id<Pick<T, keyof T>> : never;

type ImplementationKeys = 'static' | 'private' | 'protected';
type MakePrivate= <T> (self: T) =>  T extends { __: { private: infer TPrivate } } ? TPrivate : never;
type MakePublic = <T>(self: T) => Pick<T, Exclude<keyof T, 'constructor' | ImplementationKeys>>;
type MakeProtected =<T> (self: T) => T extends { __: { protected : infer TProtected }  }? TProtected : never;
type GetStatics<T> = T extends { static: infer TStatic } ? TStatic : {};
type _PrivateImplementation<T> = Pick<T, Extract<keyof T, ImplementationKeys>>
type LowClassThis<T> = Id< Pick<T, Exclude<keyof T, ImplementationKeys>> & { __: _PrivateImplementation<T>}>

function Class(name: string): {
	extends<TBase extends Constructor, T>(base: TBase, members: (b: { Super: (t: any) => MakeSuper<TBase>, Public: MakePublic, Protected: MakeProtected, Private: MakePrivate }) => T & ThisType<LowClassThis<T & InstanceType<TBase>>>):
		T extends { constructor: infer TCtor } ?
		FunctionToConstructor<ConstructorOrDefault<T>, Id<InstanceType<TBase> & CreateInstanceType<T>>>
		:
		ReplaceCtorReturn<TBase, InstanceType<TBase> & Pick<T, Exclude<keyof T, 'constructor'>>>
}
function Class<T>(name: string, membersFn: (b: { Public: MakePublic, Protected: MakeProtected, Private: MakePrivate, Super: never }) => T & ThisType<LowClassThis<T>>): FunctionToConstructor<ConstructorOrDefault<T>, Id<CreateInstanceType<T>>> & Id<GetStatics<T>>
function Class<T>(name: string, members: T & ThisType<LowClassThis<T>>): FunctionToConstructor<ConstructorOrDefault<T>, Id<CreateInstanceType<T>>>  
function Class(): any {
	return null as any;
}

const Animal = Class('Animal', {
	sound: '',
	constructor(sound: string) {
		this.sound = sound;
	},
	makeSound() { console.log(this.sound) }
})

new Animal('').makeSound();

const Dog = Class('Dog').extends(Animal, ({ Super }) => ({
	constructor(size: 'small' | 'big') {
		if (size === 'small')
			Super(this).constructor('woof')
		if (size === 'big')
			Super(this).constructor('WOOF')
	},

	makeSound(d: number) { console.log(this.sound) },
	bark() { this.makeSound() },
	other() {
		this.bark();
	}
}))
type Dog = InstanceType<typeof Dog>

const smallDog: Dog = new Dog('small')
smallDog.bark() // "woof"

const bigDog = new Dog('big')
bigDog.bark() // "WOOF"

bigDog.bark();
bigDog.makeSound();


const Foo = Class('Foo', ({ Public, Protected, Private, Super }) => ({

	constructor(sound: string) {
	},
	static: {
		staticProp: 123,
		staticMethod() {
			console.log(Foo.staticProp) // 123
		},
	},

	publicProp: 'blah',
	publicMethod(a: string) { },

	protected: {
		protectedProp: 456,
		protectedMethod(a: string) { /* ... */ },
	},

	private: {
		privateProp: 789,
		privateMethod() {
			this.publicProp;
			this.publicMethod("") // Should this be allowed? Or do we just the below line to work ?
			Public(this).publicMethod("")
		},
	},

	test() {
		this.publicMethod("")
		
		console.log(this.publicProp) // 'blah'

		let p = Protected(this)
		Protected(this).protectedMethod("")
		console.log(Protected(this).protectedProp) // 456

		Private(this).privateMethod()
		console.log(Private(this).privateProp) // 789
		return Private(this).privateProp;

		
	},

}));


let foo = new Foo("")
Foo.staticMethod();
Foo.staticProp;

const Bar = Class('Foo').extends(Foo, ({ Public, Protected, Private, Super }) => ({
	method(){
		Protected(this);
		this.test();
	}
}));
