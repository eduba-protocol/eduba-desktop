export function stringToEnum<T>(type: T, str: string): T[keyof T] | undefined {
    const typeObj = type as object;

    const index = Object.values(typeObj).indexOf(str);

    if (index < 0) {
        return;
    }

    const key = Object.keys(typeObj)[index];

    return type[key as keyof T];
}