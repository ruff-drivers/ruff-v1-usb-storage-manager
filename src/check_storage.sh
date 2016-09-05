#!/bin/sh

file=$2
device="/dev/$1"
root="/mnt/$1"

if [[ ! -e $root ]]; then
    mkdir $root
elif [[ ! -d $root ]]; then
    msg='! $root is occupied by other file'
    echo invalid > $file
    exit 1
fi

blockinfo=$(block info | grep "$device: ")
if [[ ! -n "blockinfo" ]]; then
    msg="! block information not found"
    echo invalid > $file
    exit 1
fi

type=$(echo $blockinfo | awk 'match($0, /TYPE="([^"]*)"/) { print substr($0, RSTART+6, RLENGTH-6-1) }')
if [[ ! -n "$type" ]]; then
    msg="! unable to detect filesystem type for $device"
    echo invalid > $file
    exit 1
fi

version=$(echo $blockinfo | awk 'match($0, /VERSION="([^"]*)"/) { print substr($0, RSTART+9, RLENGTH-9-1) }')
case "$type" in
    "vfat")
        case "$version" in
            "FAT12" | "FAT32")
                msg="~ try to mount -t vfat $device $root"
                mount -t vfat -o iocharset=utf8  $device $root
                # mount -t vfat $device $root
                if [[ $? -eq 0 ]]; then
                    echo $blockinfo > $file
                    exit 0
                fi
                ;;
        esac
        ;;
    *)
       echo invalid > $file
       exit 1
       ;;
esac