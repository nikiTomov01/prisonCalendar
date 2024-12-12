import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDvtthCYVSfz0In-Te_d7Q77uCZGol4qNQ",
    authDomain: "prisoncalendar-b53f6.firebaseapp.com",
    projectId: "prisoncalendar-b53f6",
    storageBucket: "prisoncalendar-b53f6.firebasestorage.app",
    messagingSenderId: "1048021069443",
    appId: "1:1048021069443:web:3d881a764fdcdc773e75b6",
    measurementId: "G-W708BLZSRY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const calRef = collection(db, "calendars");

let canvas = document.getElementById("calendar-canvas");
let context = canvas.getContext("2d");

canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;

context.lineWidth = 20;
context.lineCap = "round";
context.strokeStyle = `#2b5a91`;

let currentData = ".";
let localPrevious = currentData;
let currUser = "Petar";

let isMouseDown = false;
let previous = { x: 0, y: 0};

canvas.addEventListener("mousemove", event => {
    if (isMouseDown) {
        let {pageX: x, pageY: y} = event;
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(x, y);
        context.stroke();
        previous = {x , y};
    }
})

canvas.addEventListener("mousedown", event => {
    let {pageX: x, pageY: y} = event;
    previous = {x, y};
    isMouseDown = true;
})

canvas.addEventListener("mouseup", async event => {
    isMouseDown = false;
    let dataUrl = canvas.toDataURL();
    let previousData = currentData;
    localPrevious = currentData;
    console.log(localPrevious);
    currentData = dataUrl;
    try {
        const ref = await setDoc(doc(calRef, `${currUser}`),  {
            prevData: previousData,
            currData: currentData
        });
        //console.log(ref.id);
    } catch (e) {
        console.error("Error adding document: " + e);
    }
})

const undoBtn = document.getElementById("undo-btn");

undoBtn.addEventListener("click", async () => {
    // retrieve calendar data.
    const docRef = doc(calRef, `${currUser}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        //console.log(docSnap.data().prevData);
        //console.log(typeof(docSnap.data().prevData));
        const img = new Image();
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        }

        img.onerror = () => {
            console.error("Failed to load image from data url!");
        }
        img.src = docSnap.data().prevData;
    }
    else {
        console.log("No such document!");
    }
})

//slide bars bellow

const barsBtn = document.getElementById("bars-btn");
const barsImg = document.getElementById("prison-bars");
let barsCheck = true;

barsBtn.addEventListener("click", () => {
    if (barsCheck) {
        barsImg.classList.add("slide-left");
        barsCheck = false;
    }
    else {
        barsImg.classList.remove("slide-left");
        barsImg.style.marginLeft = 0;
        barsCheck = true;
    }
})