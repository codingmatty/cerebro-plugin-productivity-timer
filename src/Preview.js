import React, { PropTypes, Component } from 'react';


function pad(value) {
  return `00${value}`.substr(-2)
}

class Preview extends Component {
  constructor(props) {
    super(props);

    this.state = { time: props.getTime() };
  }

  componentDidMount() {
    const { getTime } = this.props;

    setInterval(() =>
      this.setState(() => ({
        time: getTime()
      })),
    1000);
  }

  render() {
    const { getPhase } = this.props;
    const { time } = this.state;

    const phase = getPhase();
    const minutes = pad(Math.floor(time / 60));
    const seconds = pad(Math.floor(time % 60));

    return (
      <div>
        <h1>Productivity Timer</h1>
        <h2>Current Phase</h2>
        <h3>{phase}</h3>
        <h2>Remaining Time</h2>
        <h3>{minutes}:{seconds}</h3>
      </div>
    );
  }
}


export default Preview;
