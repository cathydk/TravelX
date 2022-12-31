import logo from './logo.svg';
import './App.css';
import React from 'react';
import img1 from './images/Pic1.jpg'
import { createVendiaClient } from '@vendia/client';
import { useState } from 'react';
import {useEffect } from 'react';
import {createContext} from "react"
import ReactSwitch from "react-switch";
import{IllegalArgumentException} from 'react';


export const ThemeContext = createContext("null");

const client = createVendiaClient({
  apiUrl: `https://0xxvzaej3f.execute-api.us-west-1.amazonaws.com/graphql/`,
  websocketUrl: `wss://09wo5quo4b.execute-api.us-west-1.amazonaws.com/graphql`,
  apiKey: '8WHKyEb1ubhm8kjJT9gFWsa3m8wtWCzoeN3vMvaumR5q', // <---- API key
});

const { entities, storage } = client;

function App() {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);
  const [person,setPerson] = useState(undefined);
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme((curr) => (curr ==="light" ? "dark" : "light"));
  }
  const [ssn, setSsn] = useState();

  const [error,setError] = useState(undefined);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);




  const listPerson = async(x) => {
    const shipmentResponse = await entities.person.list({
      filter: {
        socialSecurity: {
          contains: x
        }

  
      }
    });

    console.log(shipmentResponse)

    if (shipmentResponse.items[0] == undefined){
      setError(true)
      setPerson(undefined);
    
      
      
    } 


    if (shipmentResponse.items[0] != undefined){
      setError(false)
      setPerson(shipmentResponse.items[0]);
      
    }
  
    }

    const listFiles = async(x) => {
      const imageResponse = await storage.files.list({
        filter: {
          sourceKey: {
            contains: x
          }
  
    
        }
      }); 
      
      console.log(imageResponse.items[0]);
      if (imageResponse.items[0] != undefined)
    {
      setImage(imageResponse.items[0].temporaryUrl);
      }
      setLoading(false);
    }


  function handleSubmit(event){
    let ssn = prompt( "Please enter a valid SSN")
    if(ssn != null && ssn !="" && ssn.length == 9){
      document.getElementById("ssn").innerHTML = "The SSN you entered was " + ssn + ".";    
      setSsn(ssn);  
      listPerson(ssn);
      listFiles(ssn);
  } else{
    document.getElementById("ssn").innerHTML = "The SSN you entered was " + ssn + ".";    
      ssn= "---------"
      setSsn(ssn);  
      listPerson(ssn);
      listFiles(ssn);
  }
  event.preventDefault();   
  }
  


  return (
    <ThemeContext.Provider value ={{theme, toggleTheme}}>
    <div className="App" id ="theme">
      
    <div className="switch">
      <label> {theme === "light" ? "🔆" : "🌙"}</label>
      <ReactSwitch onChange ={toggleTheme} checked ={theme === "light"}/>
      
     </div>
     
      <div>
        <text>
          <br />
          <br/>
        </text>
      </div>
    
      <img style ={{width: 771, height: 300}} src ={img1} alt="" class="center"/>   

      


      <h3></h3>
      <div style={{float: 'center'}}>
      <button onClick={handleSubmit}>Please Click This Button To Enter Social Security</button>
      <p id = "ssn"></p>
      </div>

    <h2></h2>
    {error == true && 
    <h2>Invalid SSN</h2>
    }



    {person!=undefined && 
    <table class="table1">
      <tr>
        <th class="blue">
          <div>Social Security</div>
        </th>

        <th colSpan="2">
          <div>Name: {person.firstName} {person.lastName}</div>
          <div>Birthdate: {person.dateOfBirth}</div>
          <div>Social Security: {person.socialSecurity} </div>
        </th>
      </tr>

      <tr>
        <th class="blue">
          <div>Department</div>
          <div>of Motor Vehicles</div>
        </th>

        {loading === false && <img class = "images" src={image}/>}
        
        <td>
        <div><b>Driver's License:</b></div>
        <div>{person.driversLicense}</div>
        </td>
      </tr>

	    <tr>
        <th class="blue">
          <div>Department</div>
          <div>of State</div>
        </th>

        {loading === false && <img class = "images" src={image}/>}
        
        
        <td>
        <div><b>Passport #:</b></div>
        <div>{person.passportNumber}</div>
        <div><b>Passport Expiration:</b></div>
        <div>{person.passportExpiration}</div>
        </td>
      </tr>

      <tr>
        <th class="blue">
          <div>Airline Information</div>
        </th>

        <th colSpan="2">
          <div align = "left">Airline: {person.airline} </div>
          <div align = "left">Flight Number: {person.flighNumber}</div>
          <div align = "left">Take Off Loaction:{person.takeOffFrom} </div>
          <div align = "left">Landing Location: {person.landLocation}</div>
          <div align = "left">Seat Number: {person.seatNumber}</div>
          <div align = "left">Take Off Date:{person.dateOfTakeOff} </div>
          <div align = "left">Landing Date: {person.dateOfLanding}</div>
          <div align = "left">Departure Time:{person.departureTime} </div>
          <div align = "left">Arrival Time: {person.arrivalTime}</div>
        </th>
      </tr>
    </table>

  
}



    </div>
    </ThemeContext.Provider>
  );



  }




export default App;
