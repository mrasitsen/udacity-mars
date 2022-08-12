let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['curiosity', 'opportunity', 'spirit'],
}


let rovers = {
    curiosity : [],
    opportunity : [],
    spirit : [],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

//pure function
function updateRovers (rovers, response, rover){
    rovers[rover] = response;
}


function create_content_rover(curr_rover){

    return `
    
            <div>
                <h3>${curr_rover.rover.name} - Photo Date: ${curr_rover.earth_date}</h3>
                <p>Launch Date: ${curr_rover.rover.launch_date} - Landing Date: ${curr_rover.rover.landing_date}</p>
                <p>STATUS: ${curr_rover.rover.status}</p>
                <img src="${curr_rover.img_src}" height="350px" width="100%" />
            </div>

        `
}


const render = (root, state) => {
    root.innerHTML = App(state)
    
}

const renderRover = async (root, rover_name) => {
    root.innerHTML = await AppRover(rover_name)
}


const AppRover = async (rover_name) => {
    
    let curr_rover = rovers[rover_name]

    if(curr_rover.length == 0){

        await getImageOfRover(rover_name)
        curr_rover = rovers[rover_name]

    }else{

        curr_rover = rovers[rover_name]

    }

    return curr_rover.map(pic => create_content_rover(pic)).join(' ');
}


// create content
const App = (state) => {
    let { apod } = state

    return `
        
        <main>
            ${Greeting(store.user.name)}
            <section>
                ${ImageOfTheDay(apod)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load',  () => {
    getImageOfTheDay(store)

})



// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return apod
}

const getImageOfRover = async (rover_name) => {

    await fetch(`http://localhost:3000/rover/${rover_name}`)
        .then(res => res.json())
        .then(response => {
            updateRovers(rovers, Immutable.List(response.image.latest_photos), rover_name)
        })

    return rover_name
}

document.getElementById("curiosity-link").addEventListener("click", function(event){ 
    renderRover(root, "curiosity")
    event.preventDefault();
})

document.getElementById("opportunity-link").addEventListener("click", function(event){ 
    renderRover(root, "opportunity")
    event.preventDefault();
})

document.getElementById("spirit-link").addEventListener("click", function(event){ 
    renderRover(root, "spirit")
    event.preventDefault();
})