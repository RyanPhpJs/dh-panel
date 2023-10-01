import { IconBox, IconHome, IconSettings, IconUser } from "@tabler/icons-react";
import { GatewayPermissions } from "../../lib/permissions"

function MenuItem(icon, name, target, ...permissions){
    return {
        name,
        icon,
        permissions,
        target,
        validate: (user) => {
            if(user.permissions.includes("ADMINISTRADOR")) return true;
            for(const p of permissions) {
                if(!user.permissions.includes(p)) return false;
            }
            console.log('passou');
            return true;
        }
    }
}

export const InternMenu = [
    MenuItem(<IconHome />, "Home", "/"),
    MenuItem(<IconBox />, "Pacotes", "/admin/packages", GatewayPermissions.MANAGE_PACKAGES),
    MenuItem(<IconUser />, "Usúarios", "/admin/users", GatewayPermissions.MANAGE_USERS),
    MenuItem(<IconSettings />, "Configurações", "/settings"),
]