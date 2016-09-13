/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var assert = require('assert');

var Storage = require('../src/storage');

require('t');

describe('Test for `Storage`', function () {
    it('should get disk information of storage', function () {
        var blockInfo = {
            disk: {
                path: '/dev/sda'
            },
            partitions: [
                {
                    label: 'foo',
                    path: '/dev/sda1'
                },
                {
                    label: 'bar',
                    path: 'dev/sda2'
                }
            ]
        };
        var storage = new Storage(blockInfo);
        assert.deepEqual(storage.disk, blockInfo.disk);
    });

    it('should get partitions information of storage', function () {
        var blockInfo = {
            disk: {
                path: '/dev/sda'
            },
            partitions: [
                {
                    label: 'foo',
                    path: '/mnt/sda1'
                },
                {
                    label: 'bar',
                    path: 'mnt/sda2'
                }
            ]
        };
        var storage = new Storage(blockInfo);
        assert.deepEqual(storage.partitions, blockInfo.partitions);
    });

    it('should get mathced partitions information of storage', function () {
        var blockInfo = {
            disk: {
                path: '/dev/sda'
            },
            partitions: [
                {
                    label: 'foo',
                    path: '/mnt/sda1'
                },
                {
                    label: 'bar',
                    path: '/mnt/sda2'
                },
                {
                    label: 'foo',
                    path: '/mnt/sda3'
                }
            ]
        };
        var storage = new Storage(blockInfo);
        var expectedInfo = [
            {
                label: 'bar',
                path: '/mnt/sda2'
            }
        ];
        var matchedInfo = storage.getPartitionsByLabel('bar');
        assert.deepEqual(matchedInfo, expectedInfo);

        expectedInfo = [
            {
                label: 'foo',
                path: '/mnt/sda1'
            },
            {
                label: 'foo',
                path: '/mnt/sda3'
            }
        ];
        matchedInfo = storage.getPartitionsByLabel('foo');
        assert.deepEqual(matchedInfo, expectedInfo);

        expectedInfo = [];
        matchedInfo = storage.getPartitionsByLabel('biu');
        assert.deepEqual(matchedInfo, expectedInfo);
    });
});
