export interface IRoute {
    (url: string, replace?: boolean): void;
}