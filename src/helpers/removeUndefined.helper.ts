const removeNull = (obj: any): any => {
    if (obj === undefined) return null;
    if (typeof obj === 'object') {
        for (let key in obj) {
            obj[key] = removeNull(obj[key]);
        }
    }
    return obj;
}
export default removeNull;