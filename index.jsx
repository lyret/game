import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Application extends Component {
        
    render() {
         return (
             <div>
                <h1>Test 2</h1>
             </div>
         );
    }
}

// Mount the document 
ReactDOM.render(<Application />, document.getElementById('game'));