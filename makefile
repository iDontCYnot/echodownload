# Commands and filenames
ZIP=zip
CR_ARCHIVE=chrome_dist.zip

# Zip all files into chrome archive
all: chrome/*
	$(ZIP) $(CR_ARCHIVE) chrome/*

# Removed archives
clean:
	rm $(CR_ARCHIVE)