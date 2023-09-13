export function objectToXml(nameTag: string, object: Record<string, any>) {

    let content = [];
    let args = [];

    for(const key of Object.keys(object)){
        if(key === "@" && typeof object[key] === "object" && object[key] !== null){
            for(const attrKey of Object.keys(object[key])){
                args.push({ name: attrKey, value: String(object["@"][attrKey] )});
            }
        }
        if(typeof object[key] === "object"){
            content.push()
        }
    }

    return content;

}

function XmlTag(name: string, attrs: string, value: string){
    
}

export function escapeXmlContent(str: string | number){
    return String(str).replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
}

export function toXml(){

}