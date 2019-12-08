/*
 * HTU21D Service
 *
 * By: A.G.
 * Created: 2019.12.08
 * Last modified: 2019.12.08
 */

import * as I2CBusModule from "i2c-bus";

const openPromisified = I2CBusModule.default.openPromisified;
const HTU21D_ADDR = 0x40;

(async () => {
    try {
        const bus = await openPromisified(1);
        await bus.i2cWrite(HTU21D_ADDR, 1, Buffer.from([0xF3]));
        setTimeout(readTemperature, 50, bus);
    } catch (e) {
        console.error(e);
        console.log(`Exiting...`);
    }
})();

function
readTemperature(bus) {
    let buf = Buffer.alloc(2);
    bus.i2cRead(HTU21D_ADDR, buf.length, buf).then(() => {
        let rawData = (buf[0] << 8) | buf[1];
        let hex = `000${rawData.toString(16)}`.slice(-4).toUpperCase();
        console.log(`Raw data:`, rawData, `(hex: 0x${hex})`);
        let t = -46.85 + 175.72*(rawData)/65535;
        console.log(`Temp: ${t.toFixed(1)} C`)
    }).catch((e) => console.error);
}
