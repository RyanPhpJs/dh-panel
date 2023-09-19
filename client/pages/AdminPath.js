import { useEffect, useState } from "react";
import { useApi } from "../lib/auth";
import {Page} from "../lib/Page";
import FileIcons  from "../lib/FileIcons"
import "@exuanbo/file-icons-js/dist/css/file-icons-cdn.css";
import "../scss/files.scss";

const parseIcon = (name, type) => {
    if(type === "DIRECTORY") return 'bx bx-folder';
    if(type === "FILE") return FileIcons.getClass(name)
    return 'bx bx-folder'
}

function Item(props){
    return <div className="w-100 st__tr">
        <div className="st__td">
            <i className={parseIcon(props.name, props.type)} style={{ fontSize: "1rem" }}></i>
            <span className="file_name">
                {props.name}
            </span>
        </div>
    </div>
}

function Items({ items, updatePath }){
    const res = [];
    for(const item of items){
        res.push(<Item type={item.type} name={item.name} path={item.path} key={item.path}/>)
    }
    return res;
}

export class AdminFileManager extends Page {

    async listDirectory(path, callback){
        const api = useApi();
        callback(await api("/api/v1/files/list?path=/workspace/dh-panel").data());
    }

    render({ self }){

        const [send_path, setSendPath] = useState("/");
        const [items, setItems] = useState([]);
        const [isLoading, setLoading] = useState(true);

        useEffect(() => {
            setLoading(true);
            self.listDirectory(send_path, (response) => {
                setSendPath(response.path);
                setItems(response.items);
                setLoading(false);
            });
        }, []);

        const updatePath = (path) => {
            self.listDirectory(path, (response) => {
                setSendPath(response.path);
                setItems(response.items);
                setLoading(false);
            });
        }

        return <div className="mt-3">
            <div className="table-file-list">
                <div className="card__pai p-1 w-100 card__right st__thead">
                    <div className="st__tr">
                        <div className="st__td">
                            <a className="btn is-ligth" onClick={() => {}}>
                                <i className="bx bx-hdd" />
                                Ir Para
                            </a>
                            <a className="btn is-ligth" onClick={() => {}}>
                                <i className="bx bxs-upvote" />
                                Pasta Acima
                            </a>
                            <a className="btn is-ligth" onClick={() => {}}>
                                <i className="bx bxs-folder-plus" />
                                Nova Pasta
                            </a>
                            <a className="btn is-ligth" onClick={() => {}}>
                                <i className="bx bxs-folder-plus" />
                                Novo Arquivo
                            </a>
                        </div>
                    </div>
                </div>
                <div className="card__pai p-1 w-100 st__tbody">
                    {isLoading ? <div>Loading Path...</div> : <Items items={items} />}
                </div>
            </div>
        </div>
    }

}