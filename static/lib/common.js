"use strict";
//@ts-ignore
window.sendJSON = function (obj) {
    return { json: JSON.stringify(obj) };
};
