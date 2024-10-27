/* eslint-disable react/prop-types */
import { ACTIONS } from "./calculator"

export default function OpButton({ dispatch, operation }) {
    return <button onClick={()=> dispatch(
        { type: ACTIONS.CHOOSE_OP, payload: { operation }}
        )}>
        { operation }
        </button>
}
