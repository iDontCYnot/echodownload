# Commands and filenames
ZIP=zip -r
IGNORE=-x \*.DS_Store
CR_ARCHIVE=chrome_dist.zip

# Zip all files into chrome archive
all: chrome/*
	$(ZIP) $(CR_ARCHIVE) chrome/* $(IGNORE)

# Removed archives
clean:
	rm $(CR_ARCHIVE)