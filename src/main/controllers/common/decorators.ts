import { Struct, assert } from "superstruct";

const schemaMetadataKey = Symbol("schema");

interface DescriptorValue {
  (...args: unknown[]): unknown;
}

export function schema(struct: Struct) {
    return function schema(target: object, propertyKey: string | symbol, parameterIndex: number) {
        const schemas: [number, Struct][] = Reflect.getOwnMetadata(schemaMetadataKey, target, propertyKey) || [];
        schemas.push([parameterIndex, struct]);
        Reflect.defineMetadata(schemaMetadataKey, schemas, target, propertyKey);
    }
}

export function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<DescriptorValue>) {
    const method = descriptor.value;
   
    descriptor.value = function (...args: unknown[]) {
      const schemas: [number, Struct][] = Reflect.getOwnMetadata(schemaMetadataKey, target, propertyName);

      if (schemas) {
        for (const [argIndex, struct] of schemas) {
            assert(args[argIndex], struct);
        }
      }

      return method.apply(this, args);
    };
  }
