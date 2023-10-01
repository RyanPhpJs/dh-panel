export function SubmitButton({ children }){
    return <div>
        <button className="btn btn-primary" type="submit" style={{maxWidth: "200px"}}>{children}</button>
    </div>
}