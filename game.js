'use strict'
const c =console.log

class GameAbstract{
    constructor(size){
        this.size=size
        this.interface = new InterfaceGame()  
        document.addEventListener('keydown',(e)=> this.move(e))
    }
    start(){
        this.interface.render()
        this.interface.createTile(0,3,2)
        this.interface.createTile(1,3,4)
        this.interface.createTile(2,3,2)
        this.interface.createTile(3,3,8)
        c(this.interface.tiles)
        
        //this.interface.genRndTile()
       
    }
    stop(){

    }
    move(e){
        const tiles = this.interface.tiles
        this.interface.moveTiles(e.key)
        this.interface.genRndTile()

    }

}



class InterfaceGame{
    constructor(rows=4){ 
        this.rows = rows
        this.collumns = this.rows
        this.totalTiles = this.rows * this.collumns,
        this.tiles=[],
        this.board = new Board(this.tiles,this.rows)
        
        
    }
    moveTiles(direction){
        
        switch (direction) {
            case 'ArrowLeft':{
                this.move('x-reverse')
                break;
            }
            case 'ArrowRight':{
                this.move('x')
                break;
            }
            case 'ArrowUp':{
                this.move('y-reverse')
                break;
            }
            case 'ArrowDown':{
                this.move('y')
                break;
            }
            default:
        }
     this.render()      
     
    }
    move(dir='x'){
        
        Array.prototype.getArrayTiles = function(pos='x'){
            switch(pos){
                case 'x':
                    return typeof this === 'object'  ? this.sort(compareX).map(obj => obj.value): this
                case 'y':
                    return typeof this === 'object'  ? this.sort(compareY).map(obj => obj.value): this
            } 

            function compareX(a,b){
                return a.x-b.x
            }
            function compareY(a,b){
                return a.y-b.y
            }
        }
        Array.prototype.reduceArray = function(reverse=false){
            let newArr = new Array()
            let isDouble = false
            
            if(typeof this === 'number'){return this}
            
            
            this.map((v,i,actArr)=>{
             
             if(v == actArr[i+1] && !isDouble) {
                newArr.push(v*2)
                isDouble = true
            }else{
                isDouble? '': newArr.push(v)
                isDouble= false
            }
            })
        return newArr.reverse()
        }
        Array.prototype.reduceArrayReverse = function(){
            let newArr = new Array()
            let isDouble = false
            
            if(typeof this === 'number'){return this}
            
            
            this.map((v,i,actArr)=>{
             
             if(v == actArr[i+1] && !isDouble) {
                newArr.unshift(v*2)
                isDouble = true
            }else{
                isDouble? '': newArr.unshift(v)
                isDouble= false
            }
        })
        return newArr.reverse()
        }
        Array.prototype.genTiles = function(pos='x',coord=0,max=3){
         const a = this
        
         switch (pos) {
             case 'x-reverse':
                 return this.map((v,i,a) => {return {x: i, y:coord, value: v}})
             case 'x':
                return this.map((v,i,a) =>  {return {x:max-i, y:coord, value: v}})
             case 'y-reverse':
                 return this.map((v,i,a) => {return {y:i, x:coord, value: v}})
             case 'y':
                return this.map((v,i,a) =>  {return {y:max-i, x:coord, value: v}})
             default:
                 throw new Error('You must select a valid postion')
         }
         
        
      

        }
        Array.prototype.mergeDedupe = function () {
         return [...new Set([].concat(...this))];
         }
        
        if(dir !='x' && dir !='y' && dir!='x-reverse' && dir!='y-reverse'){
            throw new Error('You must select x or y')
        }
        let tiles= new Array()
        const isReverse= dir.split('-')[1] == 'reverse' ? true : false
        const pos = dir.split('-')[0]
        switch(pos){
            case 'x':
                for(let i=0 ; i<this.rows; i++){
                let input =this.tiles.filter(tile => tile.y ==i)
                .getArrayTiles(pos)
                input = isReverse? input.reduceArrayReverse().genTiles(dir,i) : input.reduceArray().genTiles(dir,i)
                //.reduceArray(isReverse).genTiles(dir,i)
                tiles.push(input)
                }
                break;
            
            case 'y':
                for(let i=0 ; i<this.rows; i++){
                    let input =this.tiles.filter(tile => tile.x ==i)
                    .getArrayTiles(pos)
                    input = isReverse? input.reduceArrayReverse().genTiles(dir,i) : input.reduceArray().genTiles(dir,i)
                    //.reduceArray(isReverse).genTiles(dir,i)
                    tiles.push(input)
                    }
                break;
        }
        
        this.tiles = tiles.mergeDedupe()
        
       
        
        this.render()
    }
    createTile(x,y,value=''){
        const newTile =  {
            x:x,
            y:y,
            value: value,
        }      
        this.setTile(newTile)     
    }
    render(){    
       this.board.render(this.tiles)
    }
    genRndTile(){
        const rndX = getRnd(0,this.rows)
        const rndY = getRnd(0,this.rows)
        const rndV = getRnd(1,2)*2
        const tileIsClean = this.tiles.filter(tile=> tile.x == rndX && tile.y == rndY).length==0? true : false
        tileIsClean ? this.createTile(rndX,rndY,rndV) : this.tiles.filter(tile=> tile.value>0).length<this.totalTiles? this.genRndTile() :''
       
        function getRnd (min=0,max){
           return  Math.floor(Math.random() * max) + min
        }
    }
    setTile(tile){
        this.tiles = [...this.tiles, tile]
        this.render()
    }
}

class Board{
    constructor(tiles=[],rows=4){
        this.tiles = tiles
        this.rows = rows
        this.grid =  document.getElementsByClassName('grid')[0]
        this.render()
        this.count =0
 
    }
    render(tiles=this.tiles){
       this.clearBoard() 
        try {
             for(let i=0; i< this.rows; i++){
                for(let j=0; j<this.rows;j++){  
                    if(tiles.length>0){
                        const tilesFiltered = tiles.filter(t=> t.x ==j && t.y==i)
                        tilesFiltered.length>0? tilesFiltered.map(tile => this.setTile(tile.value)) : this.setTile()
                       //tiles.forEach(tile=> tile.x == i && tile.y== j? this.setTile(tile.value) : '')
                        //this.setTile()
                       
                    }else{
                        this.setTile()
                    }
            }
        }
        } catch (e) {
            console.error(e) 
        }
       
    }
    setTile(value=''){
    
        this.count+=1
        const newTile = document.createElement('tile')
        const text = document.createTextNode('2048')
        newTile.append(value)
        const style = value?  'tile-full' :'tile-empty'
        newTile.classList.add(style)
        this.grid.append(newTile)

    }
    clearBoard(){
        while(this.grid.firstChild){
            this.grid.removeChild(this.grid.firstChild)            
        }
    


    }
}

//Teste Board
//const board  = new Board([{x:3, y :2,value: 2046}])
//const board = new Board()
//console.log(board.tiles)

//Teste Interface 
// const i  = new InterfaceGame(4);
 //i.genRndTile();i.genRndTile();i.genRndTile();i.genRndTile()
 //i.genRndTile();i.genRndTile();i.genRndTile();i.genRndTile()
  //i.move()

//Teste Game
const g = new GameAbstract()
g.start()







