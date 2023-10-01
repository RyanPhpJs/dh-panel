import typer from "../typer/typer";

export function Alert({ color, title, text, children }) {
    const _Color = typer.oneOf(color, ["success", "danger", "info", "warning"]) || "info";
    return <div className={"alert bg-theme alert-" + _Color} role="alert">
        <h4 className="alert-title">{title}</h4>
        <div className="text-secondary">{text}   {children}</div>
    </div>

}