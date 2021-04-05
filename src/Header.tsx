import React,{useState} from 'react'
import './Header.css';

interface HeaderProps {
    onAdd: (itemName: string) => void
}

export const Header: React.FC<HeaderProps> = ({onAdd}) => {
    const [data,setData] = useState("");

    const getData = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(e.currentTarget.value)
    }
    
    return (
            <div className = "Header">
            <h1 className="Header-name">
            My ToDo List
            </h1>
            <form className="Header-form" >
                <div>
                     <input type="text" className="Header-form-control" placeholder="Add Item" onChange = {getData}></input>
                 </div>
                <button type="button" className="Header-form-button" onClick ={() => onAdd(data)}> + </button>
            </form>
            </div>
        );
}