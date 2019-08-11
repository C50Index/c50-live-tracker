
export function loadingRequest (name) {
  return {
    type: 'loading-request',
    name: name
  }
}

export function requestAjax (name, config) {
  return {
    effectType: 'request-ajax',
    name,
    config
  }
}

export function completeRequest (requestEffect,
  status, response,
  headers, when = Date.now()) {
  return {
    type: 'complete-request',
    name: requestEffect.name,
    success: status >= 200 && status < 300,
    status: status,
    response: response,
    headers: headers,
    when
  }
}

export function withAjax (dispatch, queueSize = 6, rootUrl = '') {
  return (effect) => {
    const requests = {}
    const canceled = false
    const xhrQueue = []
    const configsQueue = []
    let executingCount = 0

    const checkAndExecuteNext = () => {
      if (canceled) return

      while (executingCount < queueSize && xhrQueue.length && configsQueue.length) {
        const nextXhr = xhrQueue.shift()
        const nextConfig = configsQueue.shift()

        executingCount++
        if (nextConfig && nextXhr) {
          executeXhrWithConfig(nextConfig, nextXhr, rootUrl)
        }
      }
    }

    let normalizedName

    switch (effect.effectType) {
      case 'request-ajax':
        normalizedName = effect.name.join('-')

        dispatch(loadingRequest(effect.name))

        const xhr = requests[normalizedName] = new XMLHttpRequest()

        const completeXhr = () => {
          executingCount--
          if (requests[normalizedName] === xhr) {
            delete requests[normalizedName]
          }

          if (canceled) return

          checkAndExecuteNext()
        }

        xhr.onerror = function () {
          completeXhr()

          dispatch(completeRequest(effect, 0, '', ''))
        }

        xhr.onload = function () {
          completeXhr()

          dispatch(completeRequest(effect, xhr.status, xhr.responseText, xhr.getAllResponseHeaders()))
        }

        xhr.ontimeout = function () {
          completeXhr()

          dispatch(completeRequest(effect, 408, '', ''))
        }

        if (executingCount < queueSize) {
          executingCount++
          executeXhrWithConfig(effect.config, xhr, rootUrl)
        } else {
          xhrQueue.push(xhr)
          configsQueue.push(effect.config)
        }
    }
  }
}

export function executeXhrWithConfig (config, xhr, rootUrl = '') {
  xhr.withCredentials = false

  xhr.open(config.method, getAjaxUrl(config, rootUrl), true)

  const headers = config.headers
  if (headers) {
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key])
    }
  }

  xhr.send(getAjaxBody(config))
}

export function urlJoin (root, path) {
  if (!root) return path
  if (!path) return root
  if (typeof URL === 'function') {
    return new URL(path, root).toString()
  } else {
    if (root[root.length - 1] !== '/') {
      root += '/'
    }
    if (path[0] === '/') {
      path = path.substring(1)
    }
    return root + path
  }
}

export function getAjaxUrl (config, rootUrl = '') {
  let url = urlJoin(rootUrl, config.url)

  const query = config.query
  if (query) {
    const parts = []
    for (const key in query) {
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
    }

    if (parts.length) url += (url.indexOf('?') === -1 ? '?' : '&') + parts.join('&')
  }

  return url
}

export function getAjaxBody (config) {
  if (config.body) return config.body
  if (config.json) return JSON.stringify(config.json)
  return null
}
