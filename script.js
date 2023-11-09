const alarmApp = (function () {

    const upcomingAlarmRef = document.querySelector('.upcoming__alarm')
    const hourInput = document.querySelector('.container__input--hour')
    const minuteInput = document.querySelector('.container__input--minute')
    const activeAlarms = document.querySelector('.alarms-list')
    const addAlarmButton = document.querySelector('.container__button--add-alarm')
    const clearAllButton = document.querySelector('.container__button--clear-all')
    const alarmSound = new Audio('./alarm.mp3')

    let alarmIndex = 0
    let alarmsArray = []

    const saveToLocalStorage = () => {

        const state = {
            alarmIndex,
            alarmsArray
        }

        localStorage.setItem('alarms', JSON.stringify(state))

    }
    const loadFromLocalStorage = () => {

        const state = JSON.parse(localStorage.getItem('alarms'))

        if (!state) return

        alarmIndex = state.alarmIndex
        alarmsArray = state.alarmsArray

    }

    const appendZero = (value) => (value < 10 ? '0' + value : value)

    const appendArray = (array, container) => {

        array.forEach((element) => {
            container.appendChild(element)
        })

    }
    const sortUpcomingAlarm = (alarmA, alarmB) => {
        return (alarmA.time.localeCompare(alarmB.time))
    }

    const rederUpcomingAlarm = (alarmsArray) => {

        if (alarmsArray.length <= 0) {
            upcomingAlarmRef.innerHTML = `<h3> There is not upcoming alarm. Add any alarm </h3>`
        } else {
            upcomingAlarmRef.innerHTML = `<h3> Upcoming alarm : ${alarmsArray[0].time} </h3>`
        }

        return upcomingAlarmRef
    }

    const triggerTimer = () => {

        const date = new Date()
        const currentTime = date.toLocaleTimeString('eu-US', { hour12: false })


        alarmsArray.forEach((alarm) => {
            if (alarm.isActive && alarm.time === currentTime.slice(0, 5)) {
                alarmSound.play()
            }
        })
    }
    const toggleAlarm = (alarm) => {

        alarm.isActive = !alarm.isActive


        if (alarm.isActive) {

            const currentTime = new Date().toLocaleTimeString('eu-US', { hour12: false }).slice(0, 5)

            if (alarm.time === currentTime) {
                alarmSound.play()
            }

        } else {
            alarmSound.pause()
        }
    }
    const deleteAlarm = (alarmIdToRemove) => {

        alarmsArray = alarmsArray.filter((alarm) => {
            return alarm.id !== alarmIdToRemove
        })
        update()

    }
    const createAlarm = (hourInputValue, minuteInputValue) => {

        alarmIndex += 1

        let hour = parseInt(hourInputValue) || 0
        let minute = parseInt(minuteInputValue) || 0

        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            alert("Invalid hour or minute. Please enter values within the valid range!");
            return;
        }
        if (alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}`)) return

        const alarmObj = {
            id: `${alarmIndex}_${hour}${minute}`,
            time: `${appendZero(hour)}:${appendZero(minute)}`,
            isActive: false
        }

        alarmsArray = [...alarmsArray, alarmObj]




    }
    const renderAlarm = (alarm, onToggle, onDelete) => {

        const alarmContainer = document.createElement('li')
        alarmContainer.dataset.id = alarm.id
        alarmContainer.className = 'alarm__container'
        const span = document.createElement('span')
        span.className = 'alarm__container--span'
        span.innerHTML = alarm.time
        alarmContainer.appendChild(span)

        const buttonsContainer = document.createElement('div')
        buttonsContainer.className = 'alarm__container--container-buttons'

        const deleteButton = document.createElement('button')
        deleteButton.className = 'alarm__delete-button'
        deleteButton.innerText = 'DELETE'
        deleteButton.addEventListener('click', onDelete)

        const checboxContainer = document.createElement('div')
        checboxContainer.className = 'checkbox-wrapper-2'

        const checkbox = document.createElement('input')
        checkbox.className = 'sc-gJwTLC ikxBAC'
        checkbox.type = 'checkbox'
        checkbox.addEventListener('click', onToggle)

        checboxContainer.appendChild(checkbox)

        buttonsContainer.appendChild(checboxContainer)
        buttonsContainer.appendChild(deleteButton)


        alarmContainer.appendChild(buttonsContainer)

        return alarmContainer

    }
    const renderAlarms = (alarmsArray) => {


        const alarmsContainer = document.createElement('ol')
        alarmsContainer.className = 'alarms__container'

        alarmsArray = alarmsArray.map((alarm) => {
            return renderAlarm(
                alarm,
                () => { toggleAlarm(alarm) },
                () => { deleteAlarm(alarm.id) },
            )
        })


        appendArray(alarmsArray, alarmsContainer)

        return alarmsContainer

    }
    const update = () => {

        activeAlarms.innerHTML = ''
        hourInput.value = ''
        minuteInput.value = ''

        saveToLocalStorage()

        const app = render()

    }
    const render = () => {

        const sortedAlarms = alarmsArray
            .slice()
            .sort((alarmA, AlarmB) => {
                return sortUpcomingAlarm(alarmA, AlarmB)
            })

        const alarmsElement = renderAlarms(sortedAlarms)
        const upcoming = rederUpcomingAlarm(sortedAlarms)

        activeAlarms.appendChild(alarmsElement)

    }
    clearAllButton.addEventListener('click', () => {

        alarmsArray = []
        activeAlarms.innerHTML = ''

    })

    addAlarmButton.addEventListener('click', () => {
        createAlarm(hourInput.value, minuteInput.value)
        update()
    })
    const init = () => {

        setInterval(triggerTimer, 1000)

        loadFromLocalStorage()

        const app = render()

    }
    init()

})()

