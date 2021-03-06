#!/usr/bin/python

import glob
import os
import sys, getopt
import gzip
import json

def main(argv):
    awareDir=os.getenv('AWARE_OUTPUT_DIR', "/unix/ara/data/aware/output/")

    instrument='ARA03'
    run='6000'
    fileType='eventHk'

    try:
       opts, args = getopt.getopt(argv,"hr:i:f:",["run=","instrument=","filetype="])
    except getopt.GetoptError:
       print 'fixEventRateFull.py -r <run> -i <instrument> -f <file type>'
       sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print 'fixEventRateFull.py -r <run> -i <instrument>'
            sys.exit()
        elif opt in ("-i", "--instrument"):
            instrument = arg
        elif opt in ("-f", "--fileType"):
            fileType = arg
        elif opt in ("-r", "--run"):
            run = arg
    print 'Run is ', run
    print 'Instrument ', instrument
    roundRun=(int(run)//100)*100
    baseRun=(int(run)//10000)*10000

    runDir=awareDir+"/"+instrument+"/runs"+str(baseRun)+"/runs"+str(roundRun)+"/run"+run
    if not os.path.isdir(runDir):
        print "Directory does not exist"
        print runDir
        sys.exit(2)

    
    singleFullName=runDir+'/'+fileType+'_full.json.gz'
    print "Making "+singleFullName
#    print runDir
    fullFileList=glob.glob(runDir+'/full/'+fileType+"_*")
#    print fullFileList
    

    #Create the output dictionary
    jList=[]
    jOut = dict()
    
    for inFile in fullFileList:
        gFull = gzip.GzipFile(inFile)
        jFull = json.load(gFull)
        gFull.close()
        if "name" in jFull["full"] :
#            print jFull["full"]["name"]
#            print len(jFull["full"]["timeList"])
            jDict=dict()
            jDict[jFull["full"]["name"]]=jFull["full"]
            jList.append(jDict)
            jOut.update(jDict)
        else:
 #           print "Got time"
            jDict=dict()
            jFull["full"]["name"]="time"
            jDict["time"]=jFull["full"]
            
            jList.append(jDict)
            jOut.update(jDict)
            

#    print len(jList)

#    jOut=jList[0]
#    for item in jList:
#        if "name" in item:
#            jOut[item["name"]]=item
    

    
    outJson=json.dumps(jOut,sort_keys=True,
                       indent=1)
#    print outJson
    outFile = gzip.open(singleFullName,'w')
    outFile.write(outJson)
    outFile.close()
    sys.exit(0);

    # 
        
if __name__ == "__main__":
    main(sys.argv[1:])
