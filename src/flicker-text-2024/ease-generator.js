/**
 * This file is purely for generating linear() ease from GSAP
 *
 *
 * */

import gsap from 'https://cdn.skypack.dev/gsap'
import { RoughEase } from 'https://cdn.skypack.dev/gsap/EasePack'

// Imported via Settings
gsap.registerPlugin(window.CustomEase)
gsap.registerPlugin(RoughEase)

// Config settings for generator
const pointsLength = 10_000
const lineLength = 40

/**
 * ALL THE MAGIC STUFF IN HERE FROM LINEAR IS
 * FROM JAKE ARCHIBALD – @JAFFATHECAKE
 * THE CODE IS MODIFIED SLIGHTLY TO WORK HERE AND FOR THE NEEDS I HAD
 * https://github.com/jakearchibald/linear-easing-generator/tree/main
 * **/
// const durationFormat = new Intl.NumberFormat('en-US', {
//   maximumFractionDigits: 3,
// })

function useFriendlyLinearCode(parts, name) {
  if (parts.length === 0) return ''

  // const linearStart = `  --${name}: linear(`
  const linearStart = 'linear('
  const linearEnd = ')'
  const lines = []
  let line = ''

  const lineIndentSize = 2

  for (const part of parts) {
    // 1 for comma
    if (line.length + part.length + lineIndentSize + 1 > lineLength) {
      lines.push(`${line},`)
      line = ''
    }
    if (line) line += ', '
    line += part
  }

  if (line) lines.push(line)

  if (
    lines.length === 1 &&
    linearStart.length + lines[0].length + linearEnd.length < lineLength
  ) {
    return linearStart + lines[0] + linearEnd
  }

  return `${linearStart}\n    ${lines.join('\n    ')}\n    ${linearEnd}`
}
/**
 * The main part of the linear generation
 * */
function useLinearSyntax(points, round, offset = 1) {
  if (!points) return []
  const xFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.max(round - 2, 0),
  })
  const yFormat = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: round,
  })

  const pointsValue = points
  const valuesWithRedundantX = new Set()
  const maxDelta = 1 / 10 ** round

  // Figure out entries that don't need an explicit position value
  for (const [i, value] of pointsValue.entries()) {
    const [x] = value
    // If the first item's position is 0, then we don't need to state the position
    if (i === 0) {
      if (x === 0) valuesWithRedundantX.add(value)
      continue
    }
    // If the last entry's position is 1, and the item before it is less than 1, then we don't need to state the position
    if (i === pointsValue.length - 1) {
      const previous = pointsValue[i - 1][0]
      if (x === 1 && previous <= 1) valuesWithRedundantX.add(value)
      continue
    }

    // If the position is the average of the previous and next positions, then we don't need to state the position
    const previous = pointsValue[i - 1][0]
    const next = pointsValue[i + 1][0]

    const averagePos = (next - previous) / 2 + previous
    const delta = Math.abs(x - averagePos)

    if (delta < maxDelta) valuesWithRedundantX.add(value)
  }

  // Group into sections with same y
  const groupedValues = [[pointsValue[0]]]

  for (const value of pointsValue.slice(1)) {
    if (value[1] === groupedValues.at(-1)[0][1]) {
      groupedValues.at(-1).push(value)
    } else {
      groupedValues.push([value])
    }
  }

  const outputValues = groupedValues.map((group) => {
    const yValue = yFormat.format(group[0][1])

    const regularValue = group
      .map((value) => {
        const [x] = value
        let output = yValue

        output += ` ${xFormat.format(x * 100) * offset}%`

        return output
      })
      .join(', ')

    if (group.length === 1) return regularValue

    // Maybe it's shorter to provide a value that skips steps?
    const xVals = [group[0][0], group.at(-1)[0]]
    const positionalValues = xVals
      .map((x) => `${xFormat.format(x * 100)}%`)
      .join(' ')

    const skipValue = `${yValue} ${positionalValues}`

    return skipValue.length > regularValue.length ? regularValue : skipValue
  })
  return outputValues
}

/**
 * Takes a string literal from the Apps interface and processes
 * before running it through the linear generator
 * */

function processEase(key, easingFunc) {
  return {
    name: key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`),
    points: Array.from({ length: pointsLength }, (_, i) => {
      const pos = i / (pointsLength - 1)
      return [pos, Number(easingFunc(pos))]
    }),
    duration:
      'duration' in self && typeof self.duration === 'number'
        ? self.duration || 0
        : 0,
  }
}

/**
 * Last Magic??
 * */
function getSqSegDist(p, p1, p2) {
  let x = p1[0]
  let y = p1[1]
  let dx = p2[0] - x
  let dy = p2[1] - y

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy)

    if (t > 1) {
      x = p2[0]
      y = p2[1]
    } else if (t > 0) {
      x += dx * t
      y += dy * t
    }
  }

  dx = p[0] - x
  dy = p[1] - y

  return dx * dx + dy * dy
}

/**
 * More Magic
 * */
function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance
  let index

  for (let i = first + 1; i < last; i++) {
    const sqDist = getSqSegDist(points[i], points[first], points[last])

    if (sqDist > maxSqDist) {
      index = i
      maxSqDist = sqDist
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1) {
      simplifyDPStep(points, first, index, sqTolerance, simplified)
    }

    simplified.push(points[index])

    if (last - index > 1) {
      simplifyDPStep(points, index, last, sqTolerance, simplified)
    }
  }
}

/**
 * Magic stuff goes here
 * */
function simplifyDouglasPeucker(points, tolerance) {
  if (points.length <= 1) return points
  const sqTolerance = tolerance * tolerance
  const last = points.length - 1
  const simplified = [points[0]]
  simplifyDPStep(points, 0, last, sqTolerance, simplified)
  simplified.push(points[last])

  return simplified
}

/**
 * Take points and optimize them for linear generation
 * simplify 0 -> 0.025
 * round 0 -> 5
 * */
function useOptimizedPoints(fullPoints, simplify = 0, round = 5) {
  if (!fullPoints) return null
  // x is represented as a percentage, so no point rounding less than 2 places
  const xRounding = Math.max(round, 2)

  return simplifyDouglasPeucker(fullPoints, simplify).map(([x, y]) => [
    Math.round(x * 10 ** xRounding) / 10 ** xRounding,
    Math.round(y * 10 ** round) / 10 ** round,
  ])
}

const defaultSimplified = 0.0025
const defaultRounded = 4

/**
 * Ranges:
 * simplified: 0 - 0.0025
 * rounded: 0 - 5
 * */
const generateLinear = (key, ease, simplified, rounded, offset) => {
  const result = processEase(key, ease)
  const optimised = useOptimizedPoints(result.points, simplified, rounded)
  const linear = useLinearSyntax(optimised, rounded, offset)
  const output = useFriendlyLinearCode(linear, result.name, 0)
  return output
}

const generateCustomEase = (
  gsapEase,
  simplified = defaultSimplified,
  rounded = defaultRounded,
  offset = 1
) => {
  const ease = gsap.parseEase(gsapEase)
  if (ease) {
    const customEase = generateLinear('custom', ease, simplified, rounded, offset)
    return customEase
  }
}

window.generateCustomEase = generateCustomEase
