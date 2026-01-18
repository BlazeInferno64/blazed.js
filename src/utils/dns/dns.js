// Copyright (c) 2026 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> BlazeInferno64
//
// Last updated: 18/01/2025

"use strict";

const dns = require("dns");
const net = require("net");

const { processError } = require("../errors/errors");

/**
 * 
 * @param {string} hostname - The hostname you want to resolve 
 * @param {string} type - The type/format of ip (eg. IPv4, IPv6)
 * @returns {Promise<any>} - Returns a promise which resolves with the ip data.
 * @example
 * // Demo example
 * const hostname = 'www.google.com';
 * const format = 'IPv4' || 'IPv6';
 * 
 * const result = await lookupForIp(hostname, format);
 * 
 * console.log(result);
 */
const lookupForIp = (hostname, type) => {
    return new Promise((resolve, reject) => {
        const ipObj = {
            Format: "",
            Addresses: []
        };

        if (!type) {
            dns.lookup(hostname, async (err, address) => {
                if (err) return reject({ error: await processError(err, hostname, 'Yes', false, false, false, reject) });
                
                ipObj.Addresses.push(address);
                if (net.isIPv4(address)) ipObj.Format = "IPv4";
                else if (net.isIPv6(address)) ipObj.Format = "IPv6";
                else ipObj.Format = 'Unknown Format';
                
                resolve(ipObj);
            });
            return;
        }

        if (type === 'IPv4') {
            dns.resolve4(hostname, async (err, addresses) => {
                if (err) return reject({ error: await processError(err, hostname, 'Yes', false, false, false, reject) });
                ipObj.Format = 'IPv4';
                ipObj.Addresses = addresses;
                resolve(ipObj);
            });
        } else if (type === "IPv6") {
            dns.resolve6(hostname, async (err, addresses) => {
                if (err) return reject({ error: await processError(err, hostname, 'Yes', false, false, false, reject) });
                ipObj.Format = 'IPv6';
                ipObj.Addresses = addresses;
                resolve(ipObj);
            });
        } else {
            reject({
                error: `Unknown ip address format specified!\nAvailable formats - IPv4, IPv6`
            });
        }
    });
};

/**
 * 
 * @param {String} ip - The ip address for the reverse DNS lookup. 
 * @returns {Promise<String[]>} - Returns a promise with resolved ip hostnames.
 * @example
 * // Demo example
 * const ip = '8.8.8.8';
 * 
 * const result = await reverseLookupForIp(ip);
 * 
 * console.log(result);
 */

const reverseLookupForIp = (ip) => {
    return new Promise((resolve, reject) => {
        if (!net.isIP(ip)) {
            return reject({ input: ip, error: `Not a valid IP format!` });
        }

        dns.reverse(ip, async (err, hostnames) => {
            if (err) return reject({ error: await processError(err, ip, 'Yes', false, false, false, reject) });
            resolve(hostnames);
        });
    });
};

module.exports = {
    lookupForIp,
    reverseLookupForIp
}