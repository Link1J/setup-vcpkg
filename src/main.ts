import * as core from '@actions/core'

import { install } from './install.js'
import { cache } from './cache.js'
import Vcpkg from './vcpkg.js'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
    try {
        const vcpkg = await Vcpkg.create()
        const install_options = ['--no-print-usage']

        core.exportVariable('VCPKG_ROOT', vcpkg.root)
        core.setOutput(
            'toolchain-file',
            `${vcpkg.root}/scripts/buildsystems/vcpkg.cmake`
        )

        if (core.getBooleanInput('use-cache')) {
            await cache(vcpkg.version)
        }
        if (core.getBooleanInput('install-dependencies')) {
            await install(vcpkg.bin, install_options)
        }

        core.exportVariable('VCPKG_INSTALL_OPTIONS', install_options)
        core.setOutput('vcpkg-install-options', install_options)
    } catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error) core.setFailed(error.message)
    }
}
