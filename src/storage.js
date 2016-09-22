/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

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
    ejected: {
        get: function () {
            return !this._partionsState.some(function (state) {
                return state.removed === false;
            });
        }
    }
});

Storage.prototype.getPartitionsByLabel = function (label) {
    if (!label) {
        return [];
    }

    return this._blockInfo.partitions.filter(function (partition) {
        return partition.label === label;
    });
};

Storage.prototype.eject = function () {
    this._updatePartionsState();
    this._unmountPartitions();
    this._removeMountPoints();
};

Storage.prototype._updatePartionsState = function () {
    for (var i = 0; i < this._blockInfo.partitions.length; i++) {
        this._partionsState[i].unmounted = checkPartitionUnmounted(this._blockInfo.partitions[i].path);
    }
};

Storage.prototype._unmountPartitions = function () {
    for (var i = 0; i < this._blockInfo.partitions.length; i++) {
        var path = this._blockInfo.partitions[i].path;
        if (!this._partionsState[i].unmounted) {
            var res = uv.exec_sync('/bin/umount', [path]);
            if (res) {
                throw new Error('Cannot umount ' + path + ': Device or resource busy');
            }
        }
        this._partionsState[i].unmounted = true;
    }
};

Storage.prototype._removeMountPoints = function () {
    for (var i = 0; i < this._blockInfo.partitions.length; i++) {
        var path = this._blockInfo.partitions[i].path;
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

function checkPartitionUnmounted(mountedPath) {
    var res = uv.exec_sync('/bin/sh', ['-c', '/bin/df | /bin/grep ' + mountedPath]);
    return !!res;
}

module.exports = Storage;
