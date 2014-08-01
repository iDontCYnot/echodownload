class window.MediaLink

	_validity_checks: 0
	_last_validity_result: false

	constructor: (@href, @extension, @isVideo) ->

	isValid: ->
		@_validity_checks++
		if @href?
			if @_validity_checks > 1
				@_last_validity_result
			else
				$.ajax
					type: 'HEAD'
					url: @href
					async: false
					success: () =>
						@_last_validity_result = true
					error: () =>
						@_last_validity_result = false

		else
			@_last_validity_result = false
