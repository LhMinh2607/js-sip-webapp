import React from 'react'

export default function DateComponent(props) {

    const {passedDate, onlyTime, onlyDate} = props; //onlyTime = HH:mm, onlyDate = dd/MM/yyyy

    const date = new Date(passedDate);
    const publishedHour = date.getHours();
    const publishedMin = date.getMinutes();
    const publishedDay = date.getDay()+1;
    const publishedDate = date.getDate();
    const publishedMonth = date.getMonth()+1;
    const publishedYear = date.getFullYear();
    
    return (

        <div>
            {props.children}
            {!onlyDate && publishedHour+":"}
            {!onlyDate && 
                (publishedMin < 10 ? <>0{publishedMin}</> : publishedMin)
            }
                
            {!onlyTime &&
                (publishedDay === 2 ? <> Monday</> : 
                publishedDay === 3 ? <> Tuesday</> :
                publishedDay === 4 ? <> Wednesday</> :
                publishedDay === 5 ? <> Thursday</> :
                publishedDay === 6 ? <> Friday</> :
                publishedDay === 7 ? <> Saturday</> :
                publishedDay === 1 && <> Sunday</>)
            }
            {!onlyTime && (", " + publishedDate+"/"+publishedMonth+"/"+publishedYear)}
        </div>
    )
}
