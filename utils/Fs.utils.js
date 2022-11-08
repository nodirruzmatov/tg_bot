import fs from 'fs'
import path from 'path'

const read = dir => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'model', dir)))




const write = (dir, data) => {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(path.join(process.cwd(), 'model', dir))) {
      return reject('Path does not exists')
    }

    fs.writeFile(path.join(process.cwd(), 'model', dir), JSON.stringify(data, null, 2), err => {
      if (err) reject(err)

      resolve(data.at(-1))
    })

  })
}

export {
  read,
  write
}