# Food Bank Connect User Manual

## Welcome
Welcome to the repository for Food Bank Connect: a CSE 403 project in collaboration with Lynnwood Food Bank.
> [!WARNING]
> This project in an incomplete, insecure state and is **NOT** to be used with real personally identifiable information.
> To guarentee safety, we require a secure server be run from the integrating food bank 
> or a trusted partner. 

## About Us
The Lynnwood Food Bank currently serves over 4,000 households and 17,400 individuals, providing vital support to our community's most vulnerable populations. However, their intake and volunteer registration processes are largely manual, relying on paper forms and in-person submissions. Food Bank Connect aims to modernize these workflows by introducing a secure, user-friendly web application that allows clients and volunteers to submit necessary forms online ahead of time. By streamlining intake procedures, we not only help those in need with more convenient and intuitive access to the food bank but also help volunteers focus on direct service rather than paperwork. 

[See our living document for more about our project.](https://docs.google.com/document/d/14ZCmqzvU7z0FwthmpE_hgo6zpr88JpUWLSTOOTxHNHk/edit?usp=sharing)

## Tools
The only requirement for this project is to have [Node.js](https://nodejs.org/en/download) installed. Instructions can be found in the link. Our project uses version 11.3.0 and has no guarantees for other versions, though higher versions should work. Instructions on how to install dependencies are under [Usage](#Usage)

## Core Functionality
Our 4 core features are
- Foodbank guests can fill out an intake form online using google forms that uses google sheets as a temporary database.
  - Because we handle sensitive information we intend to move away from Google products in the future. For now we use Google form to handle intake as a proof of concept for this class
- There should be a Volunteer Hub that allows for searching by name in the existing LFB database and uses some degree of intelligent searching
- Forms that contain information that could conflict with existing entries in database (duplicate addresses) should be flagged for review in our Volunteer Hub
- Forms that are correctly filled out with no issues should be sent directly to the existing LFB database

We are actively working on a smarter search feature. We are also working on a feature that allows for editing entries within the Volunteer Hub. 

## Repository Layout
There are two directories, a frontend `client` and a `backend server`. Each is it's own project, detailed below. In addition, there is a `documentation` folder that provides further details about our project. Development, building, and testing will be detailed below under [Usage](#Usage).

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
Begin by cloning or forking this repository. There is sufficient documentation for this process online.

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

To write your own client side Vitest tests:
- Locate that `__test__` folder under `client/src/__test__`
- If you wish to set up your own tests, right click the `__test__` folder and select New File. Otherwise edit or add to the existing tests we have.
- Use this template to write your tests. We do not require any specific guidelines, but your tests should be modular, readable, and well documented. 

```Javascript
import {expect, test} from 'vitest';
import { demo_sum } from '../utils/utils';  // import what you want to test

test('A descriptive test name', () => {
  expect(demo_sum(1, 2)).toBe(3)  // expects the return value of demo_sum(1, 2) to be 3

  // similar tests should be grouped together
})

// other related but different tests

```

To write your own server side Jest tests:
- Locate that `__test__` folder under `server/__test__`
- If you wish to set up your own tests, right click the `__test__` folder and select New File. Otherwise edit or add to the existing tests we have.
- Use this template to write your tests. We do not require any specific guidelines, but your tests should be modular, readable, and well documented. 

```Javascript
import assert from 'assert';
import { describe, test, expect, beforeAll } from '@jest/globals';
import nock from 'nock';  // we use nock for mock http requests

// sync tests
test('A descriptive test name', () => {
    expect(1 + 1).toBe(2);
});

// async test
test('A descriptive async test name', async () => {
    const result = await foo();
    expect(result).toBe(true);
});
```

## Report a Bug
Bugs will be tracked within the Github Issues tab. Go to Issues -> New issue -> Bug report, and fill out the template provided with the necessary information. Please ensure that you provide information on the following:
- Clear and concise high level description of the bug
- Steps to reproduce it
- Screenshots if possible/relevant
- Device information

Please also ensure that the bug has not already been reported. Known bugs can be found under the same Issues tab.