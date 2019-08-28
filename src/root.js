import { reducerChain, subReducersFor } from './core/reducers.js'
import { getCoreServices } from './core/services/services.js'
import { RootPage } from './views/root-page.js'
import { initialState } from './state.js'
import { reduceInputs } from './reducers/subreducers/inputs-reducer.js'

import { reduceToggles } from './reducers/subreducers/toggles-reducer.js'
import { reduceInitialLoading } from './reducers/initial-loading-reducer.js'
import { reduceCoins } from './reducers/coin-reducer.js'

// options: {showChart: boolean}
window.MarkactRoot = function (id, options = {}) {
  /* global self, this */
  self = this
  self.id = id

  self.state = { ...initialState }
  self.state.options = { ...self.state.options, ...options }
  console.log(self.state)

  self.root = document.getElementById(self.id)

  const subReducer = subReducersFor()
  self.reduce = function (state, action) {
    return reducerChain(state, action)
      .apply(reduceInitialLoading)
      .apply(subReducer('inputs', reduceInputs))
      .apply(subReducer('toggles', reduceToggles))
      .apply(reduceCoins)
      .result()
  }

  self.reduceEffects = function (effects) {
    effects.map(effect => self.services.map(service => service(effect)))
  }

  const queuedActions = []

  self.dispatch = function (action) {
    if (installingServices) {
      queuedActions.push(action)
      return
    }
    const startTimings = Date.now()
    // console.log('action', action)

    const oldState = { ...self.state }
    const reduction = self.reduce(oldState, action)

    self.state = reduction.state
    if (reduction.effects) {
      self.reduceEffects(reduction.effects)
    }

    // console.log('new state', self.state)
    const startRenderTime = Date.now()
    if (oldState !== self.state) {
      self.render()
    }
    const renderTime = Date.now() - startRenderTime
    // console.log('rendered in', renderTime, 'ms')
    // console.log('co/mpleted in', Date.now() - startTimings, 'ms')
    // if (renderTime > 50) {
    //   console.warn('Slow action:  ', renderTime + 'ms', action)
    // }
  }
  self.render = function () {
    const RootPageContent = RootPage(self.dispatch)
    window.preact.render(
      RootPageContent(self.state),
      self.root,
      document.getElementById('main')
    )
  }

  let installingServices = true
  self.services = getCoreServices(self.dispatch)
  installingServices = false
  while (queuedActions.length > 0) {
    const tmp = queuedActions.pop()
    self.dispatch(tmp)
  }

  self.dispatch({ type: 'init' })
}
