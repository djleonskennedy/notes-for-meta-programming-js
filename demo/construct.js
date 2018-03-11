class ExtendedList extends Array {
    [Symbol.iterator]() {
        let i = 0;
        const values = this.map(prop => `${prop} !!!`);
        return {
            next() {
                if(i < values.length) {
                    return { value: values[i++], done: false };
                }
                return { done: true }
            }
        }
    }
}

const result = Reflect.construct(ExtendedList, ['prop1', 'prop2', 'prop3']);

// run itterable behavior
console.log(...result); //prop1 !!! prop2 !!! prop3 !!!

// check instance class
console.log(result instanceof ExtendedList); // true

// check if it's instance  inherited class
console.log(Array.isArray(result)); // true