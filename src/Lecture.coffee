class Lecture
	constructor: (data, @resource) ->
		@title = data.title
		@uuid = data.uuid
		@thumbnails = data.thumbnails
		@date = moment data.startTime.replace /([+-]\d{2}:\d{2}|Z)/i , ''
		@richMedia = data.richMedia

	hasError: ->
		not @date.isValid()

	getDirectory: ->
		if @thumbnails?[0]?
			matcher = new RegExp ".+#{@uuid}" , "i"
			[thumbDir, ...] = matcher.exec @thumbnails[0]
			if thumbDir? then thumbDir
		else
			[host, ...] = @resource.split /(ess\/|ecp\/)/
			host

	getLectureName: ->
		"#{@title}#{@date.format "[echocontent/]YYWW[/]E[/]"}#{@uuid}"

	getHtmlLinkAudio: ->
		res = ResourceFiles.getAudioResource @
		new HtmlLink res, @getLectureName()

	getHtmlLinkVideo: ->
		res = ResourceFiles.getVideoResource @
		new HtmlLink res, @getLectureName()
