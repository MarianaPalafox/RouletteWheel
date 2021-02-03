import React, { useState } from "react";
import { Button,  DialogContent, Grid, Paper, Dialog, DialogTitle, TextField, Typography } from "@material-ui/core";
import { Formik } from "formik";
import { SketchPicker } from 'react-color';
import ParticlesBg from "particles-bg";
import { Wheel } from 'react-custom-roulette';

const RouletteWheel = () => {
    const [options,setOptions] = useState([{ option: '1', style: { backgroundColor: '#baf2d8', textColor: 'black' } },{ option: '2', style: { backgroundColor: '#bad7f2' } },{ option: '3' , style: { backgroundColor: '#f2bac9' } },{ option: '4' , style: { backgroundColor: '#f2e2ba' } }])
    const defaultOption = {option: "", style: {backgroundColor: "gray", textColor: 'black'}};
    const [option,setOption] = useState(null);
    const [spin,setSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    let config = {
        num: [4, 7],
        rps: 0.1,
        radius: [5, 40],
        life: [1.5, 3],
        v: [2, 3],
        tha: [-40, 40],
        alpha: [0.6, 0],
        scale: [.1, 0.4],
        position: "all",
        color: ["#baf2d8", "#bad7f2", "#f2bac9", "#f2e2ba"],
        cross: "dead",
        random: 15
      };
    const getSpinning = () => {
        const newPrizeNumber = Math.floor(Math.random() * options.length)
        setPrizeNumber(newPrizeNumber)
        setSpin(true);
    }
    console.log("Spin",spin)
    console.log("Prize",prizeNumber)
    return (
        <>
            <ParticlesBg type="custom" config={config} bg={true}/>
            <Grid container spacing={2} style={{padding: 15}}>
                <Grid item xs={12} sm={3}>
                    <Paper style={{padding:15}}>      
                        <div style={{maxHeight:"calc(80vh - 100px)", overflowY: "scroll"}}>         
                        {
                            options.map((o,i) => (
                                <div className="option_grid" key={i} onClick={() => setOption(o)}>
                                    <div className="color" style={{background: o.style ? o.style.backgroundColor : "gray"}}/>
                                    <div className="label">
                                        {o.option}
                                    </div>
                                </div>
                            ))
                        }  
                        </div>     
                    <Button variant="contained" color="secondary" onClick={() => setOption(defaultOption)}>+</Button>                  
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                <center>
                    <Button variant="contained" color="primary" onClick={() => getSpinning()}>Spin!</Button>
                    <Wheel mustStartSpinning={spin} priceNumber={prizeNumber} data={options} onStopSpinning={() => setSpin(false)} innerBorderWidth={1}/>             
                </center>
                </Grid>
            </Grid>
            <Dialog open={option !== null} onClose={() => setOption(null)} maxWidth="sm" fullWidth>
                <DialogTitle>Add new color</DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={{...option}}
                        validate={values => {
                            const errors = {}
                            if(values.option === ""){
                                errors.option = "Required";
                            }
                            return errors;
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            const newOptions = options;
                            console.log("Option",option)
                            if(option === defaultOption){
                                newOptions.push(values);
                                setOptions(newOptions);
                            } else {
                                newOptions[options.indexOf(option)] = values;
                                setOptions(newOptions);
                            }
                            
                            setTimeout(() => {
                                setSubmitting(false);
                                setOption(null)
                            },500)
                        }}>
                        {
                            ({values,errors,touched,handleChange,handleBlur,handleSubmit,isSubmitting,setFieldValue}) => (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                        label="New Option"
                                        name="option"
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.option}
                                        error={errors.option !== undefined && errors.option !== ""}
                                        helperText={errors.option}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6">Background Color</Typography>
                                        <SketchPicker color={values.style.backgroundColor} onChangeComplete={color => setFieldValue("style['backgroundColor']",color.hex)}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6">Text Color</Typography>
                                        <SketchPicker color={values.style.textColor} onChangeComplete={color => setFieldValue("style['textColor']",color.hex)}/>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container direction="row" justify="flex-end" alignItems="center">
                                            <Button variant="contained" color="secondary" onClick={() => setOption(null)}>Cancel</Button>
                                            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={isSubmitting} style={{marginLeft:10}}>Add</Button>
                                        </Grid>
                                    </Grid>                                
                                </Grid>
                            )
                        }
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default RouletteWheel

