import React, { useEffect, useState } from "react";
import { Button, Grid, Paper } from "@material-ui/core";

const RouletteWheel = () => {
    const [options,setOptions] = useState([{ option: '0', style: { backgroundColor: 'green', textColor: 'black' } },{ option: '1', style: { backgroundColor: 'yellow' } },{ option: '2' , style: { backgroundColor: 'blue' } }])
    var startAngle = 0;
    var arc = Math.PI / (options.length / 2);
    var spinTimeout = null;
    var spinTime = 0;
    var spinTimeTotal = 0;
    var spinAngleStart = 0;
    var ctx;
    
    useEffect(() => {
       drawRouletteWheel()
    })
    
    const rotateWheel = () => {
        spinTime += 30;
        if(spinTime >= spinTimeTotal) {
          stopRotateWheel();
          return;
        }
        var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        startAngle += (spinAngle * Math.PI / 180);
        drawRouletteWheel();
        spinTimeout = setTimeout(rotateWheel(), 30);
    }

    const stopRotateWheel = () => {
        clearTimeout(spinTimeout);
        var degrees = startAngle * 180 / Math.PI + 90;
        var arcd = arc * 180 / Math.PI;
        var index = Math.floor((360 - degrees % 360) / arcd);
        ctx.save();
        ctx.font = 'bold 30px Helvetica, Arial';
        var text = options[index].option
        ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
        ctx.restore();
    }
      
    const easeOut = (t, b, c, d) => {
        var ts = (t/=d)*t;
        var tc = ts*t;
        return b+c*(tc + -3*ts + 3*t);
    }

    const spin = () => {
        spinAngleStart = Math.random() * 10 + 10;
        spinTime = 0;
        spinTimeTotal = Math.random() * 3 + 4 * 1000;
        console.log(spinTimeTotal)
        rotateWheel();
    }

    const drawRouletteWheel = () => {
        var canvas = document.getElementById("canvas");
        if (canvas.getContext) {
          var outsideRadius = 200;
          var textRadius = 160;
          var insideRadius = 125;
      
          ctx = canvas.getContext("2d");
          ctx.clearRect(0,0,500,500);
      
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
      
          ctx.font = 'bold 12px Helvetica, Arial';
      
          for(var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            //ctx.fillStyle = colors[i];
            ctx.fillStyle = options[i].style.backgroundColor;
      
            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();
      
            ctx.save();
            ctx.shadowOffsetX = -1;
            ctx.shadowOffsetY = -1;
            ctx.shadowBlur    = 0;
            ctx.shadowColor   = "rgb(220,220,220)";
            ctx.fillStyle = "black";
            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                          250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i].option;
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
          } 
      
          //Arrow
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
          ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
          ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
          ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
          ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
          ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
          ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
          ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
          ctx.fill();
        }
      }

    return (
        <Grid container spacing={2} style={{padding: 15}}>
            <Grid item xs={12} sm={3}>
                <Paper style={{padding:15}}>                    
                    {
                        options.map((o,i) => (
                            <div className="option_grid" key={i}>
                                <div className="color" style={{background: o.style ? o.style.backgroundColor : "gray"}}/>
                                <div className="label">
                                    {o.option}
                                </div>
                            </div>
                        ))
                    }                    
                </Paper>
            </Grid>
            <Grid item xs={12} sm={9}>
            <center>
                <Button variant="contained" color="primary" onClick={() => spin(true)}>Spin!</Button>
                <canvas id="canvas" width="500" height="500"></canvas>                
            </center>
            </Grid>
        </Grid>
    );
}

export default RouletteWheel

