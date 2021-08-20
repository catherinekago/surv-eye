import { useEffect, useState } from "react";
import './ruler.css';


const Ruler = (props) => {

    return (
        <div id="RULER">
            <div id="RULER-BASE"/>
            <div className="ruler-tick" style={{gridColumn:1, justifyContent:"flex-start"}} />
            <div className="ruler-tick" style={{gridColumn:2, justifyContent:"center"}} />
            <div className="ruler-tick" style={{gridColumn:3, justifyContent:"center"}} />
            <div className="ruler-tick" style={{gridColumn:4, justifyContent:"center"}} />
            <div className="ruler-tick" style={{gridColumn:5, justifyContent:"center"}} />
            <div className="ruler-tick" style={{gridColumn:6, justifyContent:"center"}} />
            <div className="ruler-tick" style={{gridColumn:7, justifyContent:"flex-end", width: "3%"}} />
        </div>
    );

 }
export default Ruler; 