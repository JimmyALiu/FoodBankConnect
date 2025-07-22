# Food Bank Connect Repository Navigation
Here we show you how to navigate the files contained in this repository.

## Welcome
Welcome to the repository for Food Bank Connect: a CSE 403 project in collaboration with Lynnwood Food Bank.
> [!WARNING]
> This project in an incomplete, insecure state and is **NOT** to be used with real personally identifiable information.
> To guarentee safety, we require a secure server be run from the integrating food bank 
> or a trusted partner to collect data from guests instead of using *Google Forms*. 

## About Us
The Lynnwood Food Bank currently serves over 4,000 households and 17,400 individuals, providing vital support to our community's most vulnerable populations. However, their intake and volunteer registration processes are largely manual, relying on paper forms and in-person submissions. Food Bank Connect aims to modernize these workflows by introducing a secure, user-friendly web application that allows clients and volunteers to submit necessary forms online ahead of time. By streamlining intake procedures, we not only help those in need with more convenient and intuitive access to the food bank but also help volunteers focus on direct service rather than paperwork. 

[See our living document for more about our project.](https://docs.google.com/document/d/14ZCmqzvU7z0FwthmpE_hgo6zpr88JpUWLSTOOTxHNHk/edit?usp=sharing)


## Client Intake

Clients can be intaken using this form here: [https://docs.google.com/forms/d/e/1FAIpQLSfVYKqAYVBPiMxV9BJ9w2ZPpfeaxsHHF6lIUMbLH_WcyGvC9Q/viewform](https://docs.google.com/forms/d/e/1FAIpQLSfVYKqAYVBPiMxV9BJ9w2ZPpfeaxsHHF6lIUMbLH_WcyGvC9Q/viewform)

For demoing purposes, please note that the form is not currently connected to the database (almost there), but the UI is finalized

## Repository Layout
There are two directories, a frontend `client` and a `backend server`. Each is it's own project, detailed below. In addition, there is a `documentation` directory that provides further details about our project. Development, building, and testing will be detailed below under [Usage](#usage).

### documentation/
This is a container for documentation useful to those that interact with the repository.  Includes:
- `documentation/guest_doc.md` to act as a user guide for guests of the foodbank.
- `documentation/volunteer_doc.md` to be an instruction manual for volunteers.
- `documentation/dev_doc.md` to include further specifications for developers.
- `documentation/threat_assessment` to include an assessment of the specific security risks we have identified.

### client/
This is a React/TypeScript application that represents our frontend. It is an interface for users to interact with the SoxBox interface that the Lynnwood Foodbank uses. Contains both dependency information for the **Volunteer Hub local website**  and the corresponding code.
Includes:
- `client/package.json` to specify the dependencies of the local website.
- `client/src` to contain the source code.
- `client/src/__test__` contains automated tests for the local website.

### server/
This is a Node.js server that abstracts away all the interactions with our Google Form and our SoxBox database into API routes. Contains both dependency information for the **Volunteer Hub** server and the corresponding code.
Includes:
- `server/package.json` to specify the dependencies of the local website.
- `server/__test__` contains automated tests of the local website.
- `server/src` contains non trivial code for running calls to the spreadsheet and other complex functions such as flagging.

## Usage
Begin by cloning or forking this repository. There is sufficient documentation for this process online. Install npm on the machine containing the repository; you will need to invoke commands of the form `npm ...` to use this project. If warnings appear while using npm, try running `npm doctor`.

### .env
You will need to set up .env files. If you believe that you should have access to our authentication tokens (for example, if you are course staff for CSE 403 or a student peer reviewing our project) please reach out to us and we will provide you with a .env setup that gives you access to our SoxBox database as well as the backend to our google form handling. Otherwise you will need to set up your own intake forms

If you wish to set up your own intake process you will need to set up your own form, database, and .env files. Since this project is specifically for the Lynnwood Food Bank and not for general use, it will be up to you to decide what kind of process, tools, and setup is required for your needs.

Here is our .env setup for reference. There are two parts to it, one connecting to a google spreadsheet for intake, and one connected to our SoxBox database.

1. Within the root directory there is a .env folder that contains a JSON file with an API key to a google spreadsheet where our form data is stored.

2. Within the server directory you will need a .env file filled out with this information for your SoxBox database and setup.
```
PORT=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CALLBACK_URL=
AUTH0_LOGOUT_REDIRECT_URI=
API_BASE=
API_USERNAME=
API_PASSWORD=
LOCATION_ID=
```

### Dependencies
To install requried dependencies:
1. `cd server` to enter the server directory
2. `npm install` to install all server dependencies
3. `cd ../client` to enter the client directory (this assumes you are currently in server, modify this command depending on your current directory to take you to the client directory)
4. `npm install` to install all client dependencies

### Development
For development, if you want to work on this project.
1. `cd` into the server directory
2. run `npm run start`. 
The server should now be running on port 3000. Note that this port is required or the frontend requests will fail.

3. `cd` into the client directory
4. run `npm run dev`. 
The website should be hosted on localhost:5173. Note that it is required to be on this port or CORS will block requests to the server. 


### Building
For building, if you want to build and deploy or just test the project.
1. `cd` into the server directory
2. run `npm run build`
3. run `npm run start`. 
The server should now be running on port 3000. Note that this port is required or the frontend requests will fail.

4. `cd` into the client directory
5. run `npm run build`
6. run `npm run preview`. 
The website should be hosted on localhost:5173. Note that it is required to be on this port or CORS will block requests to the server. 


### Testing
For testing, our client side uses Vitest and our server uses Jest. To run the automated tests, `cd` into the server or client folder and run `npm run test` to run tests. For the client you can also run `npm run coverage` for a code coverage report.

## Report a Bug
Bugs will be tracked within the Github Issues tab. Go to Issues -> New issue -> Bug report, and fill out the template provided with the necessary information. Please ensure that you provide information on the following:
- Clear and concise high level description of the bug
- Steps to reproduce it
- Screenshots if possible/relevant
- Device information

Please also ensure that the bug has not already been reported. Known bugs can be found under the same Issues tab.
