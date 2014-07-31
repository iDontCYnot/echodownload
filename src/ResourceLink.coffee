class window.ResourceLink

	_validity_checks: 0
	_last_validity_result: false

	constructor: (@href, @extension, @isVideo) ->

	isValid: ->
		@_validity_checks++
		if @href?
			if @_validity_checks > 1
				@_last_validity_result
			else
				isValid = false
				$.ajax
					type: 'HEAD'
					url: @href
					async: false
					success: () ->
						isValid = true
					error: () ->
						isValid = false
				console.log "result is #{isValid}"
				@_last_validity_result = isValid

		else
			@_last_validity_result = false
