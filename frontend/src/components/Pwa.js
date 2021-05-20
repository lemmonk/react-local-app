import React from 'react';
import AppleIcon from '@material-ui/icons/Apple';
import AndroidIcon from '@material-ui/icons/Android';

function Pwa() {

  const os = sessionStorage.getItem('locals-os');

  const ios = <div className='install-box'>
    <div className='pwa-icon'> <AppleIcon fontSize='large'/></div>
    <h3>iOS</h3>
    <p>1. Tap the share button (⏍) at the bottom of your mobile Safari browser.</p>

    <p>
    2. Scroll down till you see the title 'Add to Home Screen', tap it.
    </p>

    <p>
    3. A promted will open, select 'Add' from the top right corner.
    </p>

    <p>
    4. All done. You can now access Locals like any other app on your device.
    </p>

  </div>


const android = <div className='install-box'>
 <div className='pwa-icon'> <AndroidIcon fontSize='large'/></div>
    <h3>Android</h3>
    <p>1. Tap the more options button (:) in the top right corner of your mobile Chrome browser.</p>

    <p>
    2. Scroll down till you see the title 'Add to Home Screen', tap it.
    </p>

    <p>
    3. A promted will open, select 'Add'.
    </p>

    <p>
    4. All done. You can now access Locals like any other app on your device.
    </p>

  </div>

 
  return (
<section className="pwa-wrapper">

<div className='pwa-inner'>

<h1>Progressive Web App</h1>
<h3>Locals is a PWA.
  <br></br><br></br>
   In layman's terms this means you can quickly and easily install our mobile app onto your phone directly from this site.</h3>


{os === 'Android' ? android : ios}
{os === 'Android' ? ios : android}

<h1>Why a PWA?</h1>
<h3>There are many benifits to choosing to build a PWA instead of a more traditional app, including performance, ease of use, and accessability, but by and large the biggest reason is its ability to provide our customers with a fair and honest pricing model.  PWA's allow developers to circumvent the app stores and their hefty platform fees.
<br></br>
<br></br>
    We invite you to read the following article if you wish to learn more about how we came to our decision, and progressive web apps as a whole.  Thank you for using Locals, your ongoing support is what keeps us going.
<br></br>
<br></br>
<a href='https://danboterhoven.medium.com/the-case-for-progressive-web-apps-ef40754e3fd6' target='_blank'>A case for progressive web apps</a>

</h3>
</div>

</section>
  );
}

export default Pwa;
