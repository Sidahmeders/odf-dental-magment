import { saveAs } from 'file-saver'
import { base64ToBlob } from 'base64-blob'

/* various allowed content types */
const contentTypes = {
  png: 'image/png',
  jpeg: 'image/jpeg',
  jpg: 'image/jpg',
}

/* various allowed base64 prepends, these are prepended to the start of a base64 image string */
const base64Prepends = {
  png: `data:${contentTypes.png};base64`,
  jpeg: `data:${contentTypes.jpeg};base64`,
  jpg: `data:${contentTypes.jpg};base64`,
}

/**
 * Checks for a valid file extension prepend in a base64 image string
 *
 * @param {string} base64 - base64 image string including prepend. e.g. data:image/png;base64,iVBORw0KGgo...
 */
function getExtFromBase64(base64) {
  let extension
  if (typeof base64 === 'string') {
    extension = Object.keys(base64Prepends).find((key) => base64.indexOf(base64Prepends[key]) === 0)
  }

  // if extension was found, return it, otherwise throw.
  if (extension) {
    return extension
  } else {
    throw new Error(
      `props.base64 on <Base64Downloader/> has invalid or undefined extension. expected ${Object.keys(
        contentTypes,
      ).join(', ')}`,
    )
  }
}

/**
 * Triggers a browser file download from a base64 string
 *
 * @param {string} base64 - base64 image string including prepend. e.g. data:image/png;base64,iVBORw0KGgo...
 * @param {string} name - name of the file which will be downloaded
 * @param {string} ext - file extension
 */
export async function triggerBase64Download(base64, name = 'download', ext) {
  const extension = ext || getExtFromBase64(base64)

  // if the getExtFromBase64 method doesn't throw, we have a valid extension!
  const prepend = base64Prepends[extension]

  // generate a blob, then a file and then save the file.
  const blob = await base64ToBlob(base64)
  const file = new File([blob], `${name}.${extension}`, { type: prepend })
  saveAs(file)
}
