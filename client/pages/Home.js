import { useApi } from "../lib/auth";
import {Page} from "../lib/Page";
import { useEffect, useState } from "react";

export class HomePage extends Page {

  async loader(){
    const api = useApi();
    return await api("/api/v1/stats").data();
  }

  render({ data: stats }){

    useEffect(() => {
      //setItems([{ name: "Files2", icon: <IconFolder />, to: "/abc" }]);
      //return () => setItems([])
    })

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
                <div className="col-md-4">
                    <div className="tb_card">
                        <div className="tb_card-body">
                            <div className="subheader">RAM</div>
                            <div className="h3 m-0">{stats.memory.usage} / {stats.memory.total}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>
  }

}