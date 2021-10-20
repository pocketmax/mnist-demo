import React from 'react';
import ReactDOM from 'react-dom';
import CanvasDraw from "react-canvas-draw";
import * as tf from "@tensorflow/tfjs";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
        this.state = {
            results: {
                predicted: null,
                predictedScore: null,
                respTime: 0,
                classes: []
            },
            tolerance: 0.7,
            model: null
        };

        // TODO sync with component loading
        tf.loadLayersModel('./dm/model.json').then((model)=>{
            this.setState({model});
        });

    }
    componentDidMount() {
    }

    render() {
        let predict = (input)=>{
            let respTime =0;
            let interval = setInterval(() => {
                respTime++;
            }, 1);

            this.state.model.predict([tf.tensor(input).reshape([1, 28, 28, 1])]).array().then((scores)=>{
                clearInterval(interval);
                scores = scores[0];
                let predicted = scores.indexOf(Math.max(...scores));
                let predictedScore = scores[predicted];
                // this.setState({predicted});
                let results = {
                    predicted,
                    predictedScore,
                    respTime,
                    classes: scores
                };
                this.setState({results});
                console.log(results);
            });
        }

        let clearDrawing = ()=>{
            // console.log(this.canvas);
            this.canvas.current.clear();
            // this.setState({predicted: ''});
            this.setState({results: {
                    predicted: null,
                    respTime: 0,
                    classes: []
                }});
        };

        let myOnChange = (e)=>{

            console.log('myOnChange...');
            let img = new Image();
            img.onload = function() {
                let context = e.canvas.drawing.getContext('2d');
                context.drawImage(img, 0, 0, 28, 28);
                let imgData = context.getImageData(0, 0, 28, 28);
                let data = imgData.data;
                let input = [];
                for(let i = 0; i < data.length; i += 4) {
                    input.push(data[i + 2] / 255);
                }
                console.log('input...');
                predict(input);
            };
            img.src = e.canvas.drawing.toDataURL('image/png');
        };

        const appStyle = {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center'
        };

        const canvasStyle = {
            flex: 1,
            border: '1px solid red',
            height: '300px'
        };
        const resultsStyle = {
            border: '1px solid blue',
            fontSize: '12px',
            width: '200px',
            height: '200px'
        };
        const resultsGroupStyle = {
            display: 'flex',
            flexDirection: 'column'
        };
        const resultsItemStyle = {
            listStyleType: 'none',
            border: '1px solid green',
            fontSize: '12px',
        };
        const clearStyle = {
            fontSize: '35px',
            width: '100%'
        };
        const mainStyle = {
            border: '3px solid blue',
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '400px',
            width: '100%'
        };

        const descStyle = {
        overflowX: 'auto',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word'
        }

        let classes = [];
        let predicted = this.state.results.predicted;
        let predictedScore = this.state.results.predictedScore;
        let selected;
        this.state.results.classes.forEach((val, key)=>{
            if(key === predicted && Number(predictedScore) >= this.state.tolerance) {
                console.log(typeof predictedScore)
                console.log(predictedScore)
                console.log(typeof this.state.tolerance)
                console.log(this.state.tolerance)
                selected = {
                    fontWeight: 'bolder',
                    color: 'red'
                };
            } else {
                selected = {}
            }
            classes.push(<div style={{...selected, ...resultsItemStyle}} key={key}>{key} - {val}</div>);
        });

        return <div className="App" style={appStyle}>
            <div style={mainStyle}>
                <CanvasDraw
                    style={canvasStyle}
                    ref={this.canvas}
                    onChange={myOnChange}
                    lazyRadius={0}
                    canvasWidth={200}
                    canvasHeight={300}
                />
                <div style={{flex:1}}>
                    <button
                        style={clearStyle}
                        onClick={clearDrawing}
                    >clear
                    </button>
                    {!this.state.results.predicted &&
                        <div style={descStyle}>
                            Draw a digit on the left to see what the model guessed
                        </div>
                    }
                    {this.state.results.predicted &&
                        <div style={resultsStyle}>
                            <div style={resultsGroupStyle}>
                                {classes}
                                <div>resp: {this.state.results.respTime}ms tolerance: {this.state.tolerance}</div>
                            </div>
                        </div>
                    }
                    <a href="https://github.com/pocketmax/mnist-demo">github src</a>
                </div>
            </div>
        </div>;
    }
}


ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}