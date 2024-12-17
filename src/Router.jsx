import React from "react";
import {Routes,Route} from 'react-router-dom';
import Map from "./pages/Map";
import LiveLocation from "./pages/LiveLocation";

const AllRoutes = () =>{
    return(
        <Routes>
            <Route exact path="/" element={<Map/>}/>
            <Route exact path="/live" element={<LiveLocation/>}/>
        </Routes> 
    )
}

export default AllRoutes;