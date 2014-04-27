# Commands and filenames
ZIP=zip -r
IGNORE=-x \*.DS_Store
LOGS_DIS=logs_disabled.js
LOGS_TMP=.logs_tmp
LOGS_ACT=logs.js
CR_ARCHIVE=chrome_dist.zip

# Zip all files into chrome archive
all: chrome/*
	mv chrome/$(LOGS_ACT) $(LOGS_TMP) # move active out
	cp $(LOGS_DIS) chrome/$(LOGS_ACT) # copy inactive to chrome
	$(ZIP) $(CR_ARCHIVE) chrome/* $(IGNORE)
	mv $(LOGS_TMP) chrome/$(LOGS_ACT) # move active back in

# Removed archives
clean:
	rm $(CR_ARCHIVE)