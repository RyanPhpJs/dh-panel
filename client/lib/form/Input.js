import { Label } from "./Label"

/**
 * 
 * @param {{
 *  name: string,
 *  type: import("react").HTMLInputTypeAttribute,
 *  label: string,
 *  min?: number,
 *  max?: number
 *  disabled?: boolean
 * }} param0 
 * @returns 
 */
export function Input({ name, type, label, min, max, value, onChange=()=>{}, step, disabled, optional }){
    return <>
        <Label>{label}</Label>
        <div className="mb-3 form-input">
            {(() => {
                if(type === "number")
                    return <input required={!optional}  onChange={onChange} type="number" min={min} max={max} name={name} defaultValue={value} step={step || "1" } disabled={disabled}/>
                return <input required={!optional} onChange={onChange} type={type} maxLength={max} minLength={min} name={name} defaultValue={value} disabled={disabled}/>
            })()}
        </div>
    </>
    
}