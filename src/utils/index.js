export * from './localStorage'
export * from './Base64Downloader'

export const getBase64 = (file) => {
  if (!(file instanceof Blob)) return

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject('Error: ', error)
  })
}

export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const parseJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => resolve(JSON.parse(event.target.result))
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsText(file)
  })
}
