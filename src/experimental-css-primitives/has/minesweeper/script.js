import '../../../../net/experimental-web-platform/script.js'

/**
 * Building the DOM although you could snapshot this with Pug or whatever.
 *
 * */

const GET_RANDOM = (min, max) =>
  Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  )

/**
 * This is a bunch of boilerplate that generates the game map (?)
 * */
const COLUMNS = 9
const ROWS = 9
const CELL_COUNT = COLUMNS * ROWS
const MINE_COUNT = 8
const MINE_INDEXES = []
const ZEROS = []
const ZERO_GROUPS = []
let highestCount = 1

const FORM = document.querySelector('form')
FORM.style.setProperty('--columns', COLUMNS)
FORM.style.setProperty('--rows', ROWS)
document.documentElement.style.setProperty('--mine-count', MINE_COUNT)

const ADD_INDEX = () => {
  const INDEX = GET_RANDOM(0, CELL_COUNT)
  if (MINE_INDEXES.indexOf(INDEX) === -1) {
    return INDEX
  } else return ADD_INDEX()
}

for (let m = 0; m < MINE_COUNT; m++) {
  MINE_INDEXES[m] = ADD_INDEX()
}

const GET_SURROUNDINGS = (INDEX) => {
  const COLUMN = INDEX % COLUMNS
  const TL = INDEX - (COLUMNS + 1)
  const TC = INDEX - COLUMNS
  const TR = INDEX - (COLUMNS - 1)
  const L = INDEX - 1
  const R = INDEX + 1
  const BL = INDEX + (COLUMNS - 1)
  const BC = INDEX + COLUMNS
  const BR = INDEX + (COLUMNS + 1)
  let SURROUNDINGS = [TC, BC]

  if (COLUMN !== 0) SURROUNDINGS.push(TL, L, BL)
  if (COLUMN !== COLUMNS - 1) SURROUNDINGS.push(TR, R, BR)

  return SURROUNDINGS.filter((s) => s >= 0)
}

const GET_BOMB_COUNT = (index) => {
  let count = 0
  for (const SURROUNDING of GET_SURROUNDINGS(index)) {
    if (MINE_INDEXES.indexOf(SURROUNDING) !== -1) count++
  }
  if (count > highestCount) highestCount = count
  return count
}

const GAME_BOARD = new Array(CELL_COUNT).fill(0).map((_, i) => {
  const COUNT = MINE_INDEXES.indexOf(i) !== -1 ? 'X' : GET_BOMB_COUNT(i)
  if (COUNT === 0) ZEROS.push(i)
  return COUNT
})

const PUSH_TO_GROUP = (INDEX, GROUP, ZEROS) => {
  GROUP.push(INDEX)
  for (const SURROUNDING of GET_SURROUNDINGS(INDEX)) {
    if (ZEROS.indexOf(SURROUNDING) !== -1 && GROUP.indexOf(SURROUNDING) === -1)
      PUSH_TO_GROUP(SURROUNDING, GROUP, ZEROS)
  }
}

const PAD_GROUPS = (GROUPS) => {
  for (const GROUP of GROUPS) {
    for (const POS of [...GROUP]) {
      for (const SURROUNDING of GET_SURROUNDINGS(POS)) {
        if (
          GROUP.indexOf(SURROUNDING) === -1 &&
          GAME_BOARD[SURROUNDING] !== 'X'
        )
          GROUP.push(SURROUNDING)
      }
    }
  }
}

const GROUP_ZEROS = () => {
  for (let o = 0; o < ZEROS.length; o++) {
    if (
      ZERO_GROUPS.filter((group) => group.indexOf(ZEROS[o]) !== -1).length === 0
    ) {
      const ZERO_GROUP = []
      PUSH_TO_GROUP(ZEROS[o], ZERO_GROUP, ZEROS)
      ZERO_GROUPS.push(ZERO_GROUP)
    }
  }
  PAD_GROUPS(ZERO_GROUPS)
}

GROUP_ZEROS()


// Here is where we generate the DOM and styles that are needed for it.

let defusers = []
let created = []
let prompted = []


const BOARD_GROUP_CONTROLS = document.querySelector('.board__group-controls')
const genBoardGroupControls = () => {
  let c = 0
  while (c < CELL_COUNT) {
    const COUNT = GAME_BOARD[c]
    let forId
    if (ZEROS.indexOf(c) !== -1) {
      let idx = 0
      for (let z = 0; z < ZERO_GROUPS.length; z++) {
        if (ZERO_GROUPS[z].indexOf(c) !== -1) idx = z
      }
      forId = `group--${idx}`
    }
    if(forId && created.indexOf(forId) === -1) {
      const CHECK = Object.assign(document.createElement('input'), {
        type: 'checkbox',
        id: forId
      })
      BOARD_GROUP_CONTROLS.appendChild(CHECK)
      created.push(forId)
    }
    c++
  }
  let d = 0
  while(d < CELL_COUNT) {
    const COUNT = GAME_BOARD[d]
    let forId
    if (COUNT !== 'X' && COUNT !== 0 && ZERO_GROUPS.filter(g => g.indexOf(d) !== -1).length === 0) {
      forId = `prompt--${d}`
    }
    if (forId && (COUNT !== 'X' && COUNT !== 0)) {
      const CHECK = Object.assign(document.createElement('input'), {
        type: 'checkbox',
        id: forId
      })
      BOARD_GROUP_CONTROLS.appendChild(CHECK)
      prompted.push(forId)
    }
    d++
  }
}
genBoardGroupControls()
const BOARD = document.querySelector('.board')
// Generate the labels and things :D
const genGameControls = () => {
  let i = 0
  while (i < CELL_COUNT) {
    const COUNT = GAME_BOARD[i]
    let hue = 0
    let forId
    let CLASS_NAME = `board__cell board__cell--${COUNT}`
    if (COUNT === 'X') {
      CLASS_NAME += ' board__cell--exploder'
    }
    if (COUNT !== 'X' && COUNT !== 0 && ZERO_GROUPS.filter(g => g.indexOf(i) !== -1).length === 0) {
      forId = `prompt--${i}`
    }
    let group
    for (let g = 0; g < ZERO_GROUPS.length; g++) {
      const GROUP = ZERO_GROUPS[g]
      if (GROUP.indexOf(i) !== -1) {
        hue = (180 / highestCount) * COUNT
        CLASS_NAME += ` board__cell-group--${g}`
        if (COUNT === 0) forId = `group--${g}`
      }
    }
    const CELL = Object.assign(document.createElement('div'), {
      className: CLASS_NAME,
      style: `--hue: ${hue}`,
    })
    BOARD.appendChild(CELL)

    let innerHTML = ``
    let content = COUNT === 0 ? '' : COUNT
    if (COUNT === 'X') {
      content = '💣'
    }
    innerHTML += `<span>${content}</span>`
    innerHTML += `<input type=checkbox id=flag--${i}><label for=flag--${i}></label>`

    console.info({ COUNT, forId })

    if (COUNT !== 'X' && forId) {
      innerHTML += `<label for=${forId}></label>`
    }
    if (!forId) {
      innerHTML += `<input type=checkbox id=placeholder--${i}><label for=placeholder--${i}></label>`
    }
    if (COUNT === 'X') {
      innerHTML += `<input type=checkbox id=bomb--${i}><label for=bomb--${i}></label>`
    }
    CELL.innerHTML = innerHTML
    i++
  }
}
genGameControls()

const genRequiredStyles = () => {
  let GROUPINGS = ''
  for (let g = 0; g < ZERO_GROUPS.length; g++) {
    GROUPINGS += `:root:has(#group--${g}:checked) .board__cell-group--${g} label,`
  }
  for (let p = 0; p < prompted.length; p++) {
    GROUPINGS += `:root:has(#${prompted[p]}:checked) .board__cell:has([for=${prompted[p]}]) label ${p === prompted.length - 1 ? ' {' : ','}`
  }
  // GROUPINGS += 'z-index: -1; opacity: 0; }'
  GROUPINGS += 'display: none; }'
  let VICTORY_DANCE = ':root:has('
  for (let a = 0; a < ZERO_GROUPS.length; a++) {
    VICTORY_DANCE += `#${created[a]}:checked ~`
  }
  for (let b = 0; b < prompted.length; b++) {
    VICTORY_DANCE += `#${prompted[b]}:checked ${b === prompted.length - 1 ? '' : '~'}`
  }
  VICTORY_DANCE += ') body ' 
  const COMBINATION_STYLE = '{ --screen-hide: 0; --show-win: 1; --state: paused; }'
  const COMBINATION_WIN_HIDE = `
    :where(.dialog__content--intro, .dialog__content--lose) {
      --z: -1;
      --opacity: 0;
    }
  `
  const COMBINATION_WIN_SHOW = `
    :where(.dialog__content--win) {
      --z: 2;
      opacity: 1;
    }
  `
  document.body.appendChild(Object.assign(document.createElement('style'), {
    innerHTML: `${GROUPINGS} ${VICTORY_DANCE}${COMBINATION_STYLE} ${VICTORY_DANCE}${COMBINATION_WIN_HIDE} ${VICTORY_DANCE}${COMBINATION_WIN_SHOW}`
  }))
}

genRequiredStyles()