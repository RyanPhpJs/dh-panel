export function Label({ children, ...args }){
    return <label className="form-label" {...args}>{children}</label>
}