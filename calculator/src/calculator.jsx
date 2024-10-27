import { useReducer } from "react";
import DigitButton from "./digitButton";
import OpButton from "./opButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  CHOOSE_OP: "choose-op",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          actualOp: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.actualOp === "0") return state;

      if (payload.digit === "." && state.actualOp.includes(".")) return state;

      return {
        ...state,
        actualOp: `${state.actualOp || ""}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OP:
      if (state.actualOp == null && state.prevOp == null) {
        return state;
      }

      if (state.actualOp == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.prevOp == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOp: state.actualOp,
          actualOp: null,
        };
      }
      return {
        ...state,
        prevOp: evaluate(state),
        operation: payload.operation,
        actualOp: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          actualOp: null,
        };
      }
      if (state.actualOp == null) return state;
      if (state.actualOp.lenght === 1) {
        return {
          ...state,
          actualOp: null,
        };
      }
      return {
        ...state,
        actualOp: state.actualOp.slice(0, -1),
      };

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.actualOp == null ||
        state.prevOp == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevOp: null,
        operation: null,
        actualOp: evaluate(state),
      };
  }
}

function evaluate({ actualOp, prevOp, operation }) {
  const prev = parseFloat(prevOp);
  const actual = parseFloat(actualOp);
  if (isNaN(prev) || isNaN(actual)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + actual;
      break;
    case "-":
      computation = prev - actual;
      break;
    case "x":
      computation = prev * actual;
      break;
    case "/":
      computation = prev / actual;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand){
  if (operand == null) return
  const [ integer , decimal ] = operand.split(".")
    if(decimal == null) return INTEGER_FORMATER.format(integer)
      return `${INTEGER_FORMATER.format(integer)}.${decimal}`
}

export default function Calculator() {
  const [{ actualOp, prevOp, operation }, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator-grid">
      <div className="result">
        <div className="prev-op">
          {formatOperand(prevOp)}
          {operation}
        </div>
        <div className="actual-op">{formatOperand(actualOp)}</div>
      </div>
      <button
        className="span-2"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OpButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OpButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OpButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OpButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-2"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}
