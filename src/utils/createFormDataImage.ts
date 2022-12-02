import Resizer from 'react-image-file-resizer'
export default async function createFormDataImage(photo: Array<any>) {
  const data = new FormData()
  if (!photo || !photo.length) return data
  return await Promise.all(
    photo.map(async (image, index) => {
      const width = await checkImageWidth(image.originFileObj)
      if (width <= 1000) {
        data.append('files', image.originFileObj)
      } else {
        const resizedImage = await resizeImage(image.originFileObj)
        data.append('files', resizedImage)
      }
    })
  ).then(res => {
    return data
  })
}

const checkImageWidth = async function (file: any): Promise<number> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event: any) => {
      const image = new Image()
      image.src = event.target.result
      image.onload = () => {
        resolve(image.width)
        return image.width
      }
      reader.onerror = err => reject(err)
    }
  })
}

const resizeImage = function (file: any): any {
  let quality = 100
  //2MB image file
  if (file.size > 2000000) {
    quality = 90
  }
  //4MB image file
  if (file.size > 4000000) {
    quality = 85
  }
  //6MB image file
  if (file.size > 6000000) {
    quality = 80
  }
  //8MB image file
  if (file.size > 8000000) {
    quality = 75
  }
  return new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      1000,
      1000,
      'JPEG',
      quality,
      0,
      uri => {
        resolve(uri)
      },
      'blob'
    )
  })
}
