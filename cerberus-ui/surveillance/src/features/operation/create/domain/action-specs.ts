import { Spec } from "@cerberus/core/src/specs/spec.ts";

export class ValueEqualsSpec<T extends number | string = undefined> extends Spec<T> {
    constructor(public value: T) {
        super();
    }
    isSatisfiedBy(context: T): boolean {
        return context === this.value;
    }
    __type = "Equals";
}

export class ValueGreaterThanSpec<T extends number | string = undefined> extends Spec<T> {
    constructor(public value: T) {
        super();
    }
    isSatisfiedBy(context: T): boolean {
        return context > this.value;
    }
    __type = "GreaterThan";
}
export class ValueLowerThanSpec<T extends number | string = undefined> extends Spec<T> {
    constructor(public value: T) {
        super();
    }
    isSatisfiedBy(context: T): boolean {
        return context < this.value;
    }
    __type = "LowerThan";
}

export class ValueGreaterThanOrEqualSpec<T extends number | string = undefined> extends Spec<T> {
    constructor(public value: T) {
        super();
    }
    isSatisfiedBy(context: T): boolean {
        return context >= this.value;
    }
    __type = "GreaterThanOrEqual";
}

export class ValueLowerThanOrEqualSpec<T extends number | string = undefined> extends Spec<T> {
    constructor(public value: T) {
        super();
    }
    isSatisfiedBy(context: T): boolean {
        return context <= this.value;
    }
    __type = "LowerThanOrEqual";
}