# Daydream Controller
A JS library for using daydream controllers in Javascript!

# How to use
### Get controller api
```js
var controller = new DaydreamController(); // returns Object
```
### Connect to device
```js
controller.connect(); // returns Bool
```
### Disconnect from device
```js
controller.disconnect(); // returns Undefined
```
### Get all info
```js
controller.getInfo(); // returns Object

{
  battery: int,
  model: string,
  serial: string,
  firmware: float,
  hardware: float,
  software: string,
  manufacturer: string,
  pnp_id: string
}
```
### Get battery
```js
controller.getBattery(); // returns Int (0 - 100)
```
### Get model
```js
controller.getModel(); // returns String
```
### Get serial
```js
controller.getSerial(); // returns String
```
### Get firmware revision
```js
controller.getFirmware(); // returns Float
```
### Get hardware revision
```js
controller.getHardware(); // returns Float
```
### Get software revision
```js
controller.getSoftware(); // returns String
```
### Get manufacturer name
```js
controller.getManufacturer(); // returns String
```
### Get PnP ID
```js
controller.getPnPID(); // returns String
```
