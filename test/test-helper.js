'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var getMatchedFolders = require('../src/helper').getMatchedFolders;

require('t');

describe('Test for `getMatchedFolders` method', function () {
    var dirs1 = ['foo', 'bar'];
    var dirs2 = ['test1', 'test2'];

    before(function () {
        dirs1.forEach(function (dir1) {
            fs.mkdirSync(path.join(__dirname, dir1));
            dirs2.forEach(function (dir2) {
                fs.mkdirSync(path.join(__dirname, dir1, dir2));
            });
        });
    });

    after(function () {
        dirs1.forEach(function (dir1) {
            dirs2.forEach(function (dir2) {
                fs.rmdirSync(path.join(__dirname, dir1, dir2));
            });
            fs.rmdirSync(path.join(__dirname, dir1));
        });
    });

    it('should return null when no matched fold existed', function (done) {
        var matchedFolders = getMatchedFolders(__dirname, /abc/);
        assert.equal(matchedFolders, null);
        done();
    });

    it('should return matched folders', function (done) {
        var matchedFolders = getMatchedFolders(__dirname, /foo/);
        assert(matchedFolders.length === 1 && matchedFolders[0] === 'foo');

        matchedFolders = getMatchedFolders(__dirname, /bar/);
        assert(matchedFolders.length === 1 && matchedFolders[0] === 'bar');

        done();
    });
});

var getBlockDevname = require('../src/helper').getBlockDevname;
describe('Test for `getBlockDevname` method', function () {
    var dirs1 = ['abc', 'xyz'];
    var dirs2 = ['host1', 'host2'];
    var dirs3 = ['target1:0', 'target2:0'];
    var dirs4 = ['1:0', '2:0'];
    var dirs5 = ['block'];
    var dirs6 = ['sda'];
    var dirs7 = ['sda1', 'sda2', 'sda3'];

    before(function () {
        dirs1.forEach(function (dir1) {
            fs.mkdirSync(path.join(__dirname, dir1));
            dirs2.forEach(function (dir2) {
                fs.mkdirSync(path.join(__dirname, dir1, dir2));
                dirs3.forEach(function (dir3) {
                    fs.mkdirSync(path.join(__dirname, dir1, dir2, dir3));
                    dirs4.forEach(function (dir4) {
                        fs.mkdirSync(path.join(__dirname, dir1, dir2, dir3, dir4));
                    });
                });
            });
        });

        fs.mkdirSync(path.join(__dirname, dirs1[0], dirs2[0], dirs3[0], dirs4[0], dirs5[0]));
        fs.mkdirSync(path.join(__dirname, dirs1[0], dirs2[0], dirs3[0], dirs4[0], dirs5[0], dirs6[0]));
        dirs7.forEach(function (dir7) {
            fs.mkdirSync(path.join(__dirname, dirs1[0], dirs2[0], dirs3[0], dirs4[0], dirs5[0], dirs6[0], dir7));
        });
    });

    after(function () {
        dirs7.forEach(function (dir7) {
            fs.rmdirSync(path.join(__dirname, dirs1[0], dirs2[0], dirs3[0], dirs4[0], dirs5[0], dirs6[0], dir7));
        });
        fs.rmdirSync(path.join(__dirname, dirs1[0], dirs2[0], dirs3[0], dirs4[0], dirs5[0], dirs6[0]));
        fs.rmdirSync(path.join(__dirname, dirs1[0], dirs2[0], dirs3[0], dirs4[0], dirs5[0]));

        dirs1.forEach(function (dir1) {
            dirs2.forEach(function (dir2) {
                dirs3.forEach(function (dir3) {
                    dirs4.forEach(function (dir4) {
                        fs.rmdirSync(path.join(__dirname, dir1, dir2, dir3, dir4));
                    });
                    fs.rmdirSync(path.join(__dirname, dir1, dir2, dir3));
                });
                fs.rmdirSync(path.join(__dirname, dir1, dir2));
            });
            fs.rmdirSync(path.join(__dirname, dir1));
        });
    });

    it('should return expected block when path is valid', function (done) {
        var block = getBlockDevname(path.join(__dirname, 'abc'));
        assert.deepEqual(dirs6[0], block.disk);
        assert.deepEqual(dirs7, block.partitions);
        done();
    });

    it('should return null when path is invalid', function (done) {
        var block = getBlockDevname(path.join(__dirname, 'xyz'));
        assert.equal(block, null);
        done();
    });
});

var parsePartitionInfo = require('../src/helper').parsePartitionInfo;
describe('Test for `parsePartitionInfo` method', function () {
    it('should return expected partition info', function (done) {
        var partitionInfo = '/dev/sda1: UUID="a822-83fe" LABEL="DISK" VERSION="FAT32" TYPE="vfat"';
        var partition = parsePartitionInfo(partitionInfo);
        assert.deepEqual(partition, {
            label: 'DISK',
            path: '/mnt/sda1'
        });

        partitionInfo = '/dev/sda1: UUID="a822-83fe" VERSION="FAT32" TYPE="vfat"';
        partition = parsePartitionInfo(partitionInfo);
        assert.deepEqual(partition, {
            label: null,
            path: '/mnt/sda1'
        });

        done();
    });
});
