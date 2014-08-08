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
			@container.empty()
			@container.append $("<div class=\"info-key\">Downloads</div>")
			for obj, i in @objects
				@container.append $("<br />") if i > 0
				@container.append obj.toHtml()

	setErrorBanner: ->
		banner = $("<div>")
		banner.addClass "ed_banner"
		banner.addClass "error"
		banner.text "<Placeholder Error>"
		#close button
		close = $("<div>")
		close.addClass "close"
		close.text "Dismiss"
		banner.append close
		$('html').append banner
