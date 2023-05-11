import React, { useState } from "react"
import type { RootState } from "./store/store"
import type { SquareState } from "./store/gameSlice"
import { useAppDispatch,useAppSelector } from "./store/hooks"
import { setHeight, setWidth, setBombs, setGrid } from './store/gameSlice'
import './style/gameSettings.scss'


export const GameSettings = () => {    
    const dispatch = useAppDispatch()

    interface settingsInput {
        height:number,
        width:number,
        mines:number
    }

    const [currentSettings,SetCurrentSettings] = useState<settingsInput>({height:16,width:16,mines:40})
    const handleSettingsChange = (height:number,width:number,mines:number) => {
        SetCurrentSettings({height:height,width:width,mines:mines})
    }

    const [currentRadio,SetCurrentRadio] = useState<number>(1)
    const handleRadioChange = (num:number) => {
        SetCurrentRadio(num)
    }

    const [heightNum,setHeightNum] = useState<number>(16)
    const handleChangeHeight = (event:React.ChangeEvent<HTMLInputElement>) => {
        const { valueAsNumber } = event.currentTarget
        setHeightNum(valueAsNumber)
        currentRadio === 3 && SetCurrentSettings({height:valueAsNumber,width:widthNum,mines:minesNum})
    }
    
    const [widthNum,setWidthNum] = useState<number>(16)
    const handleChangeWidth = (event:React.ChangeEvent<HTMLInputElement>) => {
        const { valueAsNumber } = event.currentTarget
        setWidthNum(valueAsNumber)
        currentRadio === 3 && SetCurrentSettings({height:heightNum,width:valueAsNumber,mines:minesNum})
    }

    const [minesNum,setMinesNum] = useState<number>(40)
    const handleChangeMines = (event:React.ChangeEvent<HTMLInputElement>) => {
        const { valueAsNumber } = event.currentTarget
        setMinesNum(valueAsNumber)
        currentRadio === 3 && SetCurrentSettings({height:heightNum,width:widthNum,mines:valueAsNumber})
    }

    const [popUp,setPopUp] = useState<boolean>(false)    

    
    

    return (
        <div id="GameSettings">
            <button id="newGame" onClick={() => dispatch(setGrid())}>new game</button>            
            <div id="SettingsPopUp" style={popUp ? {display:"flex"} : {display:"none"}}>
                <form id="SettingsForm" onSubmit={event => {
                    event.preventDefault()
                    dispatch(setHeight(currentSettings.height))
                    dispatch(setWidth(currentSettings.width))
                    dispatch(setBombs(currentSettings.mines))
                    setPopUp(!popUp)
                    dispatch(setGrid())
                }}>
                    <table>
                        <tr>
                            <th></th>
                            <th>Height</th>
                            <th>Width</th>
                            <th>Mines</th>
                        </tr>
                        <tr>
                            <td>
                                <input type="radio" id="game1" name="game" checked={currentRadio === 0} onChange={() => {
                                    handleRadioChange(0)
                                    SetCurrentSettings({height:9,width:9,mines:10})
                                    }}/>
                                <label htmlFor="game1">Beginner</label>
                            </td>
                            <td>9</td>
                            <td>9</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>
                                <input type="radio" id="game2" name="game" checked={currentRadio === 1} onChange={() => {
                                    handleRadioChange(1)
                                    SetCurrentSettings({height:16,width:16,mines:40})
                                    }}/>
                                <label htmlFor="game2">Intermediate</label>
                            </td>
                            <td>16</td>
                            <td>16</td>
                            <td>40</td>
                        </tr>
                        <tr>
                            <td>
                                <input type="radio" id="game3" name="game" checked={currentRadio === 2} onChange={() => {
                                    handleRadioChange(2)
                                    SetCurrentSettings({height:16,width:30,mines:99})
                                    }}/>
                                <label htmlFor="game3">Expert</label>
                            </td>
                            <td>16</td>
                            <td>30</td>
                            <td>99</td>
                        </tr>
                        <tr>
                            <td>
                                <input type="radio" id="game4" name="game" checked={currentRadio === 3} onChange={() => {
                                    handleRadioChange(3)
                                    SetCurrentSettings({height:heightNum,width:widthNum,mines:minesNum})
                                    }}/>
                                <label htmlFor="game4">Custom</label>
                            </td>
                            <td>
                                <input
                                    type={"number"}
                                    style={{width:'2rem'}}
                                    min={3} max={99}
                                    value={heightNum}
                                    onChange={handleChangeHeight}
                                    onClick={() => handleRadioChange(3)}
                                />
                            </td>
                            <td>
                                <input
                                    type={"number"}
                                    style={{width:'2rem'}}
                                    min={3} max={99}
                                    value={widthNum}
                                    onChange={handleChangeWidth}
                                    onClick={() => handleRadioChange(3)}
                                />
                            </td>
                            <td>
                                <input
                                    type={"number"}
                                    style={{width:'3rem'}}
                                    min={1} max={widthNum * heightNum - 1}
                                    value={minesNum}
                                    onChange={handleChangeMines}
                                    onClick={() => handleRadioChange(3)}
                                />
                            </td>
                        </tr>
                    </table>
                    <input id="FormSubmit" type="submit" value="Submit" onSubmit={event => {
                    event.preventDefault()
                    setHeight(currentSettings.height)
                    setWidth(currentSettings.width)
                    setBombs(currentSettings.mines)
                    setPopUp(!popUp)
                    dispatch(setGrid())
                }}/>
                </form>
                <img id="redX" src="https://findicons.com/files/icons/766/base_software/128/close_box_red.png" onClick={()=>setPopUp(!popUp)}/>            
            </div>
            <img id="SettingsIMG" src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png" onClick={()=>setPopUp(!popUp)}/>
        </div>
    )
}