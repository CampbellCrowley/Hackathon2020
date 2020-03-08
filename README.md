# Crash Course
*This is a project created entirely during a 12 hour hackathon at CSU Chico on March 7th 2020.*  
### Authors:  
[Campbell Crowley](https://github.com/CampbellCrowley/): back-end server, multiplayer support, project manager.  
[Ryan Persons](https://github.com/rpersons1/): controller and data acquisition.  
[David Ayala](https://github.com/e7ite/): game rendering and logic.

## Description
This project contains 3 parts that work together for to create a full game experience.  
1. A HTML/JavaScript webpage (`controller.html`) that fetches the device orientation of the smartphone the page was loaded on, and streams this data to the server using Socket.io.
   - This page also displays the sensors values, and provides an option for the user to reset which direction is considered forwards.
2. The NodeJS back-end (`index.js`) acts as a file-server and data proxy.
   - The server sends the requested files to the connected client web-pages in order to load the website.
   - This also acts as a proxy to receive sensor data from the controllers, and re-transmit this data with a client-id to the game.
3. The HTML/JavaScript/Canvas game webpage (`index.html`, `script.js`, `helper.js`) acts as the primary data handler and viewer.
   - This page receives the proxied sensor data from the server, with the associated user-ids in order to control a car on the screen.
   - The orientation data of the smartphones on the controller page, are used to manipulate the cars displayed on this page.
   - Randomly generated road traffic will also speed by that the players will need to avoid, otherwise the game will reset.

## Installing/Running
1. [NodeJS](https://nodejs.org/) is required for the server.
   - We used both v10.x, and v12.x without issues.
2. Install the required packages with `npm install`.
   - There will actually be more packages installed than necessary (eslint), for easier code debugging and development.
3. Run the server with `npm start`.
   - `npm start` will run the server with basic arguments for you.
   - `node index.js 8080 8081` is equivalent. 8080 refers to the HTTP (not secure) port to listen on. 8081 refers to the HTTPS (secure-ish) port to listen on.
     - The HTTP port will only work for service `index.html` as `controller.html` must be served over HTTPS due to security policies enforced by Google Chrome (and probably Firefox as well), that limit the availability of sensor data otherwise.
4. Connect to the game at your server's address.
   - You will need to know the address of your server in order to connect to it. I will assume the server will be reachable at `192.168.0.5`, and running on the default ports for the sake of example.
   - Your phone will need to load `https://192.168.0.5:8081/controller.html` to control the game.
   - The computer you are displaying the game on will need to load `http://192.168.0.5:8080/index.html` or `https://192.168.0.5:8081` in order to show the game.
