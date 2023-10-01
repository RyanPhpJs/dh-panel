import { IconCloudDownload, IconCloudUpload } from "@tabler/icons-react";
import { useApi } from "../lib/auth";
import {Page} from "../lib/Page";
import { useEffect, useState } from "react";

export class HomePage extends Page {

    static __init__(){
        return {
            url: "/",
        }
    }

    async loader(){
        const api = useApi();
        return await api("/api/v1/stats").data();
    }

    render({ data: result }){

        const [stats, setStats] = useState(result);

        useEffect(() => {
            const api = useApi();
            const interval = setInterval(async()=>{
                setStats(await api("/api/v1/stats").data());
            }, 10500);
            return () => {
                clearInterval(interval);
            }
        }, [])

        return <>
            <div className="page-header d-print-none">
                <div className="container">
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <span className="status-indicator status-green status-indicator-animated">
                                <span className="status-indicator-circle"></span>
                                <span className="status-indicator-circle"></span>
                                <span className="status-indicator-circle"></span>
                            </span>
                        </div>
                        <div className="col">
                            <h2 className="page-title">
                                {location.host}
                            </h2>
                            <div className="text-secondary">
                                <ul className="list-inline list-inline-dots mb-0">
                                    <li className="list-inline-item"><span className="text-green">Servidor Online</span></li>
                                    <li className="list-inline-item"></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-xl mt-3">
                <div className="row">
                    <div className="col-md-4 mb-2">
                        <div className="tb_card">
                            <div className="tb_card-body">
                                <div className="subheader">RAM</div>
                                <div className="h3 m-0">{stats.memory.usage} / {stats.memory.total}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-2">
                        <div className="tb_card">
                            <div className="tb_card-body">
                                <div className="subheader">CPUs</div>
                                <div className="h3 m-0">{stats.cpu.count}</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-2">
                        <div className="tb_card">
                            <div className="tb_card-body">
                                <div className="subheader">NET</div>
                                <div className="h3 m-0"><IconCloudUpload /> {stats.net.input} / {stats.net.output} <IconCloudDownload /></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

}