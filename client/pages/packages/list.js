import { useState } from "react";
import { Content } from "../../lib/Content";
import { Page } from "../../lib/Page";
import { Link } from "../../lib/Router";
import { useApi } from "../../lib/auth";
import { IconPencil, IconPlus, IconServer, IconTrash } from "@tabler/icons-react";
import { GatewayPermissions } from "../../lib/permissions";

const createId = (id) => {
    return `pkg_${id}`;
}

export class PackagesList extends Page {

    static __init__(){
        return {
            url: "/admin/packages",
            permissions: [GatewayPermissions.MANAGE_PACKAGES]
        }
    }

    async loader(){
        const api = useApi();
        return await api("/api/v1/packages").data();
    }

    render({ data: result }){

        const [options, setOptions] = useState({ 
            items: result.items, 
            isLoading: false, 
            hasNext: result.hasNext, 
            hasPrevious: result.hasPrevious, 
            page: 1
        });

        let res = [];

        for(const item of options.items){
            res.push(
                <div className="tb_card tb_card-sm mb-2" key={createId(item.id)}>
                    <div className="tb_card-body">
                        <div className="row align-items-center">
                            <div className="col-auto">
                                <span className="bg-primary text-white avatar">
                                    <IconServer />
                                </span>
                            </div>
                            <div className="col">
                                <div className="font-weight-medium">
                                    {item.name}
                                </div>
                            </div>
                            <div className="col d-flex justify-content-end">
                                <Link to={"/admin/packages/" + item.id} className="btn btn-primary mr-2 width-50" >
                                    <IconPencil />
                                </Link>
                                <Link to={"/admin/packages/" + item.id + "/remove"} className="btn btn-danger width-50">
                                    <IconTrash />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if(res.length === 0){
            res.push(<div className="page page-center" key="1ukwnown">
                <h3>Sem Pacotes registrados</h3>
            </div>)
        }

        return <Content>
            <div className="d-flex justify-content-end mb-2">
                <Link to="/admin/packages/add" className="btn btn-primary">
                    <IconPlus />
                    Criar
                </Link>
            </div>
            {res}
        </Content>
        
    }

}