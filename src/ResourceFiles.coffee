class ResourceFiles

	@getAudioResource: (lecture) ->
		dir = lecture.getDirectory()
		rich = lecture.richMedia
		possible = [
			new ResourceLink "#{dir}/audio.mp3", "mp3", false
			new ResourceLink "#{dir}/audio_1.aac", "aac", false
			new ResourceLink "#{rich}/mediacontent.mp3", "mp3", false
			new ResourceLink null, null, false
		]
		@firstUsefulMedia possible

	@getVideoResource: (lecture) ->
		dir = lecture.getDirectory()
		rich = lecture.richMedia
		possible = [
			new ResourceLink "#{dir}/audio-vga.m4v", "m4v", true
			new ResourceLink "#{dir}/audio-video.m4v", "m4v", true
			new ResourceLink "#{rich}/mediacontent.m4v", "m4v", true
			new ResourceLink null, null, true
		]
		@firstUsefulMedia possible

	@firstUsefulMedia: (possible) ->
		for media in possible
			if media.isValid() then return media
		possible[possible.length - 1]
