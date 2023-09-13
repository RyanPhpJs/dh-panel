import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { useAsync } from "react-async"

const RouterContext = createContext(null);

/**
 * 
 * @returns { { loadingElement: React.ReactElement, notFoundElement: React.ReactElement }}
 */
export function useRouter(){
    return useContext(RouterContext);
}

export function RouterManager(props) {

    const [loadingElement, _1] = useState(props.loading || <LoadingRouter />);
    const [notFoundElement, _2] = useState(props.notFound || <NotFoundRouter />);
    
    return <RouterContext.Provider value={{ loadingElement, notFoundElement}}>
        {props.children}
    </RouterContext.Provider>

}



async function callFunctionAsAsync({ func, params }) {
    return await func(params);
}


function RoutePromise({ component, params }){
    if(typeof component === "function"){
        const { isPending, isResolved, isRejected, error, data } = useAsync({ promiseFn: callFunctionAsAsync, func: component, params: params });
        if((!isPending) || (isRejected || isResolved)){
            if(error){
                return <div>ERRO: {error.message}</div>
            }else{
                return data;
            }
        }
        const e = useRouter();
        return e.loadingElement;
    }
    return component;
    
}

/**
 * 
 * @type {React.JSXElementConstructor}
 */
export function Routes({ children }) {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [childs, setChilds] = useState([]);
    useEffect(() => {
        // define callback as separate function so it can be removed later with cleanup function
        const onLocationChange = () => {
            setCurrentPath(location.pathname)
        }

        window.addEventListener('popstate', onLocationChange);
        /**
         * @type {(React.ReactElement)[]}
         */
        let childs = Array.isArray(children) ? children : [children];
        setChilds(childs)
        return () => {
            window.removeEventListener('popstate', onLocationChange)
        };
    }, []);
    for(const child of childs){
        if(child.type === Route){
            const validate = createValidation({ path: child.props.path, currentPath });
            if(validate.status){
                return <RoutePromise component={child.props.component} params={validate.params} key={location.pathname}/>;
            }
        }
    }
    const e = useRouter();
    return e.notFoundElement;
}

function createValidation(props){
    const indexed = [];
    const regex = new RegExp("^" + String(props.path)
        .replace(/{([^\}]+)}/g, (m, c) => {
            indexed.push(c);
            return "([^\/]+)";
        }) + "\/?$");
    
    if(regex.test(props.currentPath)){
        let res = {};
        props.currentPath.replace(regex, (r, ...m) => {
            for(const k in indexed){
                res[indexed[k] || k] = m[k];
            }
            return ''
        })
        return { status: true, params: res };
    }
    return { status: false, params: {} };
}

/**
 * 
 * @param {{ path: string, component: (getComponentFunction: { params: Record<string, string> }) => Promise<any>}} param0 
 * @returns 
 */
export function Route({ path, component }){
    return null;
}

// Navigation
export function Link({ href, to, children, ...props }){
    const _href = href || to || "";
    const navigate = useNavigate();
    const onClick = (event) => {
        if (event.metaKey || event.ctrlKey) {
            return;
        }
        event.preventDefault();
        navigate.to(_href);
    };
    return <a href={_href} onClick={onClick} {...props}>{children}</a>
}

export function useNavigate(){
    return {
        to(href){
            if(href.startsWith("#") || href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//")){
                location.href = href;
                return;
            }
            window.history.pushState({}, "", href);
            const navEvent = new PopStateEvent('popstate');
            window.dispatchEvent(navEvent);
        }
    }
}

// Routes Default
export function LoadingRouter(){
    return <div className="loading-item">Loading</div>
}

export function NotFoundRouter(){
    return <div className="not-found">Not Found</div>
}