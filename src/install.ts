import * as core from '@actions/core'
import * as exec from '@actions/exec'
import os from 'os'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function install(
  vcpkg_root: string,
  args: string[]
): Promise<void> {
  core.startGroup('Install Dependencies')
  let extraArgs: string[] = []

  const installLocation = core.getInput('install-location')
  if (installLocation.length !== 0) {
    extraArgs = [...extraArgs, `--x-install-root="${installLocation}"`]
  }
  let ext = ''
  if (os.platform() === 'win32') {
    ext = '.exe'
  }
  exec.exec(`${vcpkg_root}/vcpkg${ext}`, ['install', ...args, ...extraArgs])
  core.endGroup()
}
