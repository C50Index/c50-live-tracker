import {withAjax} from "./ajax-service.js"
import {withWs} from "./ws.js"

export function getCoreServices(dispatch) {
    let services = [];
    services.push(withAjax(dispatch, 6));
    services.push(withWs(dispatch));
    return services;
}
