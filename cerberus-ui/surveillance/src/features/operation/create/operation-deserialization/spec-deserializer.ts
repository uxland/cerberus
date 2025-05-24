import {AndSpec, ISpec, NotSpec, OrSpec} from "@cerberus/core";
import {ValueEqualsSpec, ValueGreaterThanSpec} from "../domain";

interface SerializedSpec<T = undefined> extends ISpec<T>{
    __type: string;
}

type SpecDeserializer = <T>(spec: SerializedSpec<T>) => ISpec<T>;
type ISpecDeserializerFunc<T, TSpec extends SerializedSpec<T>> = (
    spec: TSpec,
    deserializer: SpecDeserializer,
) => ISpec<T>;

interface SerializedCompoundSpec<T> extends SerializedSpec<T> {
    specs: SerializedSpec<T>[];
}
interface NotSerializedSpec<T> extends SerializedSpec<T> {
    spec: SerializedSpec<T>;
}
interface ValueSerializedSpec<T> extends SerializedSpec<T> {
    value: T;
}
const andDeserializer: ISpecDeserializerFunc<unknown, SerializedCompoundSpec<unknown>> = (spec, deserializer) =>
    new AndSpec(spec.specs.map(deserializer));

const orDeserializer: ISpecDeserializerFunc<unknown, SerializedCompoundSpec<unknown>> = (spec, deserializer) =>
    new OrSpec(spec.specs.map(deserializer));

const notDeserializer: ISpecDeserializerFunc<unknown, NotSerializedSpec<unknown>> = (
    spec,
    deserializer,
) => new NotSpec(deserializer(spec.spec));

const equalsDeserializer: ISpecDeserializerFunc<unknown, ValueSerializedSpec<string | number>> = (spec) =>
    new ValueEqualsSpec(spec.value); // Assuming 'value' is the property to compare
const greaterThanDeserializer: ISpecDeserializerFunc<unknown, ValueSerializedSpec<string | number>> = (spec) =>
    new ValueGreaterThanSpec(spec.value);
const lowerThanDeserializer: ISpecDeserializerFunc<unknown, ValueSerializedSpec<string | number>> = (spec) =>
    new ValueGreaterThanSpec(spec.value); // Assuming 'value' is the property to compare

const knownSpecDeserializers: Record<string, ISpecDeserializerFunc<unknown, SerializedSpec<unknown>>> = {
    And: andDeserializer,
    Or: orDeserializer,
    Not: notDeserializer,
    Equals: equalsDeserializer,
    GreaterThan: greaterThanDeserializer,
    LowerThan: lowerThanDeserializer,
};

const specDeserializer: SpecDeserializer = (spec) => {
    const deserializer = knownSpecDeserializers[spec.__type];
    if (!deserializer) throw new Error(`Unknown spec type: ${spec.__type}`);
    return deserializer(spec, specDeserializer);
};
export { specDeserializer };