import * as core from '@actions/core'
import * as exec from '@actions/exec'
import os from 'os'

function getRoot(): string {
    let out = core.getInput('vcpkg-root')
    if (out.length !== 0) return out
    out = process.env.VCPKG_INSTALLATION_ROOT || ''
    if (out.length !== 0) return out
    throw new Error('Could not find a valid VCPKG_ROOT')
}

async function bootstrap(vcpkg_root: string): Promise<void> {
    if (vcpkg_root === process.env.VCPKG_INSTALLATION_ROOT) {
        return
    }

    const ext = os.platform() === 'win32' ? '.bat' : '.sh'
    await exec.exec(`${vcpkg_root}/bootstrap-vcpkg${ext}`, ['-disableMetrics'])
}

function getBin(root: string): string {
    const ext = os.platform() === 'win32' ? '.exe' : ''
    return `${root}/vcpkg${ext}`
}

async function getVersion(bin: string): Promise<Date> {
    const output = await exec.getExecOutput(bin, ['--version'])
    const data = output.stdout.match(
        /(?<date>\d{2,4}-\d{2,4}-\d{2,4})-(?<hash>[0123456789ABCDEFabcdef]+)/
    )
    return new Date(
        data === null || data.groups === undefined ? 0 : data.groups['date']
    )
}

export default class Vcpkg {
    readonly root: string
    readonly bin: string
    readonly version: Date

    private constructor(root: string, bin: string, version: Date) {
        this.root = root
        this.bin = bin
        this.version = version
    }

    static async create(): Promise<Vcpkg> {
        core.startGroup('Setup')
        const root = getRoot()
        await bootstrap(root)
        const bin = getBin(root)
        const version = await getVersion(bin)
        core.endGroup()
        return new Vcpkg(root, bin, version)
    }
}
