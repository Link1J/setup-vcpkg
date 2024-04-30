import * as core from '@actions/core'
import { bootstrap } from './bootstrap'
import { install } from './install'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const vcpkg_root = (() => {
      let out = core.getInput('vcpkg-root')
      if (out.length !== 0) return out
      out = process.env.VCPKG_INSTALLATION_ROOT || ''
      if (out.length !== 0) return out
      throw new Error('Could not find a valid VCPKG_ROOT')
    })()
    let install_options = ['--no-print-usage']

    // if (vcpkg_root !== process.env.VCPKG_INSTALLATION_ROOT) {
    bootstrap(vcpkg_root)
    // }
    if (core.getBooleanInput('use-cache')) {
      core.exportVariable(
        'ACTIONS_CACHE_URL',
        process.env.ACTIONS_CACHE_URL || ''
      )
      core.exportVariable(
        'ACTIONS_RUNTIME_TOKEN',
        process.env.ACTIONS_RUNTIME_TOKEN || ''
      )
      install_options = [
        ...install_options,
        '--binarysource="clear;x-gha,readwrite;default,readwrite"'
      ]
    }
    if (core.getBooleanInput('install-dependencies')) {
      install(vcpkg_root, install_options)
    }

    core.exportVariable('VCPKG_ROOT', vcpkg_root)
    core.exportVariable('VCPKG_INSTALL_OPTIONS', install_options)

    core.setOutput(
      'toolchain-file',
      `${vcpkg_root}/scripts/buildsystems/vcpkg.cmake`
    )
    core.setOutput('vcpkg-install-options', install_options)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
