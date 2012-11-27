#############################################################################
## Makefile -- New Version of my Makefile that works on both linux
##              and mac os x
## Ryan Nichol <rjn@hep.ucl.ac.uk>
##############################################################################
include Makefile.arch

SRCSUF=cxx


LD_ARA_UTIL=-L$(ARA_UTIL_INSTALL_DIR)/lib  -lAraEvent
INC_ARA_UTIL=-I$(ARA_UTIL_INSTALL_DIR)/include


#Generic and Site Specific Flags
CXXFLAGS     += $(ROOTCFLAGS) $(FFTFLAG) $(SYSINCLUDES) $(INC_ARA_UTIL)
LDFLAGS      += -g $(ROOTLDFLAGS) 

LIBS          = $(ROOTLIBS)  -lMinuit $(SYSLIBS) $(LD_ARA_UTIL) $(FFTLIBS) 
GLIBS         = $(ROOTGLIBS) $(SYSLIBS)


PROGRAM =   makeEventXmlFile

all : $(PROGRAM)



% :  %.$(SRCSUF)
	@echo "<**Linking**> "  
	$(LD)  $(CXXFLAGS) $(LDFLAGS) $< tinyxml2.cpp $(LIBS) -o $@



clean:
	@rm -f *Dict*
	@rm -f *.${OBJSUF}
	@rm -f $(PROGRAM)

