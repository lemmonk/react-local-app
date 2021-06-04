import globals from '../globals';
import axios from 'axios';


export default function sendNotification(fullName) {


async function send() {

      const register = await navigator.serviceWorker.register('/sw.js',{
  scope: '/'
});


const permission = await notifyMe();

if(!permission)return;

const path = window.location.pathname !== '/chat';

if(path && navigator.vendor.includes('Apple')){
 
  alert(`You have a new direct message from ${fullName}.`);
  return;
}


const publicVapidKey = globals().vapid;

const converted = await urlBase64ToUint8Array(publicVapidKey);
const subscription = await register.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: converted
});


//trigger push notification on server

 const url = `${globals().socket}subscribe`;

 const input = {
   subscription: subscription,
   fullName: fullName
 }

    axios.post(url, { input })
    .then(res => {
     
    //  console.log(res.status);
      
    })
    .catch(err => {
      //silent error
      console.log(err);
    });

}


//check if notifications has been accepted, if not request permission
async function notifyMe() {

  if (!("Notification" in window)) {
    console.log("This browser does not support notification");
    return false;
  }


  if(Notification.permission === "granted"){
    return true;
  }

 
 if (Notification.permission !== 'denied' || Notification.permission === "default") {
   alert("You are currently receiving your first Locals direct message from another user. Allow for notifications in your browser settings to ensure you never miss important messages.")
    Notification.requestPermission(function (permission) {

      if (permission === "granted") {
        return true
      } else {
        return false;
      }
    });
  }
}



// base64
async function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


  return send();
}