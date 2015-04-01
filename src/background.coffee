#tell chrome what to do with the requests it hears
chrome?.runtime.onMessage.addListener BrowserComms.fromContent
chrome?.webRequest.onCompleted.addListener BrowserComms.onCompletedRequest, urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]
#tell safari what to do with the requests it hears
safari?.application.addEventListener "message", BrowserComms.fromContent, false
