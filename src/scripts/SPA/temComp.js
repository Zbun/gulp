import React from 'react';

class HelloMessage extends React.Component {
  render() {
    return (
      <div className={this.props.cs} style={this.props.style}>
        Hello {this.props.name}
      </div>
    );
  }
}
export default HelloMessage;