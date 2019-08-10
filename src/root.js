import {reducerChain, computedFor} from "./core/reducers.js";
import {getCoreServices} from "./core/services/services.js";
import {RootPage} from "./views/root-page.js";
import {renderAt} from "./core/markact.js";
import {initialState} from "./state.js";
import {reduceInputs} from "./reducers/subreducers/inputs-reducer.js";
import {subReducersFor} from "./core/reducers.js";
import {reduceToggles} from "./reducers/subreducers/toggles-reducer.js";
import {reduceInitialLoading} from "./reducers/initial-loading-reducer.js";
import { reduceCoins } from "./reducers/coin-reducer.js";

window.MarkactRoot = function(id) {
    self = this;
    self.id = id;
    self.state = {...initialState};

    const subReducer = subReducersFor();
    const computed = computedFor();
    self.reduce = function(state, action) {
        return reducerChain(state, action)
            .apply(reduceInitialLoading)
            .apply(subReducer("inputs", reduceInputs))
            .apply(subReducer("toggles", reduceToggles))
            .apply(reduceCoins)
            .result();
    };

    self.reduceEffects = function(effects) {
        effects.map(effect => self.services.map(service => service(effect)))
    };

    let queuedActions = [];
    self.dispatch = function(action) {
        if (installingServices) {
            queuedActions.push(action);
            return;
        }
        let startTimings = Date.now();
        console.log("action", action);

        let oldState = {...self.state};
        let reduction = self.reduce(oldState, action);

        self.state = reduction.state;
        if (reduction.effects) {
            self.reduceEffects(reduction.effects);
        }

        console.log("new state", self.state);
        let startRenderTime = Date.now();
        self.render();
        let renderTime = Date.now() - startRenderTime;
        console.log("rendered in", renderTime, "ms");
        console.log("completed in", Date.now() - startTimings, "ms");
        if (renderTime > 50) {
            console.warn("Slow action:  ", renderTime + "ms", action);
        }
    };
    self.render = function () {
        let RootPageContent = RootPage(self.dispatch);
        renderAt(RootPageContent({
            ...self.state
        }), self.id);
    };

    let installingServices = true;
    self.services = getCoreServices(self.dispatch);
    installingServices = false;
    while (queuedActions.length > 0) {
        let tmp = queuedActions.pop();
        self.dispatch(tmp);
    }



    self.dispatch({type: "init"});
};
