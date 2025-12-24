// Copyright (c) 2025 BlazeInferno64 --> https://github.com/blazeinferno64.
//
// Author(s) -> 
// 1. BlazeInferno64 -> https://github.com/blazeinferno64
//
// Last updated: 24/12/2025

"use strict";

//const CANCELED = Symbol('BLZ_CANCELED');

class BlazedCancelError extends Error {
    constructor(options) {
        let message = 'The request was canceled';
        if (options && options.url && options.method) {
            message = `The HTTP '${options.method}' request to ${options.url} was canceled!`;
        }
        super(message);
        this.name = 'HTTP_Request_Cancel_Error';
        this.reason = options && options.reason ? options.reason : null;
        this.code = 'ERR_CANCELED';
    }
}


module.exports = {
    BlazedCancelError
};