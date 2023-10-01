import { IconDeviceFloppy } from "@tabler/icons-react";
import { Content } from "../../lib/Content";
import { Page } from "../../lib/Page";
import { Form } from "../../lib/form/Form";
import { Input } from "../../lib/form/Input";
import { SubmitButton } from "../../lib/form/SubmitButton";
import { useApi } from "../../lib/auth";
import { Alert } from "../../lib/tabler/Alert";
import { useEffect, useState } from "react";
import { Select, Option } from "../../lib/form/Select";
import { GatewayPermissions } from "../../lib/permissions";
import { PermissionsInput } from "./components/PermissionsInput";
import { useUser } from "../../app";

export class UserEdit extends Page {

    static __init__(){
        return {
            url: "/admin/users/{id}",
            permissions: [GatewayPermissions.MANAGE_USERS]
        }
    }

    async loader({ id }){
        const api = useApi();
        return api(`/api/v1/users/${id}`).data()
    }

    render({ data, params: { id } }){

        const [success, setSuccess] = useState();
        const { user } = useUser();

        useEffect(() => {
            const timeout = setTimeout(() => {
                if(timeout)
                    setSuccess(false);
            }, 10000);
            return () => clearTimeout(timeout);
        }, [success])

        return <Content>
            <h2>Editar Usúario</h2>
            {success ? <Alert color={"success"} title="Salvo" text="Suas alterações foram salvas com sucesso!" /> : null}
            <Form target={"/api/v1/users/" + id} method={"PUT"} onSuccess={(data) => { setSuccess(true); } }>
                <Input type="text" name="name" label="Nome" min={1} value={data.name}/>
                <Input type="text" name="email" label="E-Mail" min={1} value={data.email}/>
                <Input type="text" name="username" label="Username" min={1} value={data.username} disabled={true}/>
                <Input type="text" name="password" label="Senha" optional={true} min={8} value={""} disabled={!(user.permissions.includes(GatewayPermissions.ADMINISTRADOR) || user.permissions.includes(GatewayPermissions.SET_PASSWORD))}/>
                <PermissionsInput mainUser={user} user={data} />
                <SubmitButton>
                    <IconDeviceFloppy />
                    Salvar
                </SubmitButton>
            </Form>
        </Content>
        
    }

}