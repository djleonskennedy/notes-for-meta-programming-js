// Decorator
// decorator itself is a HOF (high order function);

// fluent example

function fluent(target, name, descriptor) {
    const fn = descriptor.value;

    descriptor.value = function (...args) {
        fn.apply(target, args);
        return target;
    }
}

class Person {

    @fluent
    setName(first, last) {
        this.first = first;
        this.last = last;
    }

    @fluent
    sayName() {
        console.log(`${this.first} ${this.last}`)
    }
}

const p = new Person();
p.setName('Yuriy', 'Yakovenko').sayName();