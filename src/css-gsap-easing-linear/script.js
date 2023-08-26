import gsap from 'https://cdn.skypack.dev/gsap'

const pointsLength = 10_000
const lineLength = 80
const _2PI = Math.PI * 2;
const _sin = Math.sin;
const _sqrt = Math.sqrt;
const _cos = Math.cos;
const _HALF_PI = _2PI / 4;

/**
 * GSAP Stuff
 * 
 * */
const _easeMap = {};
const _globals = {};
const _customEaseExp = /^[\d.\-M][\d.\-,\s]/;
const _quotesExp = /["']/g;
const _forEachName = (names, func) => ((names = names.split(",")).forEach(func)) || names; //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
const _parseObjectInString = value => { //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  let obj = {},
    split = value.substr(1, value.length-3).split(":"),
    key = split[0],
    i = 1,
    l = split.length,
    index, val, parsedVal;
  for (; i < l; i++) {
    val = split[i];
    index = i !== l-1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index+1).trim();
  }
  return obj;
};
const _valueInParentheses = value => {
  let open = value.indexOf("(") + 1,
    close = value.indexOf(")"),
    nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
};
const _configEaseFromString = name => { //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  let split = (name + "").split("("),
    ease = _easeMap[split[0]];
  return (ease && split.length > 1 && ease.config) ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : (_easeMap._CE && _customEaseExp.test(name)) ? _easeMap._CE("", name) : ease;
};
const _invertEase = ease => p => 1 - ease(1 - p);
// allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos.
const _propagateYoyoEase = (timeline, isYoyo) => {
  let child = timeline._first, ease;
  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }
    child = child._next;
  }
};
const _parseEase = (ease, defaultEase) => !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
const _insertEase = (names, easeIn, easeOut = p => 1 - easeIn(1 - p), easeInOut = (p => p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2)) => {
  let ease = {easeIn, easeOut, easeInOut},
    lowercaseName;
  _forEachName(names, name => {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[(lowercaseName = name.toLowerCase())] = easeOut;
    for (let p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });
  return ease;
};
const _easeInOutFromOut = easeOut => (p => p < .5 ? (1 - easeOut(1 - (p * 2))) / 2 : .5 + easeOut((p - .5) * 2) / 2);
const _configElastic = (type, amplitude, period) => {
  let p1 = (amplitude >= 1) ? amplitude : 1, //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
    p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
    p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
    easeOut = p => p === 1 ? 1 : p1 * (2 ** (-10 * p)) * _sin((p - p3) * p2) + 1,
    ease = (type === "out") ? easeOut : (type === "in") ? p => 1 - easeOut(1 - p) : _easeInOutFromOut(easeOut);
  p2 = _2PI / p2; //precalculate to optimize
  ease.config = (amplitude, period) => _configElastic(type, amplitude, period);
  return ease;
};
const _configBack = (type, overshoot = 1.70158) => {
  let easeOut = p => p ? ((--p) * p * ((overshoot + 1) * p + overshoot) + 1) : 0,
    ease = type === "out" ? easeOut : type === "in" ? p => 1 - easeOut(1 - p) : _easeInOutFromOut(easeOut);
  ease.config = overshoot => _configBack(type, overshoot);
  return ease;
};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", (name, i) => {
  let power = i < 5 ? i + 1 : i;
  _insertEase(name + ",Power" + (power - 1), i ? p => p ** power : p => p, p => 1 - (1 - p) ** power, p => p < .5 ? (p * 2) ** power / 2 : 1 - ((1 - p) * 2) ** power / 2);
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic())
// Think this puts the bounce in???
const createBounce = (n, c) => {
  let n1 = 1 / c,
    n2 = 2 * n1,
    n3 = 2.5 * n1,
    easeOut = p => (p < n1) ? n * p * p : (p < n2) ? n * (p - 1.5 / c) ** 2 + .75 : (p < n3) ? n * (p -= 2.25 / c) * p + .9375 : n * (p - 2.625 / c) ** 2 + .984375;
  _insertEase("Bounce", p => 1 - easeOut(1 - p), easeOut);
}
createBounce(7.5625, 2.75);
_insertEase("Expo", p => p ? 2 ** (10 * (p - 1)) : 0);
_insertEase("Circ", p => -(_sqrt(1 - (p * p)) - 1));
_insertEase("Sine", p => p === 1 ? 1 : -_cos(p * _HALF_PI) + 1);
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config(steps = 1, immediateStart) {
    let p1 = 1 / steps,
      p2 = steps + (immediateStart ? 0 : 1),
      p3 = immediateStart ? 1 : 0,
      max = 1 - _tinyNum;
    return p => (((p2 * _clamp(0, max, p)) | 0) + p3) * p1;
  }
};

console.info({ map: _easeMap})

/**
 * ALL THE MAGIC STUFF IN HERE FROM LINEAR IS
 * FROM JAKE ARCHIBALD – @JAFFATHECAKE
 * LEARNED A BUNCH ABOUT THIS STUFF FROM PICKING HIS BRAINS ON IT
 * **/
const durationFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
})

function useFriendlyLinearCode(parts, name, idealDuration) {
  if (parts.length === 0) return ''

  // let outputStart = ':root {\n'
  // let outputEnd = '\n}'
  let linearStart = `  --${name}: linear(`
  let linearEnd = ');'
  let lines = []
  let line = ''

  const lineIndentSize = 4

  for (const part of parts) {
    // 1 for comma
    if (line.length + part.length + lineIndentSize + 1 > lineLength) {
      lines.push(line + ',')
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

  let idealDurationLine = ''

  if (idealDuration !== 0) {
    idealDurationLine = `\n  --${name}-duration: ${durationFormat.format(
      idealDuration.value / 1000
    )}s;`
  }

  return (
    // outputStart +
    linearStart +
    '\n    ' +
    lines.join('\n    ') +
    '\n  ' +
    linearEnd
    // idealDurationLine +
    // outputEnd
  )
}

/**
 * The part that outputs for consumptions
 * */

/**
 * The main part of the linear generation
 * */

function useLinearSyntax(points, round) {
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

        if (!valuesWithRedundantX.has(value)) {
          output += ' ' + xFormat.format(x * 100) + '%'
        }

        return output
      })
      .join(', ')

    if (group.length === 1) return regularValue

    // Maybe it's shorter to provide a value that skips steps?
    const xVals = [group[0][0], group.at(-1)[0]]
    const positionalValues = xVals
      .map((x) => xFormat.format(x * 100) + '%')
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

function processScriptData(script) {
  const oldGlobals = Object.keys(self)

  // Using importScripts rather than eval, as it gives better stack traces.
  // But also wrapping in a function, so things aren't global by default.
  // importScripts(
  //   `data:text/javascript,${encodeURIComponent(`(() => {${script};})()`)}`,
  // );

  eval(`(() => {${script};})()`)

  let easingFunc

  // Look for a new global
  const newGlobals = new Set(Object.keys(self))
  for (const key of oldGlobals) newGlobals.delete(key)

  // Remove any non-functions
  for (const key of newGlobals) {
    // @ts-ignore
    if (typeof self[key] !== 'function') newGlobals.delete(key)
  }

  if (newGlobals.size > 1) {
    throw Error(
      'Too many global functions. Found: ' + [...newGlobals].join(', ')
    )
  }

  if (newGlobals.size === 0) {
    throw Error('No global function found.')
  }

  const [key] = newGlobals

  easingFunc = self[key]

  return {
    name: key.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase()),
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
    var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy)

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

// const EASES = {
//   'elastic-out': `
//     self.elasticOut = _easeMap.Elastic.easeIn;
//   `,
//   // 'elastic-in': `
//   //   self.elasticIn = _configElastic('in');
//   // `,
//   // 'elastic-inOut': `
//   //   self.elasticInOut = _configElastic('inOut');
//   // `,
//   // 'elastic-inOut': `
//   //   const _2PI = Math.PI * 2;
//   //   const _sin = Math.sin;

//   //   const _configElastic = (type, amplitude, period) => {
//   //       let p1 = (amplitude >= 1) ? amplitude : 1, //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
//   //           p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
//   //           p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
//   //           easeOut = p => p === 1 ? 1 : p1 * (2 ** (-10 * p)) * _sin((p - p3) * p2) + 1,
//   //           ease = (type === "out") ? easeOut : (type === "in") ? p => 1 - easeOut(1 - p) : _easeInOutFromOut(easeOut);
//   //       p2 = _2PI / p2; //precalculate to optimize
//   //       ease.config = (amplitude, period) => _configElastic(type, amplitude, period);
//   //       return ease;
//   //   };

//   //   const _easeInOutFromOut = easeOut => (p => p < .5 ? (1 - easeOut(1 - (p * 2))) / 2 : .5 + easeOut((p - .5) * 2) / 2);

//   //   self.elasticInOut = _configElastic('in');
//   // `,
// }


let easings = ''
for (const key of Object.keys(_easeMap)) {
  // console.info({ key })
  if (_easeMap[key].easeInOut) {
    console.info({ key })
    for (const style of ['easeIn', 'easeOut', 'easeInOut']) {
      const result = processScriptData(`
        self.${key.charAt(0).toLowerCase()}${key.slice(1)}${style.replace(/ease/g, '')} = _easeMap.${key}.${style}
      `)
      const optimised = useOptimizedPoints(result.points, 0.0025, 4)
      const linear = useLinearSyntax(optimised, 4)
      const output = useFriendlyLinearCode(linear, result.name, 0)
      easings += output
    }
  }
  // // console.info({ result })
  // // Take this and pass into useOptimizedPoints to get something back for Linear....
  // // Use simplify === 0 and round === 5

  // // console.info({ optimised })


  // // console.info({ linear })


  // // console.info({ output })

}

let outputStart = ':root {'
let outputEnd = '}' 
let styles = `
  ${outputStart}
  ${easings}
  ${outputEnd}
`
document.body.innerHTML = styles  