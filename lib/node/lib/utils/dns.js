const dns = require("dns");
const net = require("net");

const { processError } = require("./errors");

/**
 * 
 * @param {string} hostname - The hostname you want to resolve 
 * @param {string} type - The type/format of ip (eg. IPv4, IPv6)
 * @returns {Promise<any>} - Returns a promise which resolves with the ip data 
 */
const lookupForIp = async(hostname, type) => {
    return await new Promise(async(resolve, reject) => {
        
        //Define an ip object
        const ipObj = {
            Format: "",
            Addresses: []
        }

        if (!type && typeof type === 'undefined') {
            try {
                return dns.lookup(hostname, async(err, address) => {
                    if (err) return reject({ error: await processError(err, hostname, 'Yes') });
                    ipObj.Addresses.push(address);
                    if (net.isIPv4(address)) {
                        ipObj.Format = "IPv4";
                        return resolve(ipObj);
                    }
                    else if (net.isIPv6(address)) {
                        ipObj.Format = "IPv6";
                        return resolve(ipObj);
                    }
                    else {
                        ipObj.Format = 'Unknown Format';
                        return resolve(ipObj);
                    }
                })
            } catch (error) {
                return reject(await processError(error, hostname, 'Yes'));
            }
        }
        else if (type !== '' && typeof type !== 'undefined') {
            if (type === 'IPv4') {
                try {
                    return dns.resolve4(hostname, async(err, addresses) => {
                        if (err) return reject({ error: await processError(err, hostname, 'Yes') });
                        ipObj.Format = 'IPv4';
                        ipObj.Addresses = addresses;
                        return resolve(ipObj);
                    })
                } catch (error) {
                    return reject(await processError(error, hostname, 'Yes'));
                }
            } else if (type === "IPv6") {
                try {
                    return dns.resolve6(hostname, async(err, addresses) => {
                        if (err) return reject({ error: await processError(err, hostname, 'Yes') });
                        ipObj.Format = 'IPv6';
                        ipObj.Addresses = addresses;
                        return resolve(ipObj);
                    })
                } catch (error) {
                    return reject(await processError(error, hostname, 'Yes'));
                }
            } else {
                return reject(`Unknown ip address format specified!\nAvailable formats - IPv4, IPv6`);
            }
        }
    })
}

module.exports = {
    lookupForIp
}