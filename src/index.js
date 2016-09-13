/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var kernelModule = require('kernel-module');
var usbManager = require('usb-manager');
var Storage = require('./storage');
var getAvailableStorage = require('./helper').getAvailableStorage;

var STORAGE_DRIVERS = ['nls_cp437', 'nls_utf8', 'vfat', 'sd_mod', 'usb-storage'];

module.exports = usbManager({
    attach: function (callback) {
        try {
            STORAGE_DRIVERS.forEach(function (driver) {
                kernelModule.install(driver);
            });
            callback && callback();
        } catch (error) {
            callback && callback(error);
        }
    },
    detach: function (callback) {
        try {
            STORAGE_DRIVERS.forEach(function (driver) {
                kernelModule.remove(driver);
            });
            callback && callback();
        } catch (error) {
            callback && callback(error);
        }
    },
    createDevice: function (devPath) {
        var devInfo = getAvailableStorage(devPath);
        if (devInfo) {
            return new Storage(devInfo);
        }
        return null;
    },
    cleanupDevice: function (storage) {
        storage.eject();
    }
});
