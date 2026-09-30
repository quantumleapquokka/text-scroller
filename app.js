// Elements
const scrollText = document.getElementById("message")
const fontSizeSlider = document.getElementById("size")
const colorPicker = document.getElementById("color")
const scrollSpeedSlider = document.getElementById("speed")
const previewText = document.getElementById("preview-text")
const previewBox = document.getElementById("preview-box")

const displayButton = document.getElementById('display-btn')
// State
let x = 0
let wakeLock = null
let holdTimer = null

// Functions
function updatePreview() {
    previewText.textContent = scrollText.value || scrollText.placeholder
    previewText.style.setProperty("--size", fontSizeSlider.value + "cqh")
    previewText.style.color = colorPicker.value 
}

function tick() {
    const speed = Number(scrollSpeedSlider.value)

    previewBox.classList.toggle("scrolling", speed > 0)
    
    if (speed > 0) {
        x = x - speed
        previewText.style.transform = `translateX(${x}px)`

        if (x < -previewText.offsetWidth) {
            x = previewBox.offsetWidth
        }
    } else {
        previewText.style.transform = ""
        x = 0
    }
    
    requestAnimationFrame(tick)
}

async function startFullscreen() {
    // Fullscreen for Android and fake-fullscreen for IOS
    if (previewBox.requestFullscreen) {
        await previewBox.requestFullscreen()
    } else {
        previewBox.classList.toggle("fake-fullscreen")
    }
    
    // Lock orientation to landscape for supported browsers
    try {
        await screen.orientation.lock("landscape")
    } catch {
        console.log("browser does not support landscape")
    }
    
    // Keeps screeen awake in the duration of displaying the message
    try {
        wakeLock = await navigator.wakeLock.request("screen")
    } catch {
        console.log("screen not awake boohoo")
    }
    
}

function exitFakeFullscreen(){
    // Remove fake-fullscreen class
    previewBox.classList.remove("fake-fullscreen")

    // Release wakelock
    if (wakeLock) {
        wakeLock.release()
        wakeLock = null
    }

}

function cancelHold() {
    clearTimeout(holdTimer)
}

// Event Listeners
scrollText.addEventListener("input", updatePreview)
fontSizeSlider.addEventListener("input", updatePreview)
colorPicker.addEventListener("input", updatePreview)
displayButton.addEventListener("click", startFullscreen)

previewBox.addEventListener("pointerup", cancelHold)
previewBox.addEventListener("pointercancel", cancelHold)

document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && wakeLock) {
        wakeLock.release()
        wakeLock = null
    }
})

previewBox.addEventListener("pointerdown", () => {
    if(previewBox.classList.contains("fake-fullscreen")) {
        holdTimer = setTimeout(exitFakeFullscreen, 2000)
    }
})

// Start
updatePreview()
tick()

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
}