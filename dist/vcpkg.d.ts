export default class Vcpkg {
    readonly root: string;
    readonly bin: string;
    readonly version: Date;
    private constructor();
    static create(): Promise<Vcpkg>;
}
