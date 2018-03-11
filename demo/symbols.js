const a = Symbol();
console.log(a); // => Symbol()

const b = Symbol('some description');
console.log(a); // => Symbol('some description')

console.log(a === Symbol()); // false
console.log(b === Symbol('some description')); // false

const c = Symbol.for('foo');
console.log(c === Symbol.for('foo')); // true
console.log(Symbol.keyFor(c)); // foo

/*
answered by this link https://stackoverflow.com/questions/31897015/what-is-global-symbol-registry
What is global symbol registry?

It's a registry (think: dictionary) for symbols that you can access via a string key.
And "global" does in this case mean even more global than a global scope,
the global symbol registry does span all realms of your engine.
In a browser, the web page, an iframe, and web worker
would all have their own realm with own global objects,
but they could share symbols via this global registry.
*/

// also symbols have predefined ones in Symbol object here's example of it

// Symbol.hasInstance
// Modify behavior of "instanceof" keyword

class MyClass {
    static [Symbol.hasInstance](instance) {
        return instance === 'special';
    }
}

console.log('special is instance for MyClass: ', 'special' instanceof MyClass); // true
console.log('not special is instance for MyClass: ', 'no special' instanceof MyClass); // false

// Symbol.match
// Use in place of a regular expr for String#match

class Matcher {
    constructor(value) {
        this.value = value;
    }
    [Symbol.match](string) {
        return string.indexOf(this.value) === -1 ? null : [this.value]
    }
}

console.log('Symbol.match');
console.log('asdasfasfooasdfsd'.match(/foo/)); // [foo]
console.log('asdasfasfooasdfsd'.match(new Matcher('foo'))); // [foo]
console.log('adsfhgfdh'.match(new Matcher('foo'))); // null

// Symbol.toPrimitive
// Overload the == operator

class FooStringOrOne {
    [Symbol.toPrimitive](hint) {
        return hint === 'string' ? 'FOO' : 1;
    }
}

const inst = new FooStringOrOne();

console.log('Symbol.toPrimitive');

// Comparisons may cause unexpected type coercion
// BUT we've implemented this via Symbol.toPrimitive
console.log(`${inst}`); // FOO;
console.log(1 == inst); // true
console.log(+inst); // 1

// Symbol.iterator
// make you object or class iterable
// Make your class work with for..of
// Make your class work with ... (spread operator)

class IterableDemo {
    constructor(length) {
        this.length = length;
    }
    [Symbol.iterator]() {
        let i = 1;
        const length = this.length;
        return {
            next() {
                if (++i < length)
                    return { value: 'Keep Next', done: false };
                if (i === length)
                    return { value: 'Last', done: false };
                return { done: true };

            }
        }
    }
}

console.log('Symbol.iterable');
const id = new IterableDemo(5);
console.log(Array.from(id)); // [ 'Keep Next', 'Keep Next', 'Keep Next', 'Last' ]
console.log(...id); // Keep Next Keep Next Keep Next Last
