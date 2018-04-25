const colors = [
  'red',
  'blue',
  'magenta',
  'cyan'
]

const colorMap = {}

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

const color = (author) => {
  if (!colorMap[author]) {
    colorMap[author] = getRandomColor()
  }
  return colorMap[author]
}

module.exports = color
