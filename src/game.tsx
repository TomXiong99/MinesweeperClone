import React, { useEffect } from "react"
import type { RootState } from "./store/store"
import type { SquareState } from "./store/gameSlice"
import { useAppDispatch,useAppSelector } from "./store/hooks"
import { setGrid, startGame, clickSquare, selectGrid, selectRemainder, selectGameover, selectGamestart, flagSquare } from './store/gameSlice'
import { GameSettings } from "./gameSettings"
import './style/game.scss'



const Square = (props:{row:number,col:number}) => {
    const grid = useAppSelector(selectGrid)
    const gameover = useAppSelector(selectGameover)
    const gamestart = useAppSelector(selectGamestart)
    const dispatch = useAppDispatch()

    if(grid[props.row][props.col].hidden === false) {
        if(grid[props.row][props.col].value >= 0) {
            return (
                <div className="GameSquare">
                    <div className={`GameSquare${grid[props.row][props.col].value}`}>
                        {grid[props.row][props.col].value > 0 && grid[props.row][props.col].value}
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className={ /*If the mine is the one that was clicked on, it will display a red background, or if */
                    props.row === gameover.row && props.col === gameover.col ? "GameoverSquare" : 'GameSquare'}> 
                    <img className="GameSquareBomb" src="https://inotgo.com/imagesLocal/202108/03/20210803020506364t_3.png"/>
                </div>
            )
        }
    }

    if(grid[props.row][props.col].flagged === true) { 
        return (
            <div className="GameSquare"
            onContextMenu={(e)=>{!gameover.value && dispatch(flagSquare({row:props.row,col:props.col}))}}>
                {!gameover.value && <img className="GameSquareFlag" src="https://inotgo.com/imagesLocal/202108/03/20210803020506364t_4.png"/>}
                {gameover.value && grid[props.row][props.col].flagged && <div className="IncorrectFlagLeft"/>}
                {gameover.value && grid[props.row][props.col].flagged && <img className="GameSquareBomb" src="https://inotgo.com/imagesLocal/202108/03/20210803020506364t_3.png"/>}
                {gameover.value && grid[props.row][props.col].flagged && <div className="IncorrectFlagRight"/>}
            </div>
        )
    }

    if(grid[props.row][props.col].hidden === true) {
        return (
            <div className="GameSquare"            
            onClick={() => {
                !gamestart && dispatch(startGame({row:props.row,col:props.col}))
                !gameover.value && dispatch(clickSquare({row:props.row,col:props.col}))
            }}
            onContextMenu={(e)=>{                
                !gameover.value && dispatch(flagSquare({row:props.row,col:props.col}))
                }}>
                    <div className="GameSquareHidden">
                    </div>
            </div>
        )
    }

    if(grid[props.row][props.col].value < 0) {
        return (
            <div className="GameSquare">
                {'B'}
            </div>
        )
    }
        
    return (
        <div className="GameSquare">
            {grid[props.row][props.col].value}
        </div>
    )
}



const GameRow = (props:{squares:SquareState[],row:number}) => {
    return (
        <div className="GameRow">
            {props.squares.map((element,index) => <Square row={props.row} col={index}/>)}
        </div>
    )
}



const Game = () => {
    const dispatch = useAppDispatch()
    const grid = useAppSelector(selectGrid)
    const gameover = useAppSelector(selectGameover)
    

    const GameElement = (grid.map((element,index) => { //An array of the rows as GameRow elements
        return (
            <GameRow squares={element} row={index}/>
        )
    }))

   
    useEffect(() => {//On first load, create a board
        dispatch(setGrid())
    },[])
    
    return (
        <div id="Game" onContextMenu={(event) => event.preventDefault()}>            
            <GameSettings/>
            <div id="Win">
                <div id="Won">
                {gameover.won ? "Congrats, You Did It!" : gameover.value && "Game Over!"}
                </div>                
            </div>
            {GameElement}
            
        </div>
    )

}

export default Game