import { createContext, useContext, useEffect, useState, useRef } from "react";
export { InputType, ButtonColors } from "./form.enum.ts";
import { ButtonColors, InputType, InputTypeToHtml } from "./form.enum.ts";
import axios from "axios";

import "./form.scss";

const FormContext = createContext(null);

function joinClassName(name, defaultClassName=""){
    return [...new Set([...defaultClassName.split(" "), name.split(" ")].filter(e => e))];
}

function useForm(){
    return useContext(FormContext);
}

export function Form({ auth, method, target, type, onSubmit, onResponse, children, className, sendMode="API_SUCCESS", ...props }) {

    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState(null);

    const handleSubmit = (e) => { 
        e.preventDefault();

        let sendArgs = {};
        for(const key of Object.keys(formData)){
            const value = formData[key].getValue();
            const res = formData[key].validate(value);
            if(!res){
                return;
            }
            sendArgs[key] = value;
        }
        let body = null;
        let contentType = "";
        if(Object.keys(sendArgs).length > 0){
            if(!type || type === "json") {
                body = JSON.stringify(sendArgs);
                contentType = "application/json"
            }
            if(type === "url" || type === "urlencoded") {
                body = JSON.stringify(sendArgs);
                contentType = "application/x-www-form-urlencoded"
            }
            if(type == "multipart" || type === "multipart/form-data"){
                contentType = multipart/form-data;
                let form = new FormData();
                for(const k of Object.keys(sendArgs)) form.set(k, sendArgs[k])
                body = form;
            }
        }
        console.log("Sending...", sendArgs);
        axios.request({ 
            url: target, 
            method: method || "GET",
            headers: {
                "Content-Type": contentType
            },
            data: body,
            validateStatus: () => true
        }).then((r) => {
            console.log('response 1');
            if(sendMode === "RAW"){
                onResponse(r);
            }else{
                if(typeof r.data === "object"){
                    if(r.data.success){
                        onResponse(r.data.data);
                    }else{
                        setErrors({
                            message: r.data.message,
                            focus: () => {}
                        })
                    }
                }else if(sendMode == "ALL"){
                    onResponse(r.data)
                }else{
                    setErrors({
                        message: "Um erro interno ocorreu",
                        focus: () => {}
                    })
                }
            }
            
        })
        
    }

    return <FormContext.Provider value={{ formData, setFormData, errors, setErrors, sendMode }}>
        <form {...props} onSubmit={handleSubmit} className={joinClassName("form-control", className)}>
            {children}
        </form>
    </FormContext.Provider>
    

}

export function ErrorAlert(){
    const { errors, setErrors } = useForm();
    useEffect(() => {
        if(errors && errors.message){
            console.log(errors, errors.focus);
            errors.focus();
        }
        return () => {
            
        }
    })
    if(errors && errors.message){
        return <div className="error-alert">{errors.message || "Um erro ocorreu"}</div>
    }
    return null;
}


export function Input({ placeholder, icon, name, isRequired, regex, type, isInteger, min, max, ...props }){
    const [isError, setIsError] = useState(false);
    const { formData, setFormData, setErrors, errors } = useForm();
    const element = useRef(null);
    useEffect(() => {
        if(typeof formData[name] !== "string") setFormData((prevData) => ({
            ...prevData,
            [name]: {
                validate,
                getValue: () => (element.current ? element.current.value : element.current)
            },
        }));

        return () => {
            setFormData((prevData) => ({
                ...prevData,
                [name]: undefined,
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        if(isError) {
            setErrors(null);
            setIsError(false);
        }
        // if(element.current){
        //     element.current.value = mask(e.target.value)
        // }
    };

    const buildError = (text) => {
        return {
            message: text,
            focus: () => {
                if(element.current){
                    element.current.focus();
                    setIsError(true);
                }
            }
        }
    }

    const validate = (value) => {
        setIsError(false);
        let _value = String(value).trim();
        if(InputType.INTEGER === type){
            if(!Number.isInteger(_value)){
                return setErrors(buildError(`${name} deve ser um número inteiro valido`));
            }
        }

        if(isRequired && (_value.length === 0 || !value)){
            return setErrors(buildError(`${name} deve ser informado`));
        }

        if(min){
            if(_value.length < min) {
                if([InputType.INTEGER, InputType.NUMBER, InputType.FLOAT].includes(type))
                    return setErrors(buildError(`${name} deve ter ser maior ou igual a ${min}`));
                else 
                    return setErrors(buildError(`${name} deve ter pelo menos ${min} caracteres`));
            }
        }

        if(max){
            if(_value.length > max) {
                if([InputType.INTEGER, InputType.NUMBER, InputType.FLOAT].includes(type))
                    return setErrors(buildError(`${name} deve ter ser menor ou igual a ${max}`));
                else 
                    return setErrors(buildError(`${name} deve ter até ${max} caracteres`));
            }
        }

        return true;
    }

    return <div className={"form-input" + ((errors && isError) ? " error" : "")} key={"form_div_input_" + name}>
        {icon ? <div className="form-input-icon" onClick={() => element.current ? element.current.focus() : null }> <div className={icon}></div></div>  : null}
        <input ref={element} key={"form_element_input_" + name} type={InputTypeToHtml[type || 0]} onChange={handleInputChange} placeholder={placeholder} />
    </div>
}

/**
 * 
 * @param {{ color: ButtonColors }} param0 
 * @returns 
 */
export function SubmitButton({ color=ButtonColors.Blue, children }) {
    return <button type="submit" className={"btn " + color}>{children}</button>
}