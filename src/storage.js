'use strict';

var fs = require('fs');

function Storage(blockInfo) {
    this._blockInfo = blockInfo;
    this._partionsState = blockInfo.partitions.map(function () {
        return {
            unmounted: false,
            removed: false
        };
    });
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
    },
    isEjected: {
        get: function () {
            var res = true;
            for (var i = 0; i < this._blockInfo.partitions.length; i++) {
                res = res && this._partionsState[i].removed;
            }
            return res;
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
            partitions.push(current);
        }
    }
    return partitions;
};

Storage.prototype.eject = function () {
    this._unmountPartitions();
    this._removeMountPoints(true);
};

Storage.prototype._unmountPartitions = function () {
    for (var i = 0; i < this._blockInfo.partitions.length; i++) {
        var path = this._blockInfo.partitions[i].path;
        if (!this._partionsState[i].unmounted) {
            var res = uv.exec_sync('/bin/umount', [path]);
            if (res) {
                throw new Error('Cannot umount ' + path + ': Device or resource busy');
            } else {
                this._partionsState[i].unmounted = true;
            }
        }
    }
};

Storage.prototype._removeMountPoints = function (checkUnmountState) {
    for (var i = 0; i < this._blockInfo.partitions.length; i++) {
        var path = this._blockInfo.partitions[i].path;
        if (checkUnmountState) {
            if (!this._partionsState[i].unmounted) {
                throw new Error('The partition ' + path + ' is not ejected, please eject first');
            }
        }

        if (!this._partionsState[i].removed) {
            try {
                fs.rmdirSync(path);
                this._partionsState[i].removed = true;
                this._partionsState[i].unmounted = true;
            } catch (error) {
                throw error;
            }
        }
    }
};

Storage.prototype.cleanup = function () {
    this._removeMountPoints(false);
};

module.exports = Storage;
