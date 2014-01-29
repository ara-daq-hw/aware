#!/usr/bin/python

import sys, getopt
import gzip
import json
import time
from pprint import pprint

def main(argv):
    
    if(len(argv)<2):
        print 'getStartTime.py -i <inputfile> '
        sys.exit()   
    
    inputfilename='' 

    try:
       opts, args = getopt.getopt(argv,"hi:",["ifile="])
    except getopt.GetoptError:
       print 'getStartTime.py -r -i <inputfile>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'getStartTime.py -i <inputfile>'
            sys.exit()
        elif opt in ("-i", "--ifile"):
            inputfilename = arg
    print 'Input file is "', inputfilename


    # reading
    
    gCal = gzip.GzipFile(inputfilename)
    jCal = json.load(gCal)
    gCal.close()
    
    timeString=jCal["timeSum"]["startTime"]
#2014-01-27 22:30:00
    ts = time.mktime(time.strptime(timeString, '%Y-%m-%d %H:%M:%S'))
    print ts
    
  #  print len(jRaw["full"]["timeList"])
 #   print len(jCal["full"]["timeList"])
    
if __name__ == "__main__":
    main(sys.argv[1:])
