/* eslint-disable react/prop-types */
import { ACTIONS } from "./calculator"

export default function DigitButton({ dispatch, digit }) {
    return <button onClick={()=> dispatch(
        { type: ACTIONS.ADD_DIGIT, payload: { digit }}
        )}>
        { digit }
        </button>
}
