import { IconDeviceFloppy } from "@tabler/icons-react";
import { Content } from "../../lib/Content";
import { Page } from "../../lib/Page";
import { Form } from "../../lib/form/Form";
import { Input } from "../../lib/form/Input";
import { SubmitButton } from "../../lib/form/SubmitButton";
import { UnlimitedInput } from "../../lib/form/UnlimitedInput";
import { useApi } from "../../lib/auth";
import { Alert } from "../../lib/tabler/Alert";
import { useEffect, useState } from "react";
import { GatewayPermissions } from "../../lib/permissions";

export class PackagesEdit extends Page {

    static __init__(){
        return {
            url: "/admin/packages/{id}",
            permissions: [GatewayPermissions.MANAGE_PACKAGES]
        }
    }

    async loader({ id }){
        const api = useApi();
        return api(`/api/v1/packages/${id}`).data()
    }

    render({ data, params: { id } }){

        const [success, setSuccess] = useState();

        useEffect(() => {
            const timeout = setTimeout(() => {
                if(timeout)
                    setSuccess(false);
            }, 10000);
            return () => clearTimeout(timeout);
        }, [success])

        return <Content>
            <h2>Editar Pacote</h2>
            {success ? <Alert color={"success"} title="Salvo" text="Suas alterações foram salvas com sucesso!" /> : null}
            <Form target={"/api/v1/packages/" + id} method={"PUT"} onSuccess={(data) => { setSuccess(true); } }>
                <Input type="text" name="name" label="Nome do pacote" min={1} value={data.name}/>
                <UnlimitedInput type="number" name="memory_limit" label="Limite de RAM (em MB)" min={1} max={999999} value={data.ram_limit}/>
                <UnlimitedInput type="number" name="cpu_limit" label="Limite de CPU" min={0.25} max={999999}  value={data.cpu_limit} step={0.25}/>
                <UnlimitedInput type="number" name="storage_limit" label="Limite de Armazenamento (em MB)" min={1} max={999999} value={data.storage_limit}/>
                <SubmitButton>
                    <IconDeviceFloppy />
                    Salvar
                </SubmitButton>
            </Form>
        </Content>
        
    }

}