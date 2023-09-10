let canvas=document.querySelector(".canvas")
canvas.width = innerWidth 
canvas.height = innerHeight
let client = {}
let ctx=canvas.getContext("2d")
let mouseDownC = false
let initForce = {}
let lastForce = {}

function Player(position){
    this.position = position
    this.radius = 20
    this.velocity_x = 0
    this.velocity_y = 10
    this.multiplier = 2.5
    this.acc = 0.2
    this.catchArea =500
    let color_list = ["#4C4A59","#1B7F7A","#0897B4","#4CABA6","#F2CDAC"]
    this.color = color_list[Math.floor(4*Math.random())]

    this.show = function(){
        ctx.beginPath()
        ctx.fillStyle = this.color
        ctx.arc(this.position.x,this.position.y,this.radius,0,2*Math.PI,false)
        ctx.fill()
    }
    this.dist = function(x, y){
        let x_distance=Math.pow((this.position.x-x),2)
        let y_distance=Math.pow((this.position.y-y),2)
        return Math.sqrt(x_distance+y_distance)
    }
    this.incrementSpeed = function(){
        this.position.y+=this.velocity_y
        this.position.x+=this.velocity_x
        this.velocity_y+=this.acc 
    }
    this.checkboundary = function(){
        // floor checkboundary  
        if(this.position.y+this.radius>=innerHeight){
            this.velocity_y=-(this.velocity_y*0.7)
            if(this.velocity_y<4 && this.velocity_y>-4){
                this.velocity_y=0
            }
        }
        // upper roof boundaray
        if(this.position.y<this.radius){
            this.velocity_y=-(this.velocity_y*1.15)
        }
        // side checkboundary
        if(this.position.x+this.radius>=innerWidth || this.position.x<this.radius){
            this.velocity_x=-(this.velocity_x/1.25)
        }
    }
    this.rope = function(a,b){
        ctx.beginPath();
        ctx.moveTo(a,b);
        ctx.lineTo(this.position.x,this.position.y);
        ctx.closePath();
        ctx.stroke();
    }
}

let Player1 = new Player({x:innerWidth/2,y:100})
// force estimater
function force(initForce, lastForce){
    let forcex=Math.pow((lastForce.x-initForce.x),2)
    let forcey=Math.pow((lastForce.y-initForce.y),2)
    return {x:Math.sqrt(forcex),y:Math.sqrt(forcey)}
}
// Drag listener Code
function dragging(){
    addEventListener('mousedown', (e)=>{
        if (Player1.dist(e.clientX,e.clientY)<Player1.catchArea){
            client = {x: e.clientX, y : e.clientY}
            mouseDownC=true
        }
    })
    addEventListener('mousemove', (e)=>{
        if (mouseDownC==true){
            initForce = {x: Player1.position.x, y : Player1.position.y}
            client = {x: e.clientX, y : e.clientY}
        }
    })
    addEventListener('mouseup', (e)=>{
        mouseDownC=false
        lastForce = {x:e.clientX, y:e.clientY}
        if ((lastForce.x-initForce.x)<0){
            Player1.velocity_x=-(((force(initForce,lastForce).x)*Player1.multiplier)/100)
        }
        if ((lastForce.x-initForce.x)>0){
            Player1.velocity_x=(((force(initForce,lastForce).x)*Player1.multiplier)/100)
        }
        if ((lastForce.y-initForce.y)<0){
            Player1.velocity_y=-(((force(initForce,lastForce).y)*Player1.multiplier)/100)
        }
        if ((lastForce.y-initForce.y)>0){
            Player1.velocity_y=(((force(initForce,lastForce).y)*Player1.multiplier)/100)
        }
        initForce=0
        lastForce=0
        client = {}
    })
}
// main function
function loop(ctime){
    ctx.clearRect(0,0,innerWidth,innerHeight)
    Player1.incrementSpeed()
    Player1.checkboundary()
    Player1.rope(client.x,client.y)
    Player1.show()
    last = ctime
    requestAnimationFrame(loop)
}
loop()
dragging()