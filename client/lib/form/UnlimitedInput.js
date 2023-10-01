import { IconInfinity } from "@tabler/icons-react"
import { Label } from "./Label"
import { useState } from "react"

/**
 * 
 * @param {{
 *  name: string,
 *  type: import("react").HTMLInputTypeAttribute,
 *  label: string,
 *  min?: number,
 *  max?: number
 *  buttonUnlimited?: string,
 *  step?: string | number
 * }} param0 
 * @returns 
 */
export function UnlimitedInput({ name, type, label, min=null, max=null, value="", onChange=()=>{}, step }){
    const [unlimited, setUnlimited] = useState(value !== "" ? value < 1 : false);
    const val = (v) => {
        if(min !== null){
            if(type === "text"){
                if(v.length < min) return "";
                if(v.length > max) return "";
            }
            if(type === "number"){
                if(v < min) return "";
                if(v > max) return "";
            }
        }
        return v;
    }
    return <>
        <Label>{label}</Label>
        <div className="d-flex">
            <div className="mb-3 form-input">
                {(() => {
                    const style = unlimited ? { display: "none" } : {};
                    if(type === "number")
                        return <>
                            {unlimited ? <input type="text" value="Ilimitado" disabled={true} /> : null}
                            <input onChange={onChange} type="number" min={min} max={max} name={name} is_unlimited={unlimited ? "1" : "0"} style={style} defaultValue={val(value)} step={step || "1" }/>
                        </>
                    return <>
                        {unlimited ? <input type="text" value="Ilimitado" disabled={true} /> : null}
                        <input onChange={onChange} type={type} maxLength={max} minLength={min} name={name} is_unlimited={unlimited ? "1" : "0"} style={style} defaultValue={val(value)}/>
                    </>
                })()}
            </div>
            <button style={{ marginLeft: "15px", width: "50px"}} type="button" className="btn btn-info" onClick={(e) => {
                setUnlimited(!unlimited);
            }}>
                <IconInfinity />
            </button>
        </div>
        
    </>
    
}