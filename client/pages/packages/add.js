import { IconPlus } from "@tabler/icons-react";
import { Content } from "../../lib/Content";
import { Page } from "../../lib/Page";
import { useNavigate } from "../../lib/Router";
import { Form } from "../../lib/form/Form";
import { Input } from "../../lib/form/Input";
import { SubmitButton } from "../../lib/form/SubmitButton";
import { UnlimitedInput } from "../../lib/form/UnlimitedInput";
import { GatewayPermissions } from "../../lib/permissions";

export class PackagesAdd extends Page {

    static __init__(){
        return {
            url: "/admin/packages/add",
            permissions: [GatewayPermissions.MANAGE_PACKAGES]
        }
    }

    render(){

        const navigate = useNavigate();
        return <Content>
            <h2>Adicionar Novo Pacote</h2>
            <Form target={"/api/v1/packages/add"} method={"POST"} onSuccess={(data) => navigate.to(`/admin/packages/${data.id}`) }>
                <Input type="text" name="name" label="Nome do pacote" min={1} />
                <UnlimitedInput type="number" name="memory_limit" label="Limite de RAM (em MB)" min={1} max={999999}/>
                <UnlimitedInput type="number" name="cpu_limit" label="Limite de CPU" min={0.25} max={999999} step={0.25}/>
                <UnlimitedInput type="number" name="storage_limit" label="Limite de Armazenamento (em MB)" min={1} max={999999}/>
                <SubmitButton>
                    <IconPlus />
                    Criar
                </SubmitButton>
            </Form>
        </Content>
        
    }

}