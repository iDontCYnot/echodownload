class window.Lecture

	constructor: (data, @resource) ->
		@title = data.title
		@uuid = data.uuid
		@thumbnails = data.thumbnails
		@date = moment data.startTime.replace /([+-]\d{2}:\d{2}|Z)/i , ''
		@richMedia = data.richMedia
		console.log "Rich Media #{@richMedia}"

	hasError: ->
		not @date.isValid()

	getDirectory: ->
		if @thumbnails?[0]?
			matcher = new RegExp ".+#{@uuid}" , "i"
			[thumbDir, ...] = matcher.exec @thumbnails[0]
			if thumbDir? then thumbDir
		else
			[host, ...] = @resource.split /(ess\/|ecp\/)/
			if host?
				"#{host}#{@date.format "[echocontent/]YYWW[/]E[/]"}#{@uuid}"

	getLectureName: ->
		"#{@title}#{@date.format " [-] MMM Do"}"

	getHtmlLinkAudio: ->
		res = ResourceFiles.getAudioResource @
		console.log res
		new HtmlLink res, @getLectureName()

	getHtmlLinkVideo: ->
		res = ResourceFiles.getVideoResource @
		console.log res
		new HtmlLink res, @getLectureName()
