#let chrome know what to do if the content scripts receive a message
chrome?.runtime?.onMessage.addListener BrowserComms.fromBackground
safari?.self?.addEventListener "message", BrowserComms.fromBackground, false
