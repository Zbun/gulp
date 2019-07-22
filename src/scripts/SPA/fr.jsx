import React, { Component } from 'react';
import { render } from 'react-dom';

// var myDivElement = <div className="foo" >好的呢</div>;
class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
render(<HelloMessage name="Chao4" />, document.getElementById('app')); 