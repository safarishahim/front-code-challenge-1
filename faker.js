const {faker} = require("@faker-js/faker");
const fs = require('fs');

const users = [];

for (let i = 1; i <= 300; i++) {
    users.push({
        id: i,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        mobile: faker.phone.phoneNumber('0912#######'),
        date: faker.date.between('2022-01-01T00:00:00.000Z', '2022-02-01T00:00:00.000Z').toLocaleDateString()
    })
}

fs.writeFile("users.json", JSON.stringify(users, null, 1), function(err) {
    if(err) console.log('error', err);
    console.log('data created')
})

