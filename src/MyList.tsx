import React from 'react';
import  './MyList.css';
interface MyListProps {
    name: string
    value: boolean
    onRemove: (name: string) => void
    onCheck: (name: string) => void
} 
   
export const MyList: React.FC <MyListProps>  = ({name,value,onRemove,onCheck}) => {
    return (
        <div className="List">
            <br></br>
            <input type="checkbox" className = "List-box" onChange = {() => onCheck(name)} checked = {value} />
            <p className= "List-text" >{name}</p>
            <button className="List-button" onClick = {() => onRemove(name)} >x</button>
        </div>
    );
}


