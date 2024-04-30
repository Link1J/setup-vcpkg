import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function install(
  vcpkg_bin: string,
  args: string[]
): Promise<void> {
  core.startGroup('Install Dependencies')
  let extraArgs: string[] = []

  const installLocation = core.getInput('install-location')
  if (installLocation.length !== 0) {
    extraArgs = [...extraArgs, `--x-install-root="${installLocation}"`]
  }
  await exec.exec(vcpkg_bin, ['install', ...args, ...extraArgs])
  core.endGroup()
}
