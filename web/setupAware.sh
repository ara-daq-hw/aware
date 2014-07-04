#!/bin/bash

if [[ $1 = "" ]]; then
    echo "`basename $0` <config name>"
    echo "e.g. `basename $0` ARA"    
    exit 1
fi


if [ -d "config/$1" ]; then
    echo "Found config/$1"
    rm -f index.php
    ln -sf config/$1/index.php
    echo "Linking to config/$1/index.php"

    rm -f config/defaultValues.ini
    rm -f config/instrumentList.ini
    cd config
    ln -sf $1/defaultValues.ini
    ln -sf $1/instrumentList.ini
    echo "Linking to  $1/defaultValues.ini"
    echo "Linking to $1/instrumentList.ini"

    cd ../styles
    ln -sf $1.css local.css
    echo "Linking styles/$1.css to styles/local.css"
    
fi


