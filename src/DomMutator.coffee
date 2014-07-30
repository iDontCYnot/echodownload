class DomMutator
	_errors: 0

	constructor: (container) ->
		@container = container
		@objects = new Array

	addLink: (htmllink) ->
		@_errors++ if not htmllink.isValid()
		@objects.push htmllink

	hasError: ->
		@_errors > 1

	commitChanges: ->
		if not @hasError()
			@container.empty()
			@container.append $("<div class=\"info-key\">Downloads</div>")
			for obj, i in @objects
				@container.append $("<br />") if i > 0
				@container.append obj.toHtml()
