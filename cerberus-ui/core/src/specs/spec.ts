export interface ISpec<TContext> {
    isSatisfiedBy(context: TContext): boolean;
    and(spec: ISpec<TContext>): ISpec<TContext>;
    or(spec: ISpec<TContext>): ISpec<TContext>;
    not(): ISpec<TContext>;
}


export abstract class Spec<TContext> implements ISpec<TContext> {
    abstract isSatisfiedBy(context: TContext): boolean;
    and(spec: ISpec<TContext>): ISpec<TContext> {
       // return new AndSpec(this as unknown as ISpec<TContext>, spec);
        return new AndSpec([this as unknown as ISpec<TContext>, spec]);
    }
    or(spec: ISpec<TContext>): ISpec<TContext> {
        return new OrSpec([this as unknown as ISpec<TContext>, spec]);
    }
    not(): ISpec<TContext> {
        return new NotSpec(this as unknown as ISpec<TContext>);
    }
}
export class AndSpec<TContext> extends Spec<TContext> {
    constructor(
        private specs: ISpec<TContext>[],
    ) {
        super();
    }
    isSatisfiedBy(context: TContext): boolean {
        return this.specs.every(spec => spec.isSatisfiedBy(context));
    }
    and(spec: ISpec<TContext>): ISpec<TContext> {
        return new AndSpec([...this.specs, spec]);
    }
}

export class OrSpec<TContext> extends Spec<TContext> {
    constructor(
        private specs: ISpec<TContext>[],
    ) {
        super();
    }

    isSatisfiedBy(context: TContext): boolean {
        return this.specs.some(spec => spec.isSatisfiedBy(context));
    }
    or(spec: ISpec<TContext>): ISpec<TContext> {
        return new OrSpec([...this.specs, spec]);
    }
}

export class NotSpec<TContext> extends Spec<TContext> {
    constructor(private spec: ISpec<TContext>) {
        super();
    }

    isSatisfiedBy(context: TContext): boolean {
        return !this.spec.isSatisfiedBy(context);
    }
}
