const colorToHex = (u) => {
  let e = u.replace('#', '').match(/../g)
  for (let t = 0; t < 3; t++) e[t] = parseInt(e[t], 16)
  return e
}

const hexToColor = (u, e, t) => {
  let a = [u.toString(16), e.toString(16), t.toString(16)]
  for (let n = 0; n < 3; n++) a[n].length === 1 && (a[n] = `0${a[n]}`)
  return `#${a.join('')}`
}
const generateAllColors = (u, e) => {
  let t = colorToHex(u)
  const target = [10, 10, 30]
  for (let a = 0; a < 3; a++) t[a] = Math.floor(t[a] * (1 - e) + target[a] * e)
  return hexToColor(t[0], t[1], t[2])
}

const generateAllLightColors = (u, e) => {
  let t = colorToHex(u)
  const target = [240, 248, 255] // RGB for blue white color
  for (let a = 0; a < 3; a++) t[a] = Math.floor(t[a] * (1 - e) + target[a] * e)
  return hexToColor(t[0], t[1], t[2])
}

function addOpacityToColor(u, opacity) {
  let t = colorToHex(u)
  return `rgba(${t[0]}, ${t[1]}, ${t[2]}, ${opacity})`
}

export const setBodyPrimaryColor = (primaryColor, darkMode) => {
  let fmtColorFunc = generateAllColors
  if (darkMode === 'light') {
    fmtColorFunc = generateAllLightColors
  }

  document.documentElement.style.setProperty('--el-color-primary', primaryColor)
  document.documentElement.style.setProperty(
    '--el-color-primary-bg',
    addOpacityToColor(primaryColor, 0.4)
  )
  for (let times = 1; times <= 2; times++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-dark-${times}`,
      fmtColorFunc(primaryColor, times / 10)
    )
  }
  for (let times = 1; times <= 10; times++) {
    document.documentElement.style.setProperty(
      `--el-color-primary-light-${times}`,
      fmtColorFunc(primaryColor, times / 10)
    )
  }
  document.documentElement.style.setProperty(
    `--el-menu-hover-bg-color`,
    addOpacityToColor(primaryColor, 0.2)
  )
}

export const setCornerSize = (cornerSize) => {
  document.documentElement.style.setProperty(
    '--ape-volo-radius',
    cornerSize + 'rem'
  )
}
