if(Meteor.isCordova){
import worker from '../core/worker';

window.worker = worker;
const getInfo = chrome.system.cpu.getInfo;

var timer;
var plugin = cordova.plugins.backgroundMode; 

const onModeActivated = () => {
  const cpuThreshold = 0.7;
  var counter = 0;
  let usage = 0;
  plugin.disableWebViewOptimizations();
  console.log(typeof window.addEventListener);
  window.addEventListener("batterylow",(s)=>clearInterval(timer),false);
  timer = setInterval(function () {
    counter++;

    console.log('Running since ' + counter + ' sec');
    // socket.doSend('Running since ' + counter + ' sec');

    // cordova.plugins.notification.badge.set(counter);

    
      getInfo(cpuInfo => {
        let sw = usage < cpuThreshold;
        usage = cpuInfo.processors.map(x=>x.usage.idle/x.usage.total).reduce((a,b)=>a+b)/cpuInfo.processors.length;
        sw = sw ^ (usage<cpuThreshold);
        if(sw) counter = 0;
        if(usage < 0.7){
          worker.start();
          plugin.configure({
            text: `Running since ${counter} sec, cpu: ${Math.round(usage*100)}%`
          });
        } else {
          worker.pause();
          plugin.configure({
            text: `Idle since ${counter} sec, cpu: ${Math.round(usage*100)}%`
          });
        }
      });

      if (navigator.vibrate) {
        navigator.vibrate(300);
      }
    


  }, 1000);
}
// Reset badge once deactivated
const onModeDeactivated = () => {
  //cordova.plugins.notification.badge.clear();
  clearInterval(timer);
}

const onModeEnabled = () => {
  //var btn = document.getElementById('mode');
  //app.setButtonClass(btn, true);
  //cordova.plugins.notification.badge.registerPermission();
}

const onModeDisabled = () => {
  //var btn = document.getElementById('mode');
  //app.setButtonClass(btn, false);
}

export { onModeDisabled, onModeEnabled, onModeDeactivated, onModeActivated };
}