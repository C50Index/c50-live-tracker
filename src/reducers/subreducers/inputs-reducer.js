export function inputChange (target, text) {
  return {
    type: 'input-change',
    target,
    text
  }
}

export function inputChangeDispatcher (dispatch, target, value = undefined) {
  return (e) => {
    e.stopPropagation()
    dispatch(inputChange(target, value === undefined ? e.target.value : value))
  }
}

export function reduceInputs (state, a) {
  const effects = []
  switch (a.type) {
    case 'input-change':
      if (state[a.target] === a.text) break
      state = { ...state }
      state[a.target] = a.text
      break
  }

  return { state, effects }
}
