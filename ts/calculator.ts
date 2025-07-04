enum BinaryOperator {
  Add = "+",
  Sub = "-",
  Mul = "*",
  Div = "/",
  Pow = "^",
}

enum UnaryOperator {
  Inv = "inv",
  Opp = "opp",
  SquareRoot = "sqrt",
}

type State = {
  leftHand: string;
  operand?: BinaryOperator;
  rightHand: string;
};

let state: State = { leftHand: "", rightHand: "" };
let precision: number = 3;

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

function roundAndString(k: number) {
  return (Math.round(k * 10 ** precision) / 10 ** precision).toString();
}

function processResult() {
  let l = parseFloat(state.leftHand);
  let r = parseFloat(state.rightHand);
  let res: number;
  switch (state.operand) {
    case BinaryOperator.Add:
      res = l + r;
      break;
    case BinaryOperator.Sub:
      res = l - r;
      break;
    case BinaryOperator.Div:
      res = l / r;
      break;
    case BinaryOperator.Mul:
      res = l * r;
      break;
    case BinaryOperator.Pow:
      res = Math.pow(l, r);
      break;
    default:
      res = l;
  }
  if (isNaN(res)) return;

  state = {
    leftHand: roundAndString(res),
    rightHand: "",
  };
}

//@ts-ignore
window.typeNumber = function (k: number) {
  console.log(state);
  if (state.operand) {
    state.rightHand += k.toString();
  } else {
    state.leftHand = state.leftHand.replace("NaN", "");
    state.leftHand += k.toString();
  }
  updateResult();
};

//@ts-ignore
window.clearResult = function () {
  state = {
    leftHand: "",
    rightHand: "",
  };
  updateResult();
};

//@ts-ignore
window.eraseLast = function () {
  if (state.operand && state.rightHand) {
    state.rightHand = state.rightHand.slice(0, state.rightHand.length - 1);
  } else {
    state.leftHand = state.leftHand.slice(0, state.leftHand.length - 1);
  }
  updateResult();
};

//@ts-ignore
window.typeDot = function () {
  if (state.operand) {
    if (state.rightHand.includes(".")) return;
    state.rightHand += ".";
  } else {
    if (state.leftHand.includes(".")) return;
    state.leftHand += ".";
  }
  updateResult();
};

//@ts-ignore
window.typeBinary = function (k: BinaryOperator) {
  if (state.leftHand) {
    state.operand = k;
  }
  updateResult();
};

//@ts-ignore
window.typeResult = function () {
  processResult();
  updateResult();
};

//@ts-ignore
window.setPrecision = function (k: number) {
  precision = k;
};

//@ts-ignore
window.typeUnary = function (op: UnaryOperator) {
  switch (op) {
    case UnaryOperator.Opp:
      if (state.operand) {
        state.rightHand = (-parseFloat(state.rightHand)).toString();
      } else {
        state.leftHand = (-parseFloat(state.leftHand)).toString();
      }
      break;
    case UnaryOperator.Inv:
      if (state.operand) {
        state.rightHand = (1 / parseFloat(state.rightHand)).toString();
      } else {
        state.leftHand = (1 / parseFloat(state.leftHand)).toString();
      }
      break;
    case UnaryOperator.SquareRoot:
      if (state.operand) {
        state.rightHand = Math.sqrt(parseFloat(state.rightHand)).toString();
      } else {
        state.leftHand = Math.sqrt(parseFloat(state.leftHand)).toString();
      }
      break;
  }
  updateResult();
};
