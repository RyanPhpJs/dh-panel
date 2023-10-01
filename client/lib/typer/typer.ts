function oneOf(value: any, items: any[]){
    for(const item of items){
        if(item === value) return item;
    }
    return null;
}

export const typer = {
    oneOf,
}

export default typer;