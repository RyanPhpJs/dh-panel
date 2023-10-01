import { useEffect, useState } from "react";
import { useApi } from "./auth";

export function Pagination({ url, content }){

    const [options, setOptions] = useState({ items: [], isLoading: false, hasNext: false, hasPrevious: false, page: 1 });

    useEffect(() => {
        const api = useApi();
        api("/api/v1/packages?page=" + encodeURI(options.page)).data().then((res) => {
            setOptions({ 
                items: res.items, 
                isLoading: false, 
                hasNext: res.hasNext, 
                hasPrevious: res.hasPrevious, page: 1 
            });
        })
    }, []);

    return <>
    
        <div></div>
    </>

}