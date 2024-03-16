/**
 * @author mrdoob / http://mrdoob.com/
 * @author crazyh2 / http://github.com/crazyh2
 */

class DaydreamController {
  constructor() {
    this.connected = false;
    
    return {
      getInfo: this.getInfo,
      getBattery: this.getBattery,
      getModel: this.getModel,
      getSerial: this.getSerial,
      getFirmware: this.getFirmware,
      getHardware: this.getHardware,
      getSoftware: this.getSoftware,
      getManufacturer: this.getManufacturer,
      getPnPID: this.getPnPID,
  		connect: this.connect,
      disconnect: this.disconnect,
      onChange: function ( callback ) {
        this.onChangeFunc = callback;
      }
    };
  };

  connect() {
  		return navigator.bluetooth.requestDevice( {
  			filters: [ {
  				name: 'Daydream controller'
  			} ],
  			optionalServices: [ 0xfe55 ]
  		} )
  		.then( function ( device ) {
  			return device.gatt.connect();
  		} )
  		.then( function ( server ) {
  			return server.getPrimaryService( 0xfe55 );
  		} )
  		.then( function ( service ) {
  			return service.getCharacteristic( '00000001-1000-1000-8000-00805f9b34fb' );
  		} )
  		.then( function ( characteristic ) {
  			characteristic.addEventListener( 'characteristicvaluechanged', this.handleData );
  			return characteristic.startNotifications();
  		} )
  
  };

  handleData(event) {
  		var data = event.target.value;
  
  		// http://stackoverflow.com/questions/40730809/use-daydream-controller-on-hololens-or-outside-daydream/40753551#40753551
  
  		this.isClickDown = (data.getUint8(18) & 0x1) > 0;
  		this.isAppDown = (data.getUint8(18) & 0x4) > 0;
  		this.isHomeDown = (data.getUint8(18) & 0x2) > 0;
  		this.isVolPlusDown = (data.getUint8(18) & 0x10) > 0;
  		this.isVolMinusDown = (data.getUint8(18) & 0x8) > 0;
  
  		this.time = ((data.getUint8(0) & 0xFF) << 1 | (data.getUint8(1) & 0x80) >> 7);
  
  		this.seq = (data.getUint8(1) & 0x7C) >> 2;
  
  		this.xOri = (data.getUint8(1) & 0x03) << 11 | (data.getUint8(2) & 0xFF) << 3 | (data.getUint8(3) & 0x80) >> 5;
  		this.xOri = (this.xOri << 19) >> 19;
  		this.xOri *= (2 * Math.PI / 4095.0);
  
  		this.yOri = (data.getUint8(3) & 0x1F) << 8 | (data.getUint8(4) & 0xFF);
  		this.yOri = (this.yOri << 19) >> 19;
  		this.yOri *= (2 * Math.PI / 4095.0);
  
  		this.zOri = (data.getUint8(5) & 0xFF) << 5 | (data.getUint8(6) & 0xF8) >> 3;
  		this.zOri = (this.zOri << 19) >> 19;
  		this.zOri *= (2 * Math.PI / 4095.0);
  
  		this.xAcc = (data.getUint8(6) & 0x07) << 10 | (data.getUint8(7) & 0xFF) << 2 | (data.getUint8(8) & 0xC0) >> 6;
  		this.xAcc = (this.xAcc << 19) >> 19;
  		this.xAcc *= (8 * 9.8 / 4095.0);
  
  		this.yAcc = (data.getUint8(8) & 0x3F) << 7 | (data.getUint8(9) & 0xFE) >>> 1;
  		this.yAcc = (this.yAcc << 19) >> 19;
  		this.yAcc *= (8 * 9.8 / 4095.0);
  
  		this.zAcc = (data.getUint8(9) & 0x01) << 12 | (data.getUint8(10) & 0xFF) << 4 | (data.getUint8(11) & 0xF0) >> 4;
  		this.zAcc = (this.zAcc << 19) >> 19;
  		this.zAcc *= (8 * 9.8 / 4095.0);
  
  		this.xGyro = ((data.getUint8(11) & 0x0F) << 9 | (data.getUint8(12) & 0xFF) << 1 | (data.getUint8(13) & 0x80) >> 7);
  		this.xGyro = (this.xGyro << 19) >> 19;
  		this.xGyro *= (2048 / 180 * Math.PI / 4095.0);
  
  		this.yGyro = ((data.getUint8(13) & 0x7F) << 6 | (data.getUint8(14) & 0xFC) >> 2);
  		this.yGyro = (this.yGyro << 19) >> 19;
  		this.yGyro *= (2048 / 180 * Math.PI / 4095.0);
  
  		this.zGyro = ((data.getUint8(14) & 0x03) << 11 | (data.getUint8(15) & 0xFF) << 3 | (data.getUint8(16) & 0xE0) >> 5);
  		this.zGyro = (this.zGyro << 19) >> 19;
  		this.zGyro *= (2048 / 180 * Math.PI / 4095.0);
  
  		this.xTouch = ((data.getUint8(16) & 0x1F) << 3 | (data.getUint8(17) & 0xE0) >> 5) / 255.0;
  		this.yTouch = ((data.getUint8(17) & 0x1F) << 3 | (data.getUint8(18) & 0xE0) >> 5) / 255.0;
  
  		this.onChangeFunc( this );
  };
};
