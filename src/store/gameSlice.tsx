import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface SquareState {
    flagged:boolean,
    hidden:boolean,
    value:number
}

 interface GameState {
    grid:SquareState[][],
    height:number,
    width:number,
    bombs:number,
    gameover:{value:boolean,row:number,col:number,won:boolean},
    gamestart:boolean
    remaining:number
}

const initialState:GameState = {
    grid:[],
    height:16,
    width:16,
    bombs:40,
    gameover:{value:false,row:0,col:0,won:false},
    gamestart:false,
    remaining:0
}

export const gameSlice = createSlice({
    name:'game',
    initialState,
    reducers: {
        setHeight:(state,value:PayloadAction<number>) => {
            state.height = value.payload
        },
        setWidth:(state,value:PayloadAction<number>) => {
            state.width = value.payload
        },
        setBombs:(state,value:PayloadAction<number>) => {
            state.bombs = value.payload
        },
        setGrid:(state) => {
            state.grid = Array.from({length:state.height},()=> (Array.from({length:state.width},() => ({flagged:false,hidden:true,value:0}))))
            state.gameover.value = false
            state.gameover.won = false
            state.gamestart = false
            state.remaining = state.height * state.width - state.bombs

            let i = state.bombs
            let free:number[][] = new Array //Store all the available squares in an array 
                    state.grid.forEach((element,indexRow) => element.forEach((square,indexCol) => {
                        if(state.grid[indexRow][indexCol].value >= 0) {
                            free = [...free,[indexRow,indexCol]]
                        }
                    }))
            while(i) { //Loop to get i number of mines
                const randomSquare = Math.floor(Math.random() * (free.length - 1))
                const randomRow = free[randomSquare][0]
                const randomCol = free[randomSquare][1]
                free = [...free.slice(0,randomSquare),...free.slice(randomSquare+1)]
                state.grid[randomRow][randomCol].value -= 10
                if(randomRow === 0) { //If the mine is placed on the top row
                    state.grid[randomRow + 1][randomCol].value++
                    if(randomCol !== state.width - 1) { //If the mine is not on the right column
                        state.grid[randomRow][randomCol + 1].value++
                        state.grid[randomRow + 1][randomCol + 1].value++
                    }
                    if(randomCol !== 0) { //If the mine is not on the left column
                        state.grid[randomRow][randomCol - 1].value++
                        state.grid[randomRow + 1][randomCol - 1].value++
                    }
                }
                else if(randomRow === state.height - 1) { //If the mine is on the bottom row
                    state.grid[randomRow - 1][randomCol].value++
                    if(randomCol !== state.width - 1) { //If the mine is not on the right column
                        state.grid[randomRow][randomCol + 1].value++
                        state.grid[randomRow - 1][randomCol + 1].value++
                    }
                    if(randomCol !== 0) { //If the mine is not on the left column
                        state.grid[randomRow][randomCol - 1].value++
                        state.grid[randomRow - 1][randomCol - 1].value++
                    }
                }
                else { //If the mine is not on the bottom or top row
                    state.grid[randomRow + 1][randomCol].value++
                    state.grid[randomRow - 1][randomCol].value++
                    if(randomCol !== state.width - 1) { //If the mine is not on the right column
                        state.grid[randomRow][randomCol + 1].value++
                        state.grid[randomRow - 1][randomCol + 1].value++
                        state.grid[randomRow + 1][randomCol + 1].value++
                    }
                    if(randomCol !== 0) { //If the mine is not on the left column
                        state.grid[randomRow][randomCol - 1].value++
                        state.grid[randomRow - 1][randomCol - 1].value++
                        state.grid[randomRow + 1][randomCol - 1].value++
                    }
                }
                i--
            }
        },
        startGame:(state,coordinates:PayloadAction<{row:number,col:number}>) => { //On first click of the game, the first square cannot be a mine
            state.gamestart = true
            state.gameover.value = false
            const row = coordinates.payload.row
            const col = coordinates.payload.col
            let counter:number = 0 //stores the number of mines removed from the starting and surrounding squares
            let local:number[][] = [] //stores the surrounding squares in an array

            const getLocal = (inputRow:number, inputCol:number) => { //function to get starting square and squares surrounding
                local = [...local,[inputRow,inputCol]]
                if(inputRow === 0) { //If the square is on the top row
                    local = [...local,[inputRow+1,inputCol]]
                    if(inputCol !== state.width - 1) { //If the square is not on the right column
                        local = [...local,[inputRow,inputCol+1]]
                        local = [...local,[inputRow+1,inputCol+1]]
                    }
                    if(inputCol !== 0) { //If the square is not on the left column
                        local = [...local,[inputRow,inputCol-1]]
                        local = [...local,[inputRow+1,inputCol-1]]
                    }
                }
                else if(inputRow === state.height - 1) { //If the square is on the bottom row
                    local = [...local,[inputRow-1,inputCol]]
                    if(inputCol !== state.width - 1) { //If the mine is not on the right column
                        local = [...local,[inputRow,inputCol+1]]
                        local = [...local,[inputRow-1,inputCol+1]]
                    }
                    if(inputCol !== 0) { //If the square is not on the left column
                        local = [...local,[inputRow,inputCol-1]]
                        local = [...local,[inputRow-1,inputCol-1]]
                    }
                }
                else { //If the square is not on the bottom or top row
                    local = [...local,[inputRow+1,inputCol]]
                    local = [...local,[inputRow-1,inputCol]]
                    if(inputCol !== state.width - 1) { //If the square is not on the right column
                        local = [...local,[inputRow,inputCol+1]]
                        local = [...local,[inputRow-1,inputCol+1]]
                        local = [...local,[inputRow+1,inputCol+1]]
                    }
                    if(inputCol !== 0) { //If the square is not on the left column
                        local = [...local,[inputRow,inputCol-1]]
                        local = [...local,[inputRow-1,inputCol-1]]
                        local = [...local,[inputRow+1,inputCol-1]]
                    }
                }
                if(state.height * state.width - state.bombs < local.length) {    
                    while(state.height * state.width - state.bombs < local.length) { //If there are more mines that overlap into the surrounding tiles, randomly remove the surrounding squares
                        const random = Math.floor(Math.random() * (local.length - 1))
                        local = [...local.slice(0,random + 1),...local.slice(random+2)]
                    }
                }
            }

            const removeMine = (inputRow:number, inputCol:number) => { //remove the mine and increment all surrounding squares by one
                if(state.grid[inputRow][inputCol].value < 0) { //If the square value is negative remove the mine
                    state.grid[inputRow][inputCol].value += 10
                    if(inputRow === 0) { //If the mine is placed on the top row
                        state.grid[inputRow + 1][inputCol].value--
                        if(inputCol !== state.width - 1) { //If the mine is not on the right column
                            state.grid[inputRow][inputCol + 1].value--
                            state.grid[inputRow + 1][inputCol + 1].value--
                        }
                        if(inputCol !== 0) { //If the mine is not on the left column
                            state.grid[inputRow][inputCol - 1].value--
                            state.grid[inputRow + 1][inputCol - 1].value--
                        }
                    }
                    else if(inputRow === state.height - 1) { //If the mine is on the bottom row
                        state.grid[inputRow - 1][inputCol].value--
                        if(inputCol !== state.width - 1) { //If the mine is not on the right column
                            state.grid[inputRow][inputCol + 1].value--
                            state.grid[inputRow - 1][inputCol + 1].value--
                        }
                        if(inputCol !== 0) { //If the mine is not on the left column
                            state.grid[inputRow][inputCol - 1].value--
                            state.grid[inputRow - 1][inputCol - 1].value--
                        }
                    }
                    else { //If the mine is not on the bottom or top row
                        state.grid[inputRow + 1][inputCol].value--
                        state.grid[inputRow - 1][inputCol].value--
                        if(inputCol !== state.width - 1) { //If the mine is not on the right column
                            state.grid[inputRow][inputCol + 1].value--
                            state.grid[inputRow - 1][inputCol + 1].value--
                            state.grid[inputRow + 1][inputCol + 1].value--
                        }
                        if(inputCol !== 0) { //If the mine is not on the left column
                            state.grid[inputRow][inputCol - 1].value--
                            state.grid[inputRow - 1][inputCol - 1].value--
                            state.grid[inputRow + 1][inputCol - 1].value--
                        }
                    }
                    counter++
                }
            }
            
            const addMine = () => { //after removing mines from the starting square and surrounding tiles, add the mines back onto the board
                let free:number[][] = new Array //find all squares not surrounding the starting square to add mines back to
                    state.grid.forEach((element,indexRow) => element.forEach((square,indexCol) => {
                        if(state.grid[indexRow][indexCol].value >= 0 && !local.some(element => element[0] === indexRow && element[1] === indexCol)) {
                            free = [...free,[indexRow,indexCol]]
                        }
                    }))
                while(counter) {
                    const randomSquare = Math.floor(Math.random() * (free.length - 1))
                    const randomRow = free[randomSquare][0]
                    const randomCol = free[randomSquare][1]
                    free = [...free.slice(0,randomSquare),...free.slice(randomSquare+1)]
                    state.grid[randomRow][randomCol].value -= 10
                    if(randomRow === 0) { //If the mine is placed on the top row
                        state.grid[randomRow + 1][randomCol].value++
                        if(randomCol !== state.width - 1) { //If the mine is not on the right column
                            state.grid[randomRow][randomCol + 1].value++
                            state.grid[randomRow + 1][randomCol + 1].value++
                        }
                        if(randomCol !== 0) { //If the mine is not on the left column
                            state.grid[randomRow][randomCol - 1].value++
                            state.grid[randomRow + 1][randomCol - 1].value++
                        }
                    }
                    else if(randomRow === state.height - 1) { //If the mine is on the bottom row
                        state.grid[randomRow - 1][randomCol].value++
                        if(randomCol !== state.width - 1) { //If the mine is not on the right column
                            state.grid[randomRow][randomCol + 1].value++
                            state.grid[randomRow - 1][randomCol + 1].value++
                        }
                        if(randomCol !== 0) { //If the mine is not on the left column
                            state.grid[randomRow][randomCol - 1].value++
                            state.grid[randomRow - 1][randomCol - 1].value++
                        }
                    }
                    else { //If the mine is not on the bottom or top row
                        state.grid[randomRow + 1][randomCol].value++
                        state.grid[randomRow - 1][randomCol].value++
                        if(randomCol !== state.width - 1) { //If the mine is not on the right column
                            state.grid[randomRow][randomCol + 1].value++
                            state.grid[randomRow - 1][randomCol + 1].value++
                            state.grid[randomRow + 1][randomCol + 1].value++
                        }
                        if(randomCol !== 0) { //If the mine is not on the left column
                            state.grid[randomRow][randomCol - 1].value++
                            state.grid[randomRow - 1][randomCol - 1].value++
                            state.grid[randomRow + 1][randomCol - 1].value++
                        }
                    }
                    counter--
                }
            }
            getLocal(row,col)
            local.forEach(element => removeMine(element[0],element[1]))
            addMine()
        },
        clickSquare:(state,coordinates:PayloadAction<{row:number,col:number}>) => {
            if(state.grid[coordinates.payload.row][coordinates.payload.col].value > 0) { //If the hidden square clicked is has a bomb surrounding it
                state.grid[coordinates.payload.row][coordinates.payload.col].hidden = false
                state.remaining--
                if(state.remaining ===0) {
                    state.gameover.won = true
                    state.gameover.value = true
                }
            }
            else if(state.grid[coordinates.payload.row][coordinates.payload.col].value === 0) { //If the hidden square clicked does not have a bomb around it
                const click = (row:number,col:number) => { //helper function to recursively show all hiddens squares until bombs are found
                    if(state.grid[row][col].value === 0 && state.grid[row][col].hidden === true && state.grid[row][col].flagged === false) { //if the square does not have any bombs near it recursive call on squares adjacent
                        state.remaining--
                        if(state.remaining ===0) {
                            state.gameover.won = true
                            state.gameover.value = true
                        }
                        state.grid[row][col].hidden = false
                        if(row === 0) { //If the square is on the top row
                            click(row + 1, col)
                            if(col !== 0) { //If the square is not on the left column
                                click(row + 1, col - 1)
                                click(row, col - 1)
                            }
                            if(col !== state.width - 1) { //If the square is not on the right column
                                click(row + 1, col + 1)
                                click(row, col + 1)
                            }
                        }
                        else if(row === state.height - 1) { //If the square on the bottom row
                            click(row - 1, col)
                            if(col !== 0) { //If the square is not on the left column
                                click(row - 1, col - 1)
                                click(row, col - 1)
                            }
                            if(col !== state.width - 1) { //If the square is not on the right column
                                click(row - 1, col + 1)
                                click(row, col + 1)
                            }
                        }
                        else { //else the square is not on the top or bottom row
                            click(row + 1, col)
                            click(row - 1, col)
                            if(col !== 0) { //If the square is not on the left column
                                click(row + 1, col - 1)
                                click(row - 1, col - 1)
                                click(row, col - 1)
                            }
                            if(col !== state.width - 1) { //If the square is not on the right column
                                click(row + 1, col + 1)
                                click(row - 1, col + 1)
                                click(row, col + 1)
                            }
                        }
                    }
                    else if(state.grid[row][col].value > 0 && state.grid[row][col].hidden === true && state.grid[row][col].flagged === false) { //If the square is bordering a bomb, no recursive call
                        state.grid[row][col].hidden = false
                        state.remaining--
                        if(state.remaining ===0) {
                            state.gameover.won = true
                            state.gameover.value = true
                        }

                    }
                }
                click(coordinates.payload.row,coordinates.payload.col)
            }
            else { //If a mine is revealed, reveal all bombs on the screen
                state.gameover.value = true
                state.gameover.row = coordinates.payload.row
                state.gameover.col = coordinates.payload.col
                state.grid.forEach(row => row.forEach(square => {
                    if(square.value < 0) {
                        square.hidden = false
                    }
                }))
            }
        },
        flagSquare:(state,coordinates:PayloadAction<{row:number,col:number}>) => {
            state.grid[coordinates.payload.row][coordinates.payload.col].flagged = !state.grid[coordinates.payload.row][coordinates.payload.col].flagged
        }
    }
})

export const { setHeight, setWidth, setBombs, setGrid, startGame, clickSquare, flagSquare } = gameSlice.actions

export const selectGame = (state:RootState) => state.game

export const selectGrid = (state:RootState) => state.game.grid

export const selectRemainder = (state:RootState) => state.game.remaining

export const selectGameover = (state:RootState) => state.game.gameover

export const selectGamestart = (state:RootState) => state.game.gamestart