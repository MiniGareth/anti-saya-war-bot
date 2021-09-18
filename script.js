// ==UserScript==
// @name        Anti Saya War Bot
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.2
// @author      MiniGareth
// @match        https://web.whatsapp.com/*
// @description I will win the war
// ==/UserScript==

//FUNC i found on whatsapp spammer script for finding an element in an arbitrary DOM
////Its pretty neat
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var message = '👍';

//function to send message
function sendMessage () {
  var evt = new Event('input', {
    bubbles: true
  });

  var input = getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]");
  input.innerHTML = message;
  input.dispatchEvent(evt);
  
  
  //the script clicks the send 
  getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[1]/div[1]/div[2]/div[2]/button").click();
}

//Anti Saya Function
function bot(){
  //Detect if bot is on Saya's page
  let user = getElementByXpath("//*[@id=\"main\"]/header/div[2]/div[1]/div[1]/span").innerHTML;
  //Check if Whatsapp changed DOM layout
  if (user == null || getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[1]/div[1]/div[2]/div[2]") == null || getElementByXpath("//*[@id=\"main\"]/footer/div[1]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]") == null){
    alert("Whatsapp Changed something, the DOMS are not working");
  }
  if (user == "Saya"){
    
    try {
      //Check if last message from her contains a thumbs up
      //Taking chat screen class because stickers and text have different classes
      let chatScreen = document.getElementsByClassName("y8WcF")[0];
      let messages = chatScreen.children;
      let lastMsg = messages[messages.length - 1];

      //Check if the lastMsg is Saya's message
      if (isSaya(lastMsg)){
        //Check if her message contained a thumbs up
        if(hasThumbs(lastMsg)){
          console.log("I GOT IT");
          //Send Message
          sendMessage();
        } else{
          console.log("She didnt have thumbs");
        }
      } else{
        console.log("The last message was not Saya's");
      }

    } catch (error){
      console.log(error);
      console.log("Will try again later");
    }
  }
  
}

//This is partly as a failsafe for replies or when the message has multiple thumbs up or emojis
//Because with the quearySelectorAll, if there are other images it will become part of the array
//So arr[0] no longer works well anymore
function hasThumbs(msg){
  //Create an array of every instance when there is the "img"
  let arr = msg.querySelectorAll("img");
  //Loop through the array and if there is a thumbs return true
  for (let i = 0; i < arr.length; i++){
    if (arr[i].alt == "👍🏼"){
      return true;
    }
    //Yellow thumbs up img
    else if (arr[i].src == "blob:https://web.whatsapp.com/95e06bf6-ffaf-4c76-9456-1fa5a499ed03"){
      return true;
    }
    //Brown thumbs up sticker
    else if (arr[i].src == "blob:https://web.whatsapp.com/db7755d6-18da-4246-9703-6f83d33fdad4"){
      return true;
    }
  }
  return false;
}


//This function loops throught the array of spans in LastMsg
//If one span has the attribute aria_label = Saya, then the msg is from Saya
function isSaya(msg){
  let arr = msg.querySelectorAll("span");
  //Loop through array
  for (let i = 0; i < arr.length; i++){
    console.log(arr[i]);
    try {
      if (arr[i].attributes[0].nodeValue == "Saya:"){
        return true;
      }
    } catch(error){
      continue;
      console.log(error);
      
    }
  }
  return false;
}


/*
 * Need to have a function that loops through message history and decide who is talking last smarter
 * Also need a function that checks for who actually has the last thumbs up in the sea of messages.
 */


//Initialize Bot
setInterval(function(){
  console.log("Bot running");
  bot();
},60000);

