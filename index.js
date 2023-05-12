'use strict';

// import the dependencies
const express = require('express')
const fs = require('node:fs')
const dotenv = require('dotenv')

// read envs
dotenv.config()
const PORT = process.env['PORT']

// create a express application
const expressApp = express()

// Add express middleware for parsing json payloads
expressApp.use(express.json())

// listing all users
expressApp.get('/users/', (request, response) => {

    // read data from data.json/data source
    const userData = fs.readFileSync('data.json')
    const jsonData = JSON.parse(userData)
    response.json(jsonData)

})

// get specific user information
expressApp.get('/users/:id', (request, response) => {

    // reading data and responding with a specific user data
    fs.readFile('data.json', (error, data) => {
        if (error) {
            errorObj = {
                message: 'failed to read users data'
            }
            response.json(errorObj)
        } else {
            const id = request.params.id
            const userData = JSON.parse(data)[id]
            if (userData)
                response.json(userData)
            else
                response.json({
                    message: `data not found for user: ${id}`
                })
        }
    })
})

// create new user
expressApp.post('/users/', (request, response) => {
    // read data from data.json/data source
    const userData = fs.readFileSync('data.json')
    const jsonData = JSON.parse(userData)

    const arrayUserId = Object.keys(jsonData).map(value => parseInt(value))
    const nextUserId = Math.max(...arrayUserId) + 1

    // request body
    const newUserInfo = request.body

    const updatedUsers = {
        ...jsonData,
        [nextUserId]: newUserInfo
    }

    fs.writeFileSync('data.json', JSON.stringify(updatedUsers))
    response.json({
        'message': `you're registered successfully with userId: ${nextUserId}`
    })
})

// update a specific user
expressApp.patch('/users/:id', (request, response) => {

    const rawData = fs.readFileSync('data.json')
    const jsonData = JSON.parse(rawData)

    const id = request.params.id

    const updatedUsers = {
        ...jsonData[id],
        ...request.body
    }

    jsonData[id] = updatedUsers
    fs.writeFileSync('data.json', JSON.stringify(jsonData))
    response.json({
        'message': 'data updated successfully'
    })
})

// overwriting the user data
expressApp.put('/users/:id', (request, response) => {
    const rawData = fs.readFileSync('data.json');
    const jsonData = JSON.parse(rawData);

    const updatedUserData = request.body;
    const id = request.params.id;

    //Replace the current user data with the data received in the request body
    jsonData[id] = updatedUserData;

    fs.writeFileSync('users.json', JSON.stringify(jsonData));
    response.send('User data updated successfully');
});


// delete user data
expressApp.delete('/users/:id', (request, response) => {
    const rawData = fs.readFileSync('data.json');
    const jsonData = JSON.parse(rawData);
    const id = request.params.id;

    //Delete the user from the JSON object
    delete jsonData[id];
    response.json('User deleted successfully');
});

// Our Node.js server should listen for requests on port 3000
expressApp.listen(PORT, () => {
    console.log(`Node JS server is running on port ${PORT}`)
})