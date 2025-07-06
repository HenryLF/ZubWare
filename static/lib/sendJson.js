"use strict";
//@ts-ignore
window.sendJSON = function (payload) {
    return {
        json: JSON.stringify(payload)
    };
};
