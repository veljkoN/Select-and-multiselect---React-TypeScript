import React, { useEffect, useRef, useState } from 'react'
import styles from './select.module.css'

export type SelectedOption  = {
    label:string 
    value:string | number
}

type MultipleSelectProps = {
    multiple: true
    value: SelectedOption[]
    onChange: (value:SelectedOption[]) => void
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectedOption
    onChange: (value:SelectedOption | undefined) => void
}

type SelectProps = {
    options: SelectedOption[]
} & (SingleSelectProps | MultipleSelectProps)

const Select = ({ multiple, value, onChange, options}:SelectProps) => {
    const [ isOpen, setIsOpen ] = useState(false)
    const [ highlightIndex, setHighlightIndex ] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      isOpen && setHighlightIndex(0)
    }, [isOpen])
    
    useEffect(() => {
        const handler = (e:KeyboardEvent) => {
            if (e.target !== containerRef.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen( prev => !prev)
                    if (isOpen) selectOption(options[highlightIndex])
                    break
                case "ArrowUp":
                case "ArrowDown":{
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightIndex + (e.code === "ArrowDown" ? 1:-1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightIndex(newValue)
                    }
                    break
                
                }
                case "Escape": 
                    setIsOpen(false)
                    break

            }
        }
        containerRef.current?.addEventListener("keydown" ,handler)
        return () => {
            containerRef.current?.removeEventListener("keydown" ,handler)
        }
    },[ isOpen, highlightIndex])

    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined)
    }

    const selectOption = (option:SelectedOption) => {
        if (multiple) {
            if (value.includes(option)) {
                onChange(value.filter( o => o !== option))
            }
            else {
                onChange([...value, option])
            }
        }
        else {

            option !== value &&  onChange(option)   //only if value is not equal to selected option - not necessary
        }
    }

    const isOptionSelected = (option:SelectedOption) => {
        return multiple ? value.includes(option) : option === value
    }
    return (
        
        <div 
            ref={containerRef}
            onBlur={() => setIsOpen(false)}
            onClick={() => setIsOpen( prev => !prev)} 
            tabIndex={0} 
            className={styles.container}
        >
            <span className={styles.value}>
                {multiple ? value.map( v => (
                    <button 
                        key={v.value} 
                        onClick={e =>{
                            e.stopPropagation()
                            selectOption(v)
                        }}
                        className={styles["option-badge"]}
                    > 
                    { v.label } 
                    <span  className={styles["remove-btn"]}>&times;</span>
                    </button>
                )): value?.label}
            </span>
            <button onClick={e => {clearOptions(); e.stopPropagation()}} className={styles[`clear-btn`]}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}>

            </div>
            <ul  className={`${styles.options} ${ isOpen ? styles.show:''}`}>
                {options.map( (option, index) => (
                    <li 
                        onClick={e=> {e.stopPropagation(); selectOption(option);setIsOpen(false)}} 
                        onMouseEnter={() => setHighlightIndex(index)}
                        key={option.value} 
                        className={`${styles.option} ${
                            isOptionSelected(option) ? styles.selected:""
                        } ${
                            index  === highlightIndex? styles.highlighted:""
                        }`}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    
    )
}

export default Select