const https = require("https");
const fs = require("fs");

/* const options = {
  hostname: "nc-leaks.herokuapp.com",
  path: "/api/confidential",
  method: "GET",
};

const req = https.request(options, (res) => {
  let body = "";
  console.log(res);
});

req.on("error", (e) => {
  console.error(e);
});

req.end(); */

const peopleOptions = {
  hostname: "nc-leaks.herokuapp.com",
  path: "/api/people",
  method: "GET",
};

const getPeople = https.request(peopleOptions, (res) => {
  let body = "";

  res.on("data", (packet) => {
    body += packet.toString();
  });

  res.on("end", () => {
    const parsedPeople = JSON.parse(body);
    let northcodersEmployees = [];

    // let northcodersEmployees = [];

    parsedPeople.people.map((name) => {
      if (name.job.workplace === "northcoders") {
        northcodersEmployees.push(name);
      }
    });

    const employeeString = JSON.stringify(northcodersEmployees);

    fs.writeFile("northcoders.json", employeeString, (err) => {
      if (err) console.log(err);
      else {
        console.log("File written successfully\n");
      }
    });
  });
});

getPeople.on("error", (e) => {
  console.error(e);
});

getPeople.end();

const getInterests = () => {
  fs.readFile("northcoders.json", "utf8", (err, data) => {
    const parsedData = JSON.parse(data);
    let userNames = [];

    if (err) console.log(err);
    else {
      parsedData.forEach((element) => {
        userNames.push(element.username);
      });
      console.log("File read successfully\n");
    }

    let count = 0;
    let interestsArray = [];
    for (let i = 0; i < userNames.length; i++) {
      const interestOptions = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${userNames[i]}/interests`,
        method: "GET",
      };

      const getInterests = https.request(interestOptions, (resObject) => {
        let body = "";

        resObject.on("data", (packet) => {
          body += packet.toString();
        });

        resObject.on("end", () => {
          const parsedInterests = JSON.parse(body);
          //   let northcodersInterests = [];
          interestsArray.push(parsedInterests.person);
          count++;
          if (count === userNames.length) {
            fs.writeFile(
              "interest.json",
              JSON.stringify(interestsArray),
              (err) => {
                if (err) console.log(err);
                else {
                  console.log("interestArray file written successfully\n");
                }
              }
            );
          }
        });
      });

      getInterests.on("error", (e) => {
        console.error(e);
      });

      getInterests.end();
    }
  });
};

getInterests();

//NEXT QUESTION; 3

/* \n\nWrite a function called `getPets` that does the same as the Task 2 but for pets. The endpoint is `https://nc-leaks.herokuapp.com/api/people/:username/pets`;\n\n> Note: Some of the users do not have pets and so the server will respond with a person but an empty pets array! These responses should not be included in the `pets.json`.\n\n### T */

const getPets = () => {
  fs.readFile("northcoders.json", "utf8", (err, data) => {
    const parsedData = JSON.parse(data);
    let userNames = [];

    if (err) console.log(err);
    else {
      parsedData.forEach((element) => {
        userNames.push(element.username);
      });
      console.log("File read successfully\n");
    }

    let count = 0;
    let petsArray = [];

    for (let i = 0; i < userNames.length; i++) {
      const petOptions = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${userNames[i]}/pets`,
        method: "GET",
      };

      const getPets = https.request(petOptions, (resObject) => {
        let body = "";

        resObject.on("data", (packet) => {
          body += packet.toString();
        });

        resObject.on("end", () => {
          const parsedPets = JSON.parse(body);
          //   let northcodersInterests = [];
          if (!parsedPets.status) {
            petsArray.push(parsedPets.person.pets);
          }
          count++;
          if (count === userNames.length) {
            console.log(petsArray);
            fs.writeFile("pets.json", JSON.stringify(petsArray), (err) => {
              if (err) console.log(err);
              else {
                console.log("pets file written successfully\n");
              }
            });
          }
        });
      });

      getPets.on("error", (e) => {
        console.error(e);
      });

      getPets.end();
    }
  });
};

getPets();
