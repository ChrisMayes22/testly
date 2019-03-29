# TESTLY

Testly is a web application developed with tutoring companies in mind. 
Administrators at a Testly website will be able to _add their own quizzes,_
_track student performance, and provide automated feedback._

Testly was developed with **ACT Prep** in mind but can be adapted to any testing framework.

# Motivation

Most major standardized tests -- including the ACT, SAT, LSAT, GRE, and GMAT -- are moving 
to computerize their test delivery.To adapt, test prep companies will need to provide their own
digital test delivery systems. 

In addition, while working as a test prep coach and academic tutor at Triangle Academic Coach,
I saw many opportunities for improving the workflow in any tutoring setting using automated test
delivery.

This project aims to fill both needs.

# Build Status

**Completed Tasks:**
*AUTHENTICATION:*  Users can now register with the Testly interface using Google OAuth.

**NEXT STEP:** 
*SINGLE QUESTION DELIVERY*
By the time this step is implemented, the Testly interface will be able to render a single question & its answers. 

Each step will be completed following TDD, with a high degree of unit test coverage for each implementation.

# Screen Shots

**Landing Page**
![Landing Page for Testly App](https://i.imgur.com/AQ95qia.jpg)

# Tech & Frameworks

**FRONT END:** React, React-Router, Redux, Axios
**SERVERSIDE ROUTING:** Express
**AUTHENTICATION:** Passport, Google OAuth, cookie-session cookie-parser
**DATABASE AND DB MODELLING:** MongoDB, Mongoose
**DEV SERVER MANAGEMENT:** create-react-app server + Express run simultaneously w/ Concurrently & Nodemon
**DEV AND TESTING ENV VARS:** env-cmd
**TESTING:** jest + enzyme + supertest

# Features

**Custom Quizzes:** Administrators will be able to add custom tests w/ automated grading. Questions must be multiple choice and should have between 2 and 8 answers. Tests can have a timer or no timer.
**Score tracking:** Testly will automatically record and grade user responses to quizzes. Administrators will be able to review their scores.
**Question Data Collection:** Testly will automatically collect data, including frequently missed questions and popular wrong answers.
**Flexible Roles:** Testly supports non-technical administrator roles for adding/modifying quizzes & for reviewing users' scores


