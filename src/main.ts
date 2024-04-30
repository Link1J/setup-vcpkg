import * as core from '@actions/core'

import { bootstrap } from './bootstrap'
import { install } from './install'
import { cache } from './cache'
import Vcpkg from './vcpkg'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const vcpkg = await Vcpkg.create()
    const install_options = ['--no-print-usage', '--clean-after-build']

    core.exportVariable('VCPKG_ROOT', vcpkg.root)

    if (vcpkg.root !== process.env.VCPKG_INSTALLATION_ROOT) {
      await bootstrap(vcpkg.root)
    }
    if (core.getBooleanInput('use-cache')) {
      await cache(vcpkg.version)
    }
    if (core.getBooleanInput('install-dependencies')) {
      await install(vcpkg.bin, install_options)
    }

    core.exportVariable('VCPKG_INSTALL_OPTIONS', install_options)

    core.setOutput(
      'toolchain-file',
      `${vcpkg.root}/scripts/buildsystems/vcpkg.cmake`
    )
    core.setOutput('vcpkg-install-options', install_options)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
