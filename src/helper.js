/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var mdelay = require('ruff-driver').mdelay;

var RESULT_FILE = 'result_file';
var SCRIPT_NAME = 'check_storage.sh';

function getMatchedFolders(path, folderRegExp) {
    var targetFolders = [];

    try {
        fs.statSync(path);
    } catch (error) {
        return null;
    }

    var items = fs.readdirSync(path);
    items.forEach(function (item) {
        if (folderRegExp.exec(item) !== null) {
            targetFolders.push(item);
        }
    });
    return targetFolders.length ? targetFolders : null;
}
exports.getMatchedFolders = getMatchedFolders;

function getBlockDevname(devPath) {
    var hostxFolder = getMatchedFolders(devPath, /host[0-9]+/);
    if (hostxFolder === null) {
        return null;
    }

    var hostxPath = path.join(devPath, hostxFolder[0]);
    mdelay(800);
    var targetxFolder = getMatchedFolders(hostxPath, /target.*/);
    if (targetxFolder === null) {
        return null;
    }

    var targetSubFolderPrefix = targetxFolder[0].match(/target(.*)/)[1];
    var targetxPath = path.join(hostxPath, targetxFolder[0]);
    var targetSubFolders = getMatchedFolders(
        targetxPath,
        new RegExp(targetSubFolderPrefix + '.*')
    );
    if (targetSubFolders === null) {
        return null;
    }

    var blockFolderExisted = false;
    var targetSubFolder;
    for (var i = 0; i < targetSubFolders.length; i++) {
        var blockFolder = getMatchedFolders(path.join(targetxPath, targetSubFolders[i]), /block/);
        if (blockFolder !== null) {
            targetSubFolder = targetSubFolders[i];
            blockFolderExisted = true;
            break;
        }
    }
    if (!blockFolderExisted) {
        return null;
    }

    var blockPath = path.join(targetxPath, targetSubFolder, 'block');
    var diskFolder = getMatchedFolders(blockPath, /.d[a-z]+/);
    if (diskFolder === null) {
        return null;
    }
    var blockDevInfo = {};
    blockDevInfo.disk = diskFolder[0];
    var partitionFolders = getMatchedFolders(
        path.join(blockPath, blockDevInfo.disk),
        new RegExp(blockDevInfo.disk + '[0-9]+')
    );
    blockDevInfo.partitions = partitionFolders;
    return blockDevInfo;
}
exports.getBlockDevname = getBlockDevname;

function getPartitionsInfo(partitions) {
    var resultFile = path.join(__dirname, RESULT_FILE);
    var scriptFile = path.join(__dirname, SCRIPT_NAME);
    var partitionsInfo = [];

    partitions.forEach(function (partition) {
        uv.exec_sync('/bin/sh', [scriptFile, partition, resultFile]);
        var partitionInfo = fs.readFileSync(resultFile).toString();
        var info = parsePartitionInfo(partitionInfo);
        if (info) {
            partitionsInfo.push(info);
        }
    });
    return partitionsInfo;
}
exports.getPartitionsInfo = getPartitionsInfo;

function parsePartitionInfo(partitionInfo) {
    var re = /(\/dev\/.d.+):.*"\sTYPE="(.*?)"/g;
    var fields = re.exec(partitionInfo);
    if (!fields) {
        return null;
    }
    var device = fields[1];
    var labelInfo = /LABEL="(.*?)"/g.exec(partitionInfo);
    var pathInfo = path.join('/mnt', path.basename(device));
    return {
        label: labelInfo ? labelInfo[1] : null,
        path: pathInfo
    };
}
exports.parsePartitionInfo = parsePartitionInfo;

function getAvailableStorage(devPath) {
    var blockDevInfo = getBlockDevname(devPath);
    if (blockDevInfo === null) {
        return null;
    }
    var partitionsInfo = getPartitionsInfo(blockDevInfo.partitions);
    if (!partitionsInfo.length) {
        return null;
    }
    return {
        disk: {
            path: '/dev/' + blockDevInfo.disk
        },
        partitions: partitionsInfo
    };
}
exports.getAvailableStorage = getAvailableStorage;
