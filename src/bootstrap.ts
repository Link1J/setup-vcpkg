import * as core from '@actions/core'
import * as exec from '@actions/exec'
import os from 'os'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function bootstrap(vcpkg_root: string): Promise<void> {
  core.startGroup('Bootstrap')
  let ext = '.sh'
  if (os.platform() == 'win32') {
    ext = '.bat'
  }
  exec.exec(vcpkg_root + '/bootstrap-vcpkg' + ext, ['-disableMetrics'])
  core.endGroup()
}
