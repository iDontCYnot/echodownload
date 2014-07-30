class HtmlLink
	constructor: (@resource, @filename) ->

	toHtml: ->
		element = $("<div>")
		element.addClass "info-value"

		if @resource.isValid()
			anch = $("<a>").attr
			'href': @resource.href
			'download': "#{@filename}.#{@resource.extension}"
			'title': if @resource.isVideo then "Download Video or Screen File" else "Download Audio File"
			arch.text if @resource.isVideo then "Video File" else "Audio File"
			element.append arch
		else
			element.text if @resource.isVideo then "Video Unavailable" else "Audio Unavailable"
