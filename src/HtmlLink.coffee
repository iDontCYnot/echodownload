class window.HtmlLink

	constructor: (@resource, @filename) ->

	toHtml: ->
		element = $("<div>")
		element.addClass "info-value"

		if @resource.isValid()
			anchor = $("<a>").attr
				'href': @resource.href
				'download': "#{@filename}.#{@resource.extension}"
				'title': if @resource.isVideo then BrowserComms.getLocaleString "videoTitle" else BrowserComms.getLocaleString "audioTitle"
			anchor.text if @resource.isVideo then BrowserComms.getLocaleString "videoAnchor" else BrowserComms.getLocaleString "audioAnchor"
			element.append anchor
		else
			element.text if @resource.isVideo then BrowserComms.getLocaleString "videoUnavailable" else BrowserComms.getLocaleString "audioUnavailable"

	isValid: ->
		@resource.isValid()
