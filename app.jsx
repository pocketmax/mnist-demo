import React from 'react';
import ReactDOM from 'react-dom';
import CanvasDraw from "react-canvas-draw";
import * as tf from "@tensorflow/tfjs";

class MyResults extends React.Component {
    render() {
        const style = {
            border: '1px solid blue',
            width: '200px',
            height: '200px'
        };

        return <div style={style}>
            hello from results
        </div>;
    }
}

tf.loadLayersModel('/dm/model.json').then(function(model) {
    window.model = model;
    console.log('dm loaded!');
});

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
        console.log(input);
    };
    img.src = e.canvas.drawing.toDataURL('image/png');

    // console.log(e.ctx.drawing.canvas.getImageData);
};

let predict = function(input) {
    if (window.model) {
        window.model.predict([tf.tensor(input).reshape([1, 28, 28, 1])]).array().then(function(scores){
            scores = scores[0];
            let predicted = scores.indexOf(Math.max(...scores));
            // $('#number').html(predicted);
            console.log(predicted);
        });
    } else {
        // The model takes a bit to load, if we are too fast, wait
        setTimeout(function(){predict(input)}, 50);
    }
}

const App = () => (
    <div className="App">
        <h1 className="App-Title">Hello React</h1>
        <CanvasDraw
            onChange={myOnChange}
            canvasWidth={200}
            canvasHeight={300}
        />
        <MyResults></MyResults>
        <button>clear</button>
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

// Hot Module Replacement
if (module.hot) {
    module.hot.accept();
}