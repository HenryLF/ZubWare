//@ts-ignore
window.sendJSON = function(payload : object){
    return {
        json : JSON.stringify(payload)
    }
}