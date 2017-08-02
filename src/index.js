import Preview from './Preview';
import Stopwatch from './stopwatch';
import icons from './icons';


if (!Notification.permission) {
  Notification.requestPermission();
}

let theme = 'dark';
const name = 'Productivity Timer';
const keyword = 'Timer';
const icon = icons[theme].general;
const regex = new RegExp(`^(?:${name}|${keyword})\\s?(\\w+)?$`, 'i');


/* Configure Stopwatch */
let stopwatch = new Stopwatch();
let notification;
const stopwatchActions = {
  Start: () => {
    if (notification) {
      notification.close();
    }
    stopwatch.start();
  },
  Pause: () => stopwatch.stop(),
  Reset: () => {
    if (notification) {
      notification.close();
    }
    stopwatch.reset();
  }
}
stopwatch.on('complete', notifyOnComplete);
function notifyOnComplete(whichTimer) {
  const subtitle = (whichTimer === 'work')
    ? 'Click here to start the resting timer'
    : 'Click here to start the working timer';

  notification = new Notification('Productivity Timer Complete!', {
    body: subtitle,
    icon,
    image: icon,
    // tag: 'cerebro-productivity-timer',
    requireInteraction: true
  });

  notification.onclick = (e) => {
    e.preventDefault();
    stopwatch.start();
  };

  // setTimeout(() => notification.close(), 60 * 1000);
}
/* END */

function getPreview() {
  return (
    <Preview
      getTime={() => stopwatch.getRemainingTime()}
      getPhase={() => stopwatch.currentPhase}
    />
  );
}

function plugin({ term, display, actions, config, settings }) {
  theme = config.get('theme').includes('dark') ? 'dark' : 'light';

  const match = regex.exec(term);
  if (match) {
    const [, actionInput] = match;
    const displayArray = Object.keys(stopwatchActions)
      .filter((action) => !actionInput || action.toLowerCase().startsWith(actionInput))
      .map((action, i) => ({
        id: i.toString(),
        icon: icons[theme][action],
        title: `${name}: ${action}`,
        getPreview,
        onSelect() {
          stopwatchActions[action]();
        }
      }));
    display(displayArray);
  } else if (stopwatch.started) {
    // Display current productivity timer state
    display({
      id: 'default',
      icon: icons[theme].general,
      title: 'Current Productivity Timer',
      getPreview,
      onSelect(e) {
        e.preventDefault();
        actions.replaceTerm(`${name} `);
      }
    });
  }
}

const settings = {
  workTime: { type: 'number', defaultValue: 25, description: 'Work time interval' },
  restTime: { type: 'number', defaultValue: 5, description: 'Rest time interval' },
  autoContinue: { type: 'bool', defaultValue: false, description: 'Automatically start the next timer' }
};


export {
  icon,
  name,
  keyword,
  plugin as fn,
  settings
};
