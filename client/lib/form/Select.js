import { Label } from "./Label";

export function Select({ children, label, value, ...args }) {
    return <>
        <Label>{label}</Label>
        <div className="mb-3 form-input">
            <select className="form-select" {...args} defaultValue={value}>
                {children}
            </select>
         </div>
    </>
}

/**
 * 
 * @param {{ text: string, value: string, selected: boolean}} param0 
 * @returns 
 */
export function Option({ text, value, selected=false }){
    return <option value={value}>{text}</option>;
}