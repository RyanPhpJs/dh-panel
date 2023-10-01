import { useState } from "react";
import { GatewayPermissions } from "../../../lib/permissions";
import { Label } from "../../../lib/form/Label";

export function PermissionsInput({ user, mainUser }) {
    const [isAdminChecked, setChecked] = useState(user.permissions.includes(GatewayPermissions.ADMINISTRADOR));
    const res = [];
    res.push(<div key="ifcb_administrador">
        <input type="checkbox" name="permissions.ADMINISTRADOR" id="ifcbi_administrador" checked={isAdminChecked} disabled={mainUser.permissions.includes("ADMINISTRADOR") ? false : !mainUser.permissions.includes("ADMINISTRADOR")} onChange={(e) => {
            setChecked(e.currentTarget.checked)
        }}/>
        <label htmlFor="ifcbi_administrador"> ADMINITRADOR </label>
    </div>)
    for(const key of Object.keys(GatewayPermissions)){
        if(key !== "ADMINISTRADOR"){
            res.push(<div key={"ifcb_" + key.toLowerCase()} className={isAdminChecked ? "d-none" : ""}>
                <input type="checkbox" name={"permissions." + key} key={"ifcb_" + key.toLowerCase()} id={"ifcbi_" + key.toLowerCase()} field_ignore={isAdminChecked ? "1" : "0"} disabled={mainUser.permissions.includes("ADMINISTRADOR") ? false : !mainUser.permissions.includes(key)} defaultChecked={user.permissions.includes(key)}/>
                <label htmlFor={"ifcbi_" + key.toLowerCase()}>{key}</label>
            </div>)
        }
        
    }
    

    return <div className="mb-3">
        <Label>Permissões</Label>
        {res}
    </div>
}