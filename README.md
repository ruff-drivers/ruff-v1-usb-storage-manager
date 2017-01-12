# USB Storage Manager for Ruff

This package manages all of the block storages with USB interfae.

This package has two parts: one is the storage manager and the other is the driver of storage.

The storage manager supplies the `mount` or `unomut` events when storage is plugged into or unplugged from the system.

The driver of storage supplies some specific functions.

The type of file system of the storage must be `FAT32`.

## Supported Engines

* Ruff: >=1.6.0 <2.0.0

## Installing

Execute following command to install.

```shell
rap install ruff-v1-usb-storage-manager
```

## Usage

Here is the basic usage of this driver.

```js
var fs = require('fs');
var path = require('path');
var StorageManager = require('ruff-v1-usb-storage-manager');
var storageManager = new StorageManager();
$('#usb').install(storageManager);
storageManager.on('mount', function (storage) {
    // storage is mounted

    // save data in the storage
    var filePath = path.join(storage.partitions[0].path, 'test.txt');
    fs.writeFileSync(filePath, 'hello world\n');

    // eject the storage from the system before unplugging the storage
    storage.eject();

    // check whether the storage is successfully ejected
    console.log(storage.ejected);
});

storageManager.on('unmount', function (storage) {
    // storage is unmounted

});
```

## Manager API References

### Methods

#### `StorageManager()`

Exported by this module, it is the constructor method.

### Events

#### `mount`

The `mount` event informs that one usb storage is plugged into the system.

#### `unmount`

The `unmount` event informs that one usb storage is plugged from the system.

## Storage API References

## properties

### `disk`

The storage information, ex.

```js
{
   path: '/dev/sda'
}
```

### `partitions`

The partitions information, ex.

```js
[
    {
       label: 'foo',
       path: '/mnt/sda1'
    },
    {
       label: 'bar',
       path: '/mnt/sda2'
    }
]
```

### `ejected`

Return `true` if all of the partitions of the storage are successfully ejected; otherwise, return `false`.

## methods

### `getPartitionsByLabel(label)`

Return an array that contains the partition object with the matched label.

- **label:** the name, which is a `string`, of partition. The `label` cannot catain any Chinese character.

### `eject()`

Eject the storage from the system, then the storage can be safely unplugged from the board.

## Contributing

Contributions to this project are warmly welcome. But before you open a pull request, please make sure your changes are passing code linting and tests.

You will need the latest [Ruff SDK](https://ruff.io/) to install rap dependencies and then to run tests.

### Installing Dependencies

```sh
npm install
rap install
```

### Running Tests

```sh
npm test
```

## License

The MIT License (MIT)

Copyright (c) 2016 Nanchao Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
