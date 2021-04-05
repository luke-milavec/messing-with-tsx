import React,{useReducer, Fragment, useState, useEffect} from 'react';
import {MyList} from "./MyList"
import {Header} from "./Header"
import  'clearblade-js-client/lib/mqttws31'; 
import  {ClearBlade} from 'clearblade-js-client';
import  './App.css';

//todo
//pass dispatch
//fix update - changes order
//clean qry reset in event handler
//fix useEffect deps

type ToDo = {
  name:string;
  value: boolean;
}

type CB ={
  cb: IClearBlade;
  qry: QueryObj;
  collection: Collection<State>;
}
type State = ToDo[];

type ACTIONTYPE =
  | { type: "add"; name: string }
  | { type: "remove"; name: string }
  | { type: "check"; name: string }
  | {type: "innit"; initState: State};
  
const key = "a8abf2850caeee98deb49bddc0aa01"
const secret = "A8ABF2850CAADCD0F3F0E784A663"
const colID = "d0a9f7850cfcfae289d5e18f8d09"



const App: React.FC = () => {

  
  const[api] = useState<CB>(()=>{
    let icb:IClearBlade = new ClearBlade();
    let iqry: QueryObj = icb.Query({collectionID:colID})
    let icollection: Collection<State>= icb.Collection({collectionID:colID})
    let initAPI: CB = {cb: icb,qry: iqry,collection:icollection }
    return initAPI
  })
  const [items, dispatch] = useReducer<(state: State, action: ACTIONTYPE) => State>(ToDoReducer,[])
  
  const initCb = (error: boolean, response: any) => {
    if(!error){
      api.collection = api.cb.Collection({collectionID:colID})
      api.collection.fetch(fetchCb)
    }
    else{
     console.log(error + " fetch")
    }
  }

  const fetchCb = (error: boolean, response: any) => {
    if(!error){
      let initState: State = []
      for(var i of response){
        initState.push(i.data)
      }
      dispatch({type: "innit", initState: initState})
    }
    else{
     console.log(error + " fetch")
    }
  }

  const updateCb = (error: boolean, response: any)=> {
    if(!error){
      console.log(response)
    }
    else{
     console.log(error + " update")
    }
}
  
const addCb = (error: boolean, response: any) => {
    if(!error){
      console.log(response)
    }
    else{
     console.log(error+ " add")
    }
}  

const removeCb = (error: boolean, response: any)=>{
    if(!error){
      console.log(response)
    }
    else{
      console.log(error +" remove")
    }
}
  useEffect(()=> {
    api.cb.init({systemKey: key, systemSecret: secret,callback: initCb})
    api.qry = api.cb.Query({collectionID:colID})
    // eslint-disable-next-line 
  },[])

  const handleAddItem = async (itemName: string) => {
    api.collection.create([{name: itemName, value: false}],addCb)
    dispatch({type: "add", name: itemName})
    
  };
  
  const handleRemoveItem = (itemName: string) => {
    api.collection.remove(api.qry.equalTo("name",itemName),removeCb)
    api.qry = api.cb.Query({collectionID:colID})
    dispatch({type: "remove", name: itemName})
  };

  const handleCheckItem = (itemName: string) => {
    api.collection.update(api.qry.equalTo("name",items[items.findIndex(x => x.name ===itemName)].name),{value: !items[items.findIndex(x => x.name ===itemName)].value},updateCb) 
    api.qry = api.cb.Query({collectionID:colID})
    dispatch({type: "check",name: itemName})
  };


  function ToDoReducer(state: State, action: ACTIONTYPE) {
    switch (action.type) {
      case "add":
        return [...state, {name: action.name,value:false}]
      case "remove":
        return state.filter((_,i)=>action.name !== state[i].name)
      case "check":
        return [...state.filter((_,i)=>action.name !== state[i].name), {name: state[state.findIndex(x => x.name === action.name)].name, value: !state[state.findIndex(x => x.name ===action.name)].value}]
      case "innit":
        return action.initState
      default:
        throw new Error();
    }
  }

  return (
    <Fragment>
        <Header onAdd = {handleAddItem}/>
        {items.map(item=>(
          <MyList  name= {item.name} onRemove = {handleRemoveItem} onCheck = {handleCheckItem} value = {item.value} key = {item.name+" key"}/>
        ))} 
    </Fragment>
  );
}

export default App;

