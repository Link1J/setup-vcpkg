import * as core from '@actions/core'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function cache(vcpkg_version: Date): Promise<void> {
  core.startGroup('Cache')
  if (vcpkg_version < new Date('2023-03-29')) {
    core.warning(
      'The version of Vcpkg in use does not support Github Actions cache'
    )
  } else if (
    process.env.ACTIONS_CACHE_URL === undefined ||
    process.env.ACTIONS_RUNTIME_TOKEN === undefined
  ) {
    core.warning('The runner in use does not support Github Actions cache')
  } else {
    core.exportVariable('ACTIONS_CACHE_URL', process.env.ACTIONS_CACHE_URL)
    core.exportVariable(
      'ACTIONS_RUNTIME_TOKEN',
      process.env.ACTIONS_RUNTIME_TOKEN
    )
    core.exportVariable('VCPKG_BINARY_SOURCES', 'clear;x-gha,readwrite')
  }
  core.endGroup()
}
