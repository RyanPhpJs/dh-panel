import { IconTrash } from "@tabler/icons-react";
import { Content } from "../../lib/Content";
import { Page } from "../../lib/Page";
import { Form } from "../../lib/form/Form";
import { SubmitButton } from "../../lib/form/SubmitButton";
import { useApi } from "../../lib/auth";
import { Alert } from "../../lib/tabler/Alert";
import { useEffect, useState } from "react";
import { useNavigate } from "../../lib/Router";
import { GatewayPermissions } from "../../lib/permissions";

export class PackagesDelete extends Page {

    static __init__(){
        return {
            url: "/admin/packages/{id}/remove",
            permissions: [GatewayPermissions.MANAGE_PACKAGES]
        }
    }

    async loader({ id }){
        const api = useApi();
        return api(`/api/v1/packages/${id}`).data()
    }

    render({ data, params: { id } }){

        const [success, setSuccess] = useState(false);
        const [seconds, setSeconds] = useState(5)

        useEffect(() => {
            const interval = setTimeout(() => {
                if(success){
                    //console.log('interval executed', seconds, success);
                    window.setSeconds  = setSeconds;
                    if(seconds === 1){
                        navigate.to("/admin/packages")
                    }else if(interval){
                        setSeconds(seconds-1);
                    }
                }
            }, 1000);
            return () => clearTimeout(interval);
        }, [success, seconds]);

        const navigate = useNavigate();

        return <Content>
            <h2>Remover Pacote: {data.name}</h2>
            {success ? <Alert color={"success"} title="Removido" text={`Você será redirecionado em ${seconds} segundos`} /> : null}
            <Form target={"/api/v1/packages/" + id} method={"DELETE"} onSuccess={(data) => { setSuccess(true); } }>
                <SubmitButton>
                    <IconTrash />
                    Remover
                </SubmitButton>
            </Form>
        </Content>
        
    }

}