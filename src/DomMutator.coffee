class window.DomMutator

	#number of dead links added the queue
	_errors: 0

	#constucts a mutator given a jquery element to place links
	constructor: (container) ->
		@container = container
		@objects = new Array

	#adds a htmllink to the queue
	addLink: (htmllink) ->
		@_errors++ if not htmllink.isValid()
		@objects.push htmllink

	#determines whether the links are worth commiting
	#basically if theres more than one broken link
	#or there are more errors than objects
	hasError: ->
		1 < @_errors or @_errors >= @objects.length

	#commits the elements to the DOM
	commitChanges: ->
		if not @hasError()
			@container.empty()
			@container.append $("<div class=\"info-key\">Downloads</div>")
			for obj, i in @objects
				@container.append $("<br />") if i > 0
				@container.append obj.toHtml()

	#adds an appropriate warning or error banner to DOM
	setErrorBanner: ->
		do @_dismissBanners
		if @_errors > 0
			fatalError = 1 < @_errors or @_errors >= @objects.length
			banner = $('<div>').addClass "ed-flash-container"
			#banner cell
			cell = $('<div>').addClass "ed-banner"
			#banner content
			content = $('<div>').addClass "ed-content"
			content.addClass if fatalError then "error" else "warning"
			label = $('<strong>').text if fatalError then "Error:" else "Notice:"
			if fatalError
				content.text "EchoDownload was unable to access any of the files needed for this lecture."
			else
				content.text "EchoDownload couldn't access all the files it needed. However, at least one file is available."
			content.prepend label
			#close button
			close = $('<span>').addClass "ed-close"
			close.html '&times;'
			close.click @_dismissBanners
			#add it all together
			banner.append cell
			cell.append content
			content.append close
			$('html').append banner

	#removes all banners from DOM
	_dismissBanners: ->
		do $('.ed-flash-container').remove
