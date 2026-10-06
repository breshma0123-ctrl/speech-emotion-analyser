const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");

const textInput = document.getElementById("textInput");

const emotion = document.getElementById("emotion");
const confidence = document.getElementById("confidence");

const progressBar = document.getElementById("progressBar");

const emotionIcon = document.getElementById("emotionIcon");

const recordStatus = document.getElementById("recordStatus");

const micCircle = document.getElementById("micCircle");

const timer = document.getElementById("timer");


/* SPEECH RECOGNITION */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


let recognition;

let seconds = 0;

let timerInterval;


if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;


    startBtn.addEventListener("click", () => {

        recognition.start();

        micCircle.classList.add("recording");

        recordStatus.innerText = "Listening...";

        startBtn.innerText = "🎙 Listening";

        seconds = 0;

        timer.innerText = "00:00";

        timerInterval = setInterval(() => {

            seconds++;

            let min =
                String(Math.floor(seconds / 60))
                .padStart(2, "0");

            let sec =
                String(seconds % 60)
                .padStart(2, "0");

            timer.innerText = min + ":" + sec;

        }, 1000);

    });


    stopBtn.addEventListener("click", () => {

        recognition.stop();

        stopRecording();

    });


    recognition.onresult = (event) => {

        const speechText =
            event.results[0][0].transcript;

        textInput.value = speechText;

    };


    recognition.onend = () => {

        stopRecording();

    };


    recognition.onerror = () => {

        stopRecording();

        alert("Microphone error. Please try again.");

    };

}


function stopRecording() {

    micCircle.classList.remove("recording");

    recordStatus.innerText = "Recording finished";

    startBtn.innerText = "🎙 Start Recording";

    clearInterval(timerInterval);

}


/* ANALYZE */

analyzeBtn.addEventListener("click", async () => {

    const text = textInput.value.trim();


    if (text === "") {

        alert("Please speak or type something.");

        return;

    }


    try {

        const response = await fetch("/analyze", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                text: text

            })

        });


        const data = await response.json();


        if (data.error) {

            alert(data.error);

            return;

        }


        emotion.innerText = data.emotion;

        confidence.innerText =
            data.confidence + "%";

        progressBar.style.width =
            data.confidence + "%";


        /* Emotion icon */

        if (data.emotion === "Happy") {

            emotionIcon.innerText = "😊";

        }

        else if (data.emotion === "Sad") {

            emotionIcon.innerText = "😢";

        }

        else if (data.emotion === "Angry") {

            emotionIcon.innerText = "😡";

        }

        else if (data.emotion === "Fear") {

            emotionIcon.innerText = "😨";

        }

        else {

            emotionIcon.innerText = "😐";

        }


        /* Reset cards */

        document.getElementById("happy").innerText = "0%";
        document.getElementById("sad").innerText = "0%";
        document.getElementById("angry").innerText = "0%";
        document.getElementById("fear").innerText = "0%";


        /* Highlight detected emotion */

        if (data.emotion === "Happy") {

            document.getElementById("happy").innerText =
                data.confidence + "%";

        }

        if (data.emotion === "Sad") {

            document.getElementById("sad").innerText =
                data.confidence + "%";

        }

        if (data.emotion === "Angry") {

            document.getElementById("angry").innerText =
                data.confidence + "%";

        }

        if (data.emotion === "Fear") {

            document.getElementById("fear").innerText =
                data.confidence + "%";

        }

    }

    catch (error) {

        alert("Server connection error.");

        console.log(error);

    }

});


/* RESET */

clearBtn.addEventListener("click", () => {

    textInput.value = "";

    emotion.innerText = "Waiting...";

    confidence.innerText = "0%";

    progressBar.style.width = "0%";

    emotionIcon.innerText = "🤔";

    document.getElementById("happy").innerText = "0%";
    document.getElementById("sad").innerText = "0%";
    document.getElementById("angry").innerText = "0%";
    document.getElementById("fear").innerText = "0%";

    recordStatus.innerText = "Ready to listen";

    timer.innerText = "00:00";

});