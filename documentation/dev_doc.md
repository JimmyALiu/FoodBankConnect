## Developers Manual
Welcome to the developer's manual. Here is everything you need to start contributing to our project:


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
There are 3 directories, a frontend `client,` a `backend server` and the form intake form code. Each is it's own project, detailed below. In addition, there is a `documentation` directory that provides further details about our project. Development, building, and testing will be detailed below under [Usage](#Usage).

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
3. within the server directory you need a .key file with the specific encryption key you will be using to encrypt your data. You can generate this or use the same key as everyone else
4. 
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
- following the describe.each format makes it easier to add test cases and paramerize input. optionally you can create your own name for the test case, or you can just put the inputs as $input
-for large mock data use a .ts file to declare and export it to not dirty the test scripts with an insummountable amount of information

```Javascript
import {expect, test} from 'vitest';
import { demo_sum } from '../utils/utils';  // import what you want to test
describe.each([
    {
      name: 'descriptivename'
      input: 'values'
      expect: 'expected output'
    }])('function_name - $name', ({ input, expected }) => {
it('descriptive subtest name', () => {
  expect(demo_sum(values)).toBe(expected)  // expects the return value of demo_sum(1, 2) to be 3

  // similar tests should be grouped together
});
});

// async test for data pipelining can be written in a single test format
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
