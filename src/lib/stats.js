const oss = require("node-os-utils");
const os = require("os");

const units = ['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
function bytesConvert(x){
    let l = 0, n = parseInt(x, 10) || 0;

    while(n >= 1024 && ++l){
        n = n/1024;
    }
    
    return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

module.exports = class StatsManager {
    
    constructor(){
        this.net = null;
        this.cpu = null;

        this.interval = setInterval(() => {
            this.update();
        }, 10000);

        this.update();
    }

    async update(){
        const net = await oss.netstat.inOut();
        if(typeof net === "string"){
            this.net = {
                input: '0 bytes',
                output: '0 bytes'
            }
        }else{
            this.net = {
                input: bytesConvert(net.total.inputMb*1024*1024),
                output: bytesConvert(net.total.outputMb*1024*1024)
            }
        }
    }

    async get(){

        if(!this.net) await this.update();

        let memFree = os.freemem();
        let memTotal = os.totalmem();
        let memUsage = memTotal - memFree;

        return {
            system: {
                type: await oss.os.type()
            },
            memory: {
                free: bytesConvert(memFree),
                total: bytesConvert(memTotal),
                usage: bytesConvert(memUsage),
                percent: (100*(memUsage/memTotal)).toFixed(1)
            },
            net: this.net,
            cpu: {
                count: oss.cpu.count()
            }
        }

    }
    
}