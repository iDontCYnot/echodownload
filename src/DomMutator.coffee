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
			@container.append $("<div class=\"info-key\">#{chrome.i18n.getMessage "downloadContainer"}</div>")
			for obj, i in @objects
				@container.append $("<br />") if i > 0
				@container.append obj.toHtml()

	#adds an appropriate warning or error banner to DOM
	setErrorBanner: ->
		do @_dismissBanners
		if @_errors > 0
			fatalError = 1 < @_errors or @_errors >= @objects.length
			banner = $('<div>').addClass "ed-banner"
			#banner content
			content = $('<div>').addClass if fatalError then "ed-error" else "ed-warning"
			label = $('<strong>').text if fatalError then chrome.i18n.getMessage "errorTag" else chrome.i18n.getMessage "noticeTag"
			if fatalError
				content.text chrome.i18n.getMessage "errorContent"
			else
				content.text chrome.i18n.getMessage "noticeContent"
			content.prepend label
			#close button
			close = $('<span>').addClass "ed-close"
			close.html '&times;'
			close.click @_dismissBanners
			#add it all together
			banner.append content
			content.append close
			$('html').append banner

	#removes all banners from DOM
	_dismissBanners: ->
		do $('.ed-banner').remove
