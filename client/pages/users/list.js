import { useState } from "react";
import { Content } from "../../lib/Content";
import { Page } from "../../lib/Page";
import { Link } from "../../lib/Router";
import { useApi } from "../../lib/auth";
import { IconPencil, IconPlus, IconServer, IconTrash } from "@tabler/icons-react";
import { useUser } from "../../app";
import { GatewayPermissions } from "../../lib/permissions";

const createId = (id) => {
    return `pkg_${id}`;
}

export class UserList extends Page {

    static __init__(){
        return {
            url: "/admin/users",
            permissions: [GatewayPermissions.MANAGE_USERS]
        }
    }

    async loader(){
        const api = useApi();
        return await api("/api/v1/users").data();
    }

    render({ data: result }){

        const { user } = useUser();

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
                                <span className="bg-primary text-white avatar" style={{ backgroundImage: `url(${JSON.stringify(item.avatar)})`}}></span>
                            </div>
                            <div className="col">
                                <div className="font-weight-medium">
                                    {item.name}
                                    {(item.is_root_admin || item.is_admin) ? 
                                        <span className="status status-purple" style={{ marginLeft: "20px"}}>
                                            <span className="status-dot"></span>
                                            {item.is_root_admin ? "SUPER ADMIN" : "ADMIN"}
                                        </span>
                                    : null}
                                </div>
                            </div>
                            <div className="col d-flex justify-content-end">
                                { item.id !== user.id ? <Link to={"/admin/users/" + item.id} className="btn btn-primary mr-2 width-50" >
                                    <IconPencil />
                                </Link> : null}
                                {item.id !== user.id ? <Link to={"/admin/users/" + item.id + "/remove"} className="btn btn-danger width-50">
                                    <IconTrash />
                                </Link> : null}
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if(res.length === 0){
            res.push(<div className="page page-center" key="2ukwnown">
                <h3>Sem Usúarios registrados</h3>
            </div>)
        }

        return <Content>
            <div className="d-flex justify-content-end mb-2">
                <Link to="/admin/users/add" className="btn btn-primary">
                    <IconPlus />
                    Criar
                </Link>
            </div>
            {res}
        </Content>
        
    }

}