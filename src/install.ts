import * as core from '@actions/core'
import * as exec from '@actions/exec'
import os from 'os'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function install(vcpkg_root: string): Promise<void> {
  core.startGroup('Install Dependencies')

  let installLocation = core.getInput('install-location')
  if (installLocation.length !== 0) {
    installLocation = `--x-install-root="${installLocation}"`
  }
  let ext = ''
  if (os.platform() === 'win32') {
    ext = '.exe'
  }
  let cache = ''
  if (core.getBooleanInput('use-cache')) {
    cache = '--binarysource="clear;x-gha,readwrite;default,readwrite"'
  }

  exec.exec(`${vcpkg_root}/vcpkg${ext}`, [
    '--no-print-usage',
    installLocation,
    cache
  ])
  core.endGroup()
}
