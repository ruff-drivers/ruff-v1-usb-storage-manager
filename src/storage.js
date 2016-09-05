'use strict';

var async = require('ruff-async');
var spawn = require('child_process').spawn;

function Storage(blockInfo) {
    this._blockInfo = blockInfo;
}

Object.defineProperties(Storage.prototype, {
    disk: {
        get: function () {
            return this._blockInfo.disk;
        }
    },
    partitions: {
        get: function () {
            return this._blockInfo.partitions;
        }
    }

});

Storage.prototype.getPartitionsByLabel = function (label) {
    if (!label) {
        return [];
    }
    var partitions = [];
    var keyOfPartitions = Object.keys(this._blockInfo.partitions);
    for (var i = 0; i < keyOfPartitions.length; i++) {
        var current = this._blockInfo.partitions[keyOfPartitions[i]];
        if (current.label === label) {
            partitions.push(current.path);
        }
    }
    return partitions;
};

Storage.prototype.eject = function (callback) {
    var ejectPartitions = this._blockInfo.partitions.map(function (partition) {
        return ejectPartition.bind(null, partition.path);
    });
    async.series(ejectPartitions, callback);
};

function ejectPartition(path, callback) {
    var eject = spawn('umount', [path]);
    eject.on('exit', function (code) {
        if (code === 0) {
            callback && callback();
        } else {
            callback && callback(new Error('Cannot eject the partition which path is', path));
        }
    });
}

module.exports = Storage;
