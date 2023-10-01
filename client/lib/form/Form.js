import { useEffect, useState } from "react";
import { ErrorForm } from "./ErrorForm";
import { useApi } from "../auth";

export function Form({ children, method, target, onSuccess, onError=(err)=>{ console.error(err)}}) {
    const [error, setError] = useState(null)

    return <form className="f-form-control" onSubmit={async (e) => {
        try {
            e.preventDefault();
        setError(null);
        const api = useApi();
        let send = {};
        const _el = {};
        for (let i = 0; i < e.currentTarget.elements.length; i++) {
            if (e.currentTarget.elements[i].nodeName === "INPUT") {
                const n = e.currentTarget.elements[i].getAttribute("name");
                const el = e.currentTarget.elements[i];
                _el[n] = el;
                if(el.getAttribute("type") === "checkbox"){
                    let keyI = n.split(".");
                    if(send[keyI[0]] === undefined) {
                        el[keyI[0]] = document.createElement("input")
                        el[keyI[0]].setAttribute("type", "checkbox");
                        send[keyI[0]] = [];
                    }
                    if(el.getAttribute("field_ignore") !== "1" && el.checked){
                        send[keyI[0]].push(keyI[1]);
                    }
                }else{
                    if(n !== null)
                    send[n] = e.currentTarget.elements[i].value;
                }
            }
        }
        for(const key of Object.keys(send)){
            /**
             * @type {HTMLInputElement}
             */
            const el = _el[key];
            if(!el) continue;
            if(el.getAttribute("is_unlimited") === "1"){
                send[key] = -1;
            }else{
                const _isNan = function(n){
                    if(n === null) return true;
                    return isNaN(n);
                }
                if(el.getAttribute("type") === "number"){
                    const min = _isNan(el.getAttribute("min")) ? 0 : Number(el.getAttribute("min"));
                    const max = _isNan(el.getAttribute("max")) ? Infinity : Number(el.getAttribute("max"));
                    send[key] = Number(send[key]);

                    if(send[key] < min) return setError(new Error(`${key} deve ser maior ou igual a ${min}`));
                    if(send[key] > max) return setError(new Error(`${key} deve ser menor ou igual a ${max}`));
                }
                if(["text", "password"].includes(el.getAttribute("type"))){
                    const min = _isNan(el.getAttribute("minlength")) ? 0 : Number(el.getAttribute("minlength"));
                    const max = _isNan(el.getAttribute("maxlength")) ? Infinity : Number(el.getAttribute("maxlength"));
                    if(!el.required){
                        if(send[key].length !== 0){
                            if(send[key].length < min) return setError(new Error(`${key} deve ter comprimento maior ou igual a ${min}`));
                            if(send[key].length > max) return setError(new Error(`${key} deve ter comprimento menor ou igual a ${max}`));
                        }
                    }else{
                        if(send[key].length < min) return setError(new Error(`${key} deve ter comprimento maior ou igual a ${min}`));
                        if(send[key].length > max) return setError(new Error(`${key} deve ter comprimento menor ou igual a ${max}`));
                    }
                    
                }
                
            }
        }
        console.log(send);
        const response = await api(target).method(method).json(send);
        if(response.success){
            onSuccess(response.data);
        }else{
            onError(response.message);
            return setError(new Error(response.message));
        }
        } catch (err) {
            console.error(err);
        }
    }}>
        {error ? <ErrorForm text={error.message}/> : null}
        {children}
    </form>
}