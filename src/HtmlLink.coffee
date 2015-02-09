class window.HtmlLink

	constructor: (@resource, @filename) ->

	toHtml: ->
		element = $("<div>")
		element.addClass "info-value"

		if @resource.isValid()
			anchor = $("<a>").attr
				'href': @resource.href
				'download': "#{@filename}.#{@resource.extension}"
				'title': if @resource.isVideo then chrome.i18n.getMessage "videoTitle" else chrome.i18n.getMessage "audioTitle"
			anchor.text if @resource.isVideo then chrome.i18n.getMessage "videoAnchor" else chrome.i18n.getMessage "audioAnchor"
			element.append anchor
		else
			element.text if @resource.isVideo then chrome.i18n.getMessage "videoUnavailable" else chrome.i18n.getMessage "audioUnavailable"

	isValid: ->
		@resource.isValid()
