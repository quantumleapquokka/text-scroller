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


// Functions
function updatePreview() {
    previewText.textContent = scrollText.value || scrollText.placeholder
    previewText.style.fontSize = fontSizeSlider.value + "px"
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
    await previewBox.requestFullscreen()
    
    try {
        await screen.orientation.lock("landscape")
    } catch {
        console.log("browser does not support landscape")
    }
    
    
    
}

// Event Listeners
scrollText.addEventListener("input", updatePreview)
fontSizeSlider.addEventListener("input", updatePreview)
colorPicker.addEventListener("input", updatePreview)
displayButton.addEventListener("click", startFullscreen)

// Start
updatePreview()
tick()