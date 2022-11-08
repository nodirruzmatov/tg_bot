import { read } from '../utils/Fs.utils.js'
import keyboardsText from './keyboards-text.js'

const allCourses = read("courses.json")
let courses = []

for (let i = 0; i < allCourses.length; i += 2) {
  let arr = []
  arr.push(allCourses[i].name, allCourses[i + 1] ? allCourses[i + 1].name : null)
  courses.push(arr.filter(e => e))
}

courses.push([keyboardsText.back])

export default {

  menu: [

    [keyboardsText.ourCourses, keyboardsText.about],
    [keyboardsText.address]
  ],
  courses
}