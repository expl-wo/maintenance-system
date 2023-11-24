import dayjs from "dayjs";

export const formatMonthStartDate = (date) =>{
    if(date){
        return dayjs(date).startOf('months').format('YYYY-MM-DD')
    }else{
        return null
    }
}

export const formatMonthEndDate = (date) =>{
    if(date){
        return dayjs(date).endOf('months').format('YYYY-MM-DD')
    }else{
        return null
    }
}


export const dateFilter = (value)=> {
    if(value){
        let realVal = value.substring(0, 10);
        return realVal;
    }else{
        return value;
    }
}
