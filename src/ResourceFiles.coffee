class window.ResourceFiles

	# function to generate possible audio files
	@_possible_audio: (d, r) ->
		[
			new MediaLink "#{d}/audio.mp3", "mp3", false
			new MediaLink "#{d}/audio_1.aac", "aac", false
			new MediaLink "#{r}/mediacontent.mp3", "mp3", false
			new MediaLink null, null, false
		]

	# function to generate possible video files
	@_possible_video: (d, r) ->
		[
			new MediaLink "#{d}/audio-vga.m4v", "m4v", true
			new MediaLink "#{d}/audio-video.m4v", "m4v", true
			new MediaLink "#{r}/mediacontent.m4v", "m4v", true
			new MediaLink null, null, true
		]

	@getAudioResource: (lecture) ->
		@_getResource lecture, false

	@getVideoResource: (lecture) ->
		@_getResource lecture, true

	@_getResource: (lecture, isVideo) ->
		dir = lecture.getDirectory()
		rich = lecture.richMedia
		# pick appropriate resources
		getSources = if isVideo then @_possible_video else @_possible_audio
		@_firstUsefulMedia getSources dir, rich

	@_firstUsefulMedia: (possible) ->
		for media in possible
			if media.isValid() then return media
		possible[possible.length - 1]
