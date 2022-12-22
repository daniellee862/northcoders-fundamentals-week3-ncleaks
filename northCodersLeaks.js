const https = require("https");
const fs = require("fs");

//OPTIONS FOR PEOPLE REQUEST
const peopleOptions = {
  hostname: "nc-leaks.herokuapp.com",
  path: "/api/people",
  method: "GET",
};

//PEOPLE REQUEST
const getPeople = https.request(peopleOptions, (res) => {
  let body = "";

  res.on("data", (packet) => {
    body += packet.toString();
  });

  res.on("end", () => {
    const parsedPeople = JSON.parse(body);
    let northcodersEmployees = [];

    parsedPeople.people.forEach((name) => {
      if (name.job.workplace === "northcoders") northcodersEmployees.push(name);
    });

    fs.writeFile(
      "northcoders.json",
      JSON.stringify(northcodersEmployees),
      (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
        }
      }
    );
  });
});

getPeople.on("error", (e) => {
  console.error(e);
});

getPeople.end();

//GET INTERESTS FUNCTION;
//readfilesystem - get usernames - iterate over usernames
//multiple requests for interests - save to new file.
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

    userNames.forEach((username, index) => {
      const interestOptions = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${username[index]}/interests`,
        method: "GET",
      };

      const getInterests = https.request(interestOptions, (resObject) => {
        let body = "";

        resObject.on("data", (packet) => {
          body += packet.toString();
        });

        resObject.on("end", () => {
          const parsedInterests = JSON.parse(body);
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
    });
  });
};

//CALL THE GET INTERESTS FUNCITON
getInterests();

//Get Pets Function, Same as Get Interests

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

    userNames.forEach((username, index) => {
      const petOptions = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${username[index]}/pets`,
        method: "GET",
      };

      const getPets = https.request(petOptions, (resObject) => {
        let body = "";

        resObject.on("data", (packet) => {
          body += packet.toString();
        });

        resObject.on("end", () => {
          const parsedPets = JSON.parse(body);

          if (!parsedPets.status) petsArray.push(parsedPets.person.pets);

          count++;
          if (count === userNames.length) {
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
    });
  });
};

getPets();
