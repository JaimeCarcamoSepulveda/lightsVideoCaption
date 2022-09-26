
/*
PSEUDO-CODE: 
takes in URL 
adds it to a variable
creates an element (iframe)
function removes the ‘youtube’ portion of URL and adds ‘you-tube’ instead then
adds URL to src=" URL HERE"
*/

const search = document.body.querySelector('input');
const button = document.getElementById('button');
const iframe = document.querySelector('iframe');
const placeURL = document.querySelector('iframe').src;


//button.addEventListener('click', searchNow);
//search.addEventListener('keypress', enterKey);

let tubeURL = null;
let fixedURL = null;
/*
function searchNow (e) {
    tubeURL = [...search.value];
    tubeURL.splice(16,0,'-');
    fixedURL = tubeURL.join('');
    console.log(fixedURL);
    return iframe.setAttribute('src', fixedURL);
        
 }*/

 function enterKey(e){
    if(e.key =='Enter'){
    searchNow();
    }  
 }


 /*
Write a function that adjust video size responsively with the 16/9 ratio
width is good. height needs to be adjusted. 

when window loads resize the height of video
//const videoWidth = iframe.offsetWidth; 
 //let videoHeight = iframe.offsetHeight; 

const iframeContainer= document.querySelector('.iframeContainer');
 //const videoWidthContainer = iframeContainer.offsetWidth; 
 //let videoHeightContainer = iframeContainer.offsetHeight; 

*/

const container = document.querySelector('.container');
const width = container.offsetWidth;
const height = window.innerHeight;



 let videoWidth = iframe["width"]; 
 let videoHeight = iframe["height"]; 


window.addEventListener('load', videoResizer)
window.addEventListener('resize', videoResizer)


function videoResizer() {
   // videoHeightContainer = videoWidthContainer*0.5625;
    videoHeight = (width *0.5625) *.95;
    videoWidth = (videoHeight * 1.776) * .95;
    //alert(`video width is ${videoWidth} and video height is now ${videoHeight}`);
    //alert(`videoContainer width is ${width} and videoContainer height is now ${height} `);
    
}


/*

const youtubeVisitedUrl = document.baseURI; <--this is the URL of given page.



Selecting items on youtubeURL 


*/




/*
//the function and event listener below retrieve URL into page and open it. 
//could be adapted to open in new tab for a 'open URL in youtube' option.
// _parent, _top, _self open in same window while  
const self = window.name;
button.addEventListener('click', openURL);

function openURL() {
   tubeURL = search.value;
   window.open(tubeURL,'_self');
   console.log(tubeURL);

}
*/



