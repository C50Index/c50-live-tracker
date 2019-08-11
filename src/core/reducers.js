export function sequence (effects, effect) {
  return effects.concat(effect)
}

export function sequenceReduction (effects, reduction) {
  if (reduction.effects) {
    effects = sequence(effects, reduction.effects)
  }

  return { state: reduction.state, effects: effects || [] }
}

export function subReducersFor () {
  return function subReducer (key, reducer) {
    return (state, action) => {
      const reduction = reducer(state[key], action)
      if (reduction.state !== state[key]) {
        state = { ...state }
        state[key] = reduction.state
      }
      const effects = reduction.effects || []
      return { state, effects }
    }
  }
}

export function computedFor () {
  return function (key, reducer) {
    return (state, _) => {
      const value = reducer(state)
      if (state[key] !== value) {
        state = { ...state }
        state[key] = value
      }
      return { state, effects: [] }
    }
  }
}

export function reducerChain (state, action, effects = []) {
  const chainer = {
    apply: (reducer) => {
      const reduction = reducer(state, action)
      if (reduction.effects) {
        effects = effects.concat(reduction.effects)
      }
      state = reduction.state
      return chainer
    },

    result: () => {
      return {
        state,
        effects
      }
    }
  }

  return chainer
}
