import React from 'react';
import ReactDOM from 'react-dom';
import CanvasDraw from "react-canvas-draw";
import * as tf from "@tensorflow/tfjs";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.canvas = React.createRef();
        this.state = {
            predicted: null,
            model: null
        };

        tf.loadLayersModel('/dm/model.json').then((model)=>{
            this.setState({model});
        });

    }
    componentDidMount() {
    }

    render() {

        let predict = (input)=>{
            this.state.model.predict([tf.tensor(input).reshape([1, 28, 28, 1])]).array().then((scores)=>{
                scores = scores[0];
                let predicted = scores.indexOf(Math.max(...scores));
                this.setState({predicted});
            });
        }

        let clearDrawing = ()=>{
            console.log(this.canvas);
            this.canvas.current.clear();
            this.setState({predicted: ''});
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

        const canvasStyle = {
            border: '1px solid red',
            width: '200px',
            height: '300px'
        };
        const resultsStyle = {
            border: '1px solid blue',
            fontSize: '120px',
            width: '200px',
            height: '200px'
        };
        const clearStyle = {
            fontSize: '35px'
        };
        return <div className="App">
            <CanvasDraw
                style={canvasStyle}
                ref={this.canvas}
                onChange={myOnChange}
                canvasWidth={200}
                canvasHeight={300}
            />
            <div style={resultsStyle}>{this.state.predicted}</div>
            <button
                style={clearStyle}
                onClick={clearDrawing}
            >clear
            </button>
        </div>;
    }
}


ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}