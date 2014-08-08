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
		banner = $("<div>").css
			'position' : "fixed"
			'background-color' : "darkred"
			'color' : "white"
			'top' : "0px"
			'width' : "100%"
			'font-family' : "sans-serif"
			'padding' : "18px"
			'border-bottom' : "1px solid lightcoral"
			'box-shadow' : "0px 0px 20px rgba(0,0,0,0.6)"
			'z-index' : 100
		banner.text "EchoDownload did a derp"
		$('html').append banner
