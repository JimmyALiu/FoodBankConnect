# Food Bank Connect

## Welcome
Welcome to the repository for Food Bank Connect: a CSE 403 project in collaboration with Lynnwood Food Bank.
To get started, see the following **Usage** section. 
> [!WARN]
> This project in an incomplete, insecure state and is **NOT** to be used with real personally identifiable information.
> To gaurentee safety, we require of form submissions that a secure server be run from the integragining food bank 
> or a trusted partner. 

## Usage
First, install depencencies.  Then, use `npm` to build. Finally, run the code.

### Dependencies
To install requried dependencies, use `npm install` from the server
directory and from the client directory.

### Building
To build the project use `npm build` from server. Then, use `npm build` from the client directory. 

### Running
To run the project, first ensure that a server is active by using `npm run` from the server directory.
Then, use `npm run` from the client directory.

### Testing
To run the automated tests manually, use `npm run` from the test folders.

## Repository Layout
There are two directories:

### client/
Contains both dependency information for the **Volunteer Hub local website**  and the corresponding code.
Includes:
- `client/package.json` to specify the dependencies of the local website.
- `client/src` to contain the source code.
  - `client/__test__` contains automated tests for the local website.

### server/
Contains both dependency information for the **Volunteer Hub** server and the corresponding code.
Includes:
- `server/package.json` to specify the dependencies of the local website.
- `server/__test__` contains automated tests of the local website.


## About Us
The Lynnwood Food Bank currently serves over 4,000 households and 17,400 individuals, providing vital support to our community's most vulnerable populations. However, their intake and volunteer registration processes are largely manual, relying on paper forms and in-person submissions. Food Bank Connect aims to modernize these workflows by introducing a secure, user-friendly web application that allows clients and volunteers to submit necessary forms online ahead of time. By streamlining intake procedures, we not only help those in need with more convenient and intuitive access to the food bank but also help volunteers focus on direct service rather than paperwork. 

[See our living document for more about our project.](https://docs.google.com/document/d/14ZCmqzvU7z0FwthmpE_hgo6zpr88JpUWLSTOOTxHNHk/edit?usp=sharing)
