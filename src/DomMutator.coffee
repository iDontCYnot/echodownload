class window.DomMutator

	_errors: 0

	constructor: (container) ->
		@container = container
		@objects = new Array

	addLink: (htmllink) ->
		@_errors++ if not htmllink.isValid()
		@objects.push htmllink

	hasError: ->
		1 < @_errors or @_errors >= @objects.length

	commitChanges: ->
		if not @hasError()
			#get rid of any old error banners
			@container.empty()
			@container.append $("<div class=\"info-key\">Downloads</div>")
			for obj, i in @objects
				@container.append $("<br />") if i > 0
				@container.append obj.toHtml()

	setErrorBanner: ->
		if @_errors > 0
			fatalError = 1 < @_errors or @_errors >= @objects.length
			banner = $('<div>')
			banner.addClass "ed-flash-container"
			#banner cell
			cell = $('<div>')
			cell.addClass "ed-banner"
			#banner content
			content = $('<div>')
			content.addClass "ed-content"
			content.addClass if fatalError then "error" else "warning"
			label = $('<strong>').text if fatalError then "Error" else "FYI"
			if fatalError
				content.text "EchoDownload was unable to access any of the files needed for this lecture."
			else
				content.text "EchoDownload couldn't access all the files it needed, however at least one file is available."
			content.prepend label
			#close button
			close = $('<span>')
			close.addClass "ed-close"
			close.html '&times;'
			close.click @_dismissBanners

			#add it all together
			banner.append cell
			cell.append content
			content.append close
			$('html').append banner

	_dismissBanners: ->
		do $('.ed-flash-container').remove
