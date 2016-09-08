# USB Storage Manager for Ruff

This package manager all of the block storage with USB interfae.

This package has two parts: one is the storage manager and the other is the driver of storage.

The storage manager supplies the `mount` or `unomut` events when storage is plugged into or unplugged from the system.

The driver of storage supplies some specific functions.

## Supported Engines

* Ruff: >=1.5.0 <1.6.0

## Installing

Execute following command to install.
```shell
rap install ruff-v1-usb-storage-manager
```

## Usage

Here is the basic usage of this driver.

```js
var StorageManager = require('ruff-v1-usb-storage-manager');
var storageManager = new StorageManager();
$('#usb').install(storageManager);
storageManager.on('mount', function (storage) {
    // storage is mounted
});

storageManager.on('unmount', function (storage) {
    // storage is unmounted
});
```

## Manager API References

### Methods

#### `StorageManager()`

Exported by this module, it is the constructor method.

#### `attach([callback])`

This method is defined by the framework of usb device manager.

It is invoked by usb to install the storage driver.

- **callback:** No argument other than a possible error is given to the completion callback. It is optional.

#### `detach([callback])`

This method is defined by the framework of usb device manager.

It is invoked by usb to uninstall the storage driver.

- **callback:** No argument other than a possible error is given to the completion callback. It is optional.

#### `createDevice(devPath)`

This method is defined by the framework of usb device manager.

It is invoked by usb when one usb device is plugged into the system.

If the `devPath` does not belong to usb storages, this method returns `null`, otherwise returns the instance of storage.

- **devPath:** The mounted path of usb device in the system.

#### `cleanupDevice(device)`

This method is defined by the framework of usb device manager.

It is invoked by usb device manager and used to do some cleanup work when one usb device is unplugged from the system.

- **device:** The device object which is unplugged from the system.

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

## methods

### `getPartitionsByLabel(label)`

Return an array that contains the partition object with the matched label.

- **label:** the name, which is a `string`, of partition. The `label` cannot catain any chinese character.

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
