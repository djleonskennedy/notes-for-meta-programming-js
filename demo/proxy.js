// Proxy

// A constructor that returns a Proxy object
// Trap and define custom behavior for fundamental object operations

/* new Proxy(target, handler) */
// - target: The object to Proxy
// - handler: An object containing the behaviors to redefine (the traps)

// Revocable Proxies constructed with Proxy.revocable

// const { proxy, revoke } = new Proxy.revocable(target, handler);

const obj = { foo: 'foo', secret: 'SECRET' };

const proxy = new Proxy(obj, {
    get(target, property) {
        if (property === 'secret')
            return console.log('Unauthorized, You cannot access to this property!');
        return target[property];
    }
});

console.log(obj.secret); // SECRET
console.log(proxy.secret);
// 'Unauthorized, You cannot access to this property!
// undefined
console.log(proxy.foo); // FOO


// this handle in Proxy actualy just Reflect methods

const obj2 = { foo: 'foo', secret: 'SECRET' };

const proxy2 = new Proxy(obj, {
    set(target, property, value, reciever) {
        console.log(`setting ${property} to ${value}`);
        return Reflect.set(target, property, value, reciever)
    },
    get(target, property) {
        // default behavior
        return Reflect.get(target, property)
    }
});

proxy2.secret = 'NEW SECRET'; // setting secret to NEW SECRET
console.log(obj2.foo); // foo

// Capturing method calls
const handler = {

    /**
     * @param target "The target function to call."
     * @param thisArgument "The value of this provided for the call to target."
     * @param argumentsList "An array-like object specifying the arguments with which target should be called."
     */
    apply(target, thisArgument, argumentsList) {
        const newArgs = [
            'Prepended',
            ...argumentsList,
            'Appended'
        ];
        return Reflect.apply(target, thisArgument, newArgs)
    }
};

const apllierDemo = new Proxy((...args) => console.log(...args), handler);

console.log('Capturing method calls demo');
apllierDemo(`Current`);

// Reflect.construct

const dirtyHandler = {
  construct(target, args) {
      const dirty = new Set();
      const dirtyProp = Symbol.for('dirty');
      return new Proxy(Reflect.construct(target, args), {
          set(target, propertyName, value, reciever) {
              target[propertyName] = value;
              dirty.add(propertyName);
              // Reflect or value or true must be returned
              // otherwise error will be thrown
              return true;
          },
          get(target, propertyName, reciever) {
              if (propertyName === dirtyProp) return dirty;
              return Reflect.get(target, propertyName, reciever)
          }
      })
  }
};

class Model {
    constructor(...props) {
        props.forEach(prop => this[prop] = true)
    }
    get dirty() {
        return this[Symbol.for('dirty')];
    }
}

const ProxyModel = new Proxy(Model, dirtyHandler);

const model = new ProxyModel('Yuriy', 'Yakovenko');
model.foo = 'bar';
model.Yuriy = false;
model.Yakovenko = 2;

console.log('dirtyHandler');
console.log(...model.dirty); // foo Yuriy Yakovenko
