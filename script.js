const alarmBody = document.querySelector(".alarm-body-container")
const curentTime = document.querySelector(".current-time")
const setHour = document.querySelector(".hours")
const setMinute = document.querySelector(".minutes")
const setSecond = document.querySelector(".seconds")
const timeFormat = document.querySelector(".timeFormat")
const setAlarmButton = document.querySelector(".set-alarm-button")
const alarmMessage = document.querySelector(".alarm-message")
const confirmAlarmSection = document.querySelector(".alarm-section-container")

let alarms = []
let recordHr = 0
let recordMin = 0
let recordSec = 0
let recordFormat = "AM"
let shadowInterval = null


// creating time funtion 
function updateTime () {
    const nowTime = new Date()
    let hours = nowTime.getHours()
    const min = String(nowTime.getMinutes()).padStart(2,0)
    const sec= String(nowTime.getSeconds()).padStart(2,0)
    const AmPm = hours >= 12 ? 'PM' : 'AM'

    hours = hours % 12
    hours = hours ? hours : 12
    const changedHour = String(hours).padStart(2,0)
    curentTime.textContent = `${changedHour}:${min}:${sec} ${AmPm}`
    alarms.forEach((ele) => {
        if (`${changedHour}:${min}:${sec}:${AmPm}` === ele.time){
            alarmMessage.classList.remove("hidden")
        }
    } )
}

// this function is created to get input for the 

function timeOptions (selectedElement, range){
    for (let i = 0; i <= range; i++){
        const createOption = document.createElement("option")
        createOption.classList.add("alarm-time-sec-options")
        createOption.value = i
        createOption.text = String(i).padStart(2,0)
        selectedElement.appendChild(createOption)
    }
}

// this function is to take input values from the set alarm 

function recordAlarm () {
    setHour.addEventListener("click", function () {
        const valHr = this.options[this.selectedIndex]
        recordHr = valHr.value
    })
    setMinute.addEventListener("click", function () {
        const valMin = this.options[this.selectedIndex]
        recordMin = valMin.value
    })
    setSecond.addEventListener("click", function (){
        const valSec = this.options[this.selectedIndex]
        recordSec = valSec.value
        
    })
    timeFormat.addEventListener("click", function () {
        const valFormat = this.options[this.selectedIndex]
        recordFormat = valFormat.value
    })
}

// this function does recording of tiings when the alaem is being set and 
// the eventlisteners for the many delete buttons

function setTime (recordHr, recordMin, recordSec, recordFormat) {
    let hours = parseInt(recordHr)
    let min = parseInt(recordMin)
    let sec = parseInt(recordSec)
    let format = recordFormat
    if (format === 'PM' && hours < 12){
        hours += 12
    }else if (format === 'AM' && hours === 12){
        hours = 0
    }

    let now = new Date()
    let alarmDate = new Date()
    alarmDate.setHours(hours, min, sec,0)
    if (alarmDate <= now){
        alarmDate.setDate(now.getDate() + 1)
    }
    const confirmAlarm = document.createElement("div")
    confirmAlarm.classList.add("alarms")
    const alarmTime = `${String(recordHr).padStart(2,0)}:${String(min).padStart(2,0)}:${String(sec).padStart(2,0)} ${format}`
    const confirmAlarmTime = document.createElement("div")
    confirmAlarmTime.classList.add("alarm-info")
    confirmAlarmTime.textContent = `${String(recordHr).padStart(2,0)}:${String(min).padStart(2,0)}:${String(sec).padStart(2,0)} ${format}`
    const confirmAlarmDeleteButton = document.createElement("button")
    confirmAlarmDeleteButton.classList.add("delete-alarm")
    confirmAlarmDeleteButton.textContent = "Delete"
    confirmAlarm.appendChild(confirmAlarmTime)
    confirmAlarm.appendChild(confirmAlarmDeleteButton)
    confirmAlarmSection.appendChild(confirmAlarm)

    confirmAlarmDeleteButton.addEventListener("click", function () {
        const parentNode = confirmAlarmDeleteButton.parentNode
        const parentElement = confirmAlarmDeleteButton.parentElement
        const getAdjacentElement = parentElement.firstElementChild.textContent
        alarms = alarms.filter((obj) => obj.time !== getAdjacentElement)
        parentNode.remove()
        if (alarmTImeout){
            clearTimeout(alarmTImeout)
        }
    })

    const timeToAlarm = alarmDate - now
    let alarmTImeout = setTimeout(() => {
        alarmMessage.classList.remove("hidden")
        shadowInterval =  setInterval(() => {
            const newBoxShadow = `0px 0px 10px 2px rgba(0, 0, 0, 0.5), -5px -5px 20px 10px ${newBoxShadowEffect()}, 5px 5px 20px 10px ${newBoxShadowEffect()}`;
            alarmBody.style.boxShadow = newBoxShadow
        },1000)
        setTimeout(() => {
            alarmMessage.classList.add("hidden")
            if(shadowInterval){
                clearInterval(shadowInterval)
                const newBoxShadow = `0px 0px 10px 2px rgba(0, 0, 0, 0.5), -5px -5px 20px 10px rgba(249, 9, 4, 0.2), 5px 5px 20px 10px rgba(100, 204, 25, 0.2);`;
                alarmBody.style.boxShadow = newBoxShadow
            }
        }, 10000)
    }, timeToAlarm)

    const obj = {
        time: alarmTime,
        timeout:alarmTImeout
    }
    alarms.push(obj)
    updateTime()
}

// this function is created for having random colors during alarm ringing

function newBoxShadowEffect() {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = 0.5;
    return `rgba(${r}, ${g}, ${b}, ${a})`
}


// calling the timeOptions function to create the options for the setting alarm time
timeOptions(setHour, 12)
timeOptions(setMinute, 59)
timeOptions(setSecond, 59)

recordAlarm()

// setTime(recordHr, recordMin, recordSec, recordFormat)


// calling the time function every 1 seconds interval
setInterval(updateTime, 1000)

setAlarmButton.addEventListener("click", function () {
    setTime (recordHr, recordMin, recordSec, recordFormat)
})




