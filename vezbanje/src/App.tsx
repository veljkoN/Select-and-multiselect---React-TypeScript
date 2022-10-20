import React, { useState } from 'react'
import Select, { SelectedOption } from './Select'

const options= [ 
  {label:'First', value:1},
  {label:'Second', value:2},
  {label:'Third', value:3},
  {label:'Fourth', value:4},
  {label:'Fifth', value:5}
]

const App = () => {
  const [value1, setValue1 ] = useState<SelectedOption[] >([options[0]])
  const [value2, setValue2 ] = useState<SelectedOption | undefined >(options[0])
  return (
    <>
       <Select 
          multiple 
          onChange={(o)=> setValue1(o)} 
          options={options} 
          value={value1} 
        /><br/>
       <Select 
          onChange={(o)=>setValue2(o)} 
          options={options} 
          value={value2} 
        />
    </>)

}
  


export default App