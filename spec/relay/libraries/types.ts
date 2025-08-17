export type Access = "public" | "session" | (() => boolean)[];

export type AccessFn = (resource: string, action: string) => () => boolean;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ServerContext {}
