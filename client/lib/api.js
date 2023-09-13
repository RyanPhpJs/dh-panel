class Response {
    /**
     * 
     * @param {Promise<globalThis.Response>} prom 
     */
    constructor(prom){
        let p = prom;

        this.getResponse = async () => {
            return await p;
        }

        this.getStatus = async () => {
            const resp = await this.getResponse();
            resp.status;
        }

        this.json = async () => {
            const resp = await this.getResponse();
            return await resp.json();
        }
    }
}

class RequestBuilder {
    constructor(url){
        let options = { method: "GET", headers: {} };

        this.token = function (type, token) {
            let ntoken = `Bearer ${type}`;
            if(token){
                ntoken = `${type} ${ntoken}`;
            }
            options.headers.Authorization = ntoken;
            return this;
        }

        this.method = function (method) {
            options.method = method;
            return this;
        }

        const createQuery = (obj, preName=[]) => {
            const response = [];
            for(const name of Object.keys(obj)){

                if(typeof obj[name] === "object" && obj !== null){
                    response.push(createQuery(obj[name], [...preName, name]));
                }else{
                    let realName = [...preName, name];
                    let rname = realName.map((v, i) => {
                        if(i == "0") return encodeURIComponent(v);
                        return `[${encodeURIComponent(v)}]`;
                    }).join("");
                    response.push([rname, "=", encodeURIComponent(obj[name])]);
                }

                
            }
            return response.join("&");
        }

        this.send = function (body=null) {
            let completeUrl = url;
            if(body){
                if(options.method === "GET" || options.method === "HEAD"){
                    completeUrl += "?" + (createQuery(body));
                }else{
                    options.body = JSON.stringify(body);
                    options.headers["Content-Type"] = "application/json";
                }
            }
            
            return new Response(fetch(completeUrl, options));
        }

        this.json = function (body=null){
            return this.send(body).json();
        }
    }
}

export function request(url){
    return new RequestBuilder(url);
}