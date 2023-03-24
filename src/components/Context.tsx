import { View, Text } from 'react-native'
import React, { useState,useContext } from 'react'

const Colors = React.createContext({})
 const Context = ({children}) => {
    const [color,setColor] = useState()
  return (
<Colors.Provider value={{color,setColor}}>
   {children }
    </Colors.Provider>
  )
}

export  {Colors, Context}