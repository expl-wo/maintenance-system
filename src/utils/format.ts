export function formatDate(date,subLen=10){
    if(!date){
        return '';
    }
    try{
        if(date && date.length >= subLen){
            return date.substr(0, subLen);
        }else{
            return date;
        }
    }catch{
        return '';
    }
}

