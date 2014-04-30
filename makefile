# Commands and filenames
ZIP=zip -r
IGNORE=-x \*.DS_Store
LOGS_DIS=logs_disabled.js
LOGS_TMP=.logs_tmp
LOGS_ACT=logs.js
CR_ZIP=chrome_dist
CR_ARCHIVE=$(CR_ZIP)_`date +'%y_%m_%d'`

# Zip all files into chrome archive
all: chrome/*
	mv chrome/$(LOGS_ACT) $(LOGS_TMP) # move active out
	cp $(LOGS_DIS) chrome/$(LOGS_ACT) # copy inactive to chrome
	now=$(date +"%m_%d_%Y")
	$(ZIP) $(CR_ARCHIVE).zip chrome/* $(IGNORE)
	mv $(LOGS_TMP) chrome/$(LOGS_ACT) # move active back in

# Removed archives
clean:
	rm $(CR_ZIP)*
