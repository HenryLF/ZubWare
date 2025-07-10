(function(g,f){if(typeof define=="function"&&define.amd){define(f)}else if(typeof exports=="object" && typeof module<"u"){module.exports=f()}else{var m=f();for(var i in m) g[i]=m[i]}}(typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : this,function(){var exports={};var __exports=exports;var module={exports};
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __pow = Math.pow;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ts/calculator.ts
var calculator_exports = {};
__export(calculator_exports, {
  clearResult: () => clearResult,
  eraseLast: () => eraseLast,
  setPrecision: () => setPrecision,
  typeBinary: () => typeBinary,
  typeDot: () => typeDot,
  typeNumber: () => typeNumber,
  typeResult: () => typeResult,
  typeUnary: () => typeUnary
});
module.exports = __toCommonJS(calculator_exports);
var state = { leftHand: "", rightHand: "" };
var precision = 3;
function stateString() {
  let out = "";
  state.leftHand && (out = out + state.leftHand);
  state.operand && (out = out + state.operand);
  state.rightHand && (out = out + state.rightHand);
  return out;
}
function updateResult() {
  dispatchEvent(new CustomEvent("update-result", { detail: stateString() }));
}
function roundAndString(k) {
  return (Math.round(k * __pow(10, precision)) / __pow(10, precision)).toString();
}
function processResult() {
  let l = parseFloat(state.leftHand);
  let r = parseFloat(state.rightHand);
  let res;
  switch (state.operand) {
    case "+" /* Add */:
      res = l + r;
      break;
    case "-" /* Sub */:
      res = l - r;
      break;
    case "/" /* Div */:
      res = l / r;
      break;
    case "*" /* Mul */:
      res = l * r;
      break;
    case "^" /* Pow */:
      res = Math.pow(l, r);
      break;
    default:
      res = l;
  }
  if (isNaN(res)) return;
  state = {
    leftHand: roundAndString(res),
    rightHand: ""
  };
}
function typeNumber(k) {
  console.log(state);
  if (state.operand) {
    state.rightHand += k.toString();
  } else {
    state.leftHand = state.leftHand.replace("NaN", "");
    state.leftHand += k.toString();
  }
  updateResult();
}
function clearResult() {
  state = {
    leftHand: "",
    rightHand: ""
  };
  updateResult();
}
function eraseLast() {
  if (state.operand && state.rightHand) {
    state.rightHand = state.rightHand.slice(0, state.rightHand.length - 1);
  } else {
    state.leftHand = state.leftHand.slice(0, state.leftHand.length - 1);
  }
  updateResult();
}
function typeDot() {
  if (state.operand) {
    if (state.rightHand.includes(".")) return;
    state.rightHand += ".";
  } else {
    if (state.leftHand.includes(".")) return;
    state.leftHand += ".";
  }
  updateResult();
}
function typeBinary(k) {
  if (state.leftHand) {
    state.operand = k;
  }
  updateResult();
}
function typeResult() {
  processResult();
  updateResult();
}
function setPrecision(k) {
  precision = k;
}
function typeUnary(op) {
  switch (op) {
    case "opp" /* Opp */:
      if (state.operand) {
        state.rightHand = (-parseFloat(state.rightHand)).toString();
      } else {
        state.leftHand = (-parseFloat(state.leftHand)).toString();
      }
      break;
    case "inv" /* Inv */:
      if (state.operand) {
        state.rightHand = (1 / parseFloat(state.rightHand)).toString();
      } else {
        state.leftHand = (1 / parseFloat(state.leftHand)).toString();
      }
      break;
    case "sqrt" /* SquareRoot */:
      if (state.operand) {
        state.rightHand = Math.sqrt(parseFloat(state.rightHand)).toString();
      } else {
        state.leftHand = Math.sqrt(parseFloat(state.leftHand)).toString();
      }
      break;
  }
  updateResult();
}

if(__exports != exports)module.exports = exports;return module.exports}));
