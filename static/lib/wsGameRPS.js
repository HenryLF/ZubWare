"use strict";
var RPSServerCode;
(function (RPSServerCode) {
    RPSServerCode[RPSServerCode["ConnClose"] = 0] = "ConnClose";
    RPSServerCode[RPSServerCode["ConnOpen"] = 1] = "ConnOpen";
    RPSServerCode[RPSServerCode["EnterPool"] = 2] = "EnterPool";
    RPSServerCode[RPSServerCode["EnterLobby"] = 4] = "EnterLobby";
    RPSServerCode[RPSServerCode["GameInfo"] = 5] = "GameInfo";
    RPSServerCode[RPSServerCode["GameResult"] = 6] = "GameResult";
})(RPSServerCode || (RPSServerCode = {}));
var RPSClientCode;
(function (RPSClientCode) {
    RPSClientCode[RPSClientCode["ConnClose"] = 0] = "ConnClose";
    RPSClientCode[RPSClientCode["Registering"] = 1] = "Registering";
    RPSClientCode[RPSClientCode["Play"] = 2] = "Play";
})(RPSClientCode || (RPSClientCode = {}));
var RPSPlayCode;
(function (RPSPlayCode) {
    RPSPlayCode[RPSPlayCode["ROCK"] = 0] = "ROCK";
    RPSPlayCode[RPSPlayCode["PAPER"] = 1] = "PAPER";
    RPSPlayCode[RPSPlayCode["SCISSORS"] = 2] = "SCISSORS";
})(RPSPlayCode || (RPSPlayCode = {}));
