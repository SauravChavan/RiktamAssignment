const Seeder = require('mongoose-data-seed').Seeder;
const User = require('../models/user');

const data = [{
    firstName: "admin",
    lastName: "admin",
    phone: "1234567890",
    password: "admin@admin",
    isAdmin: true
},{
  firstName: "user1",
  lastName: "user1",
  phone: "1111111111"
},{
  firstName: "user2",
  lastName: "user2",
  phone: "2222222222"
},];

class UsersSeeder extends Seeder {

  async shouldRun() {
    return User.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    data.map(async(d, i) => {
      try {
        let user = new User({
            firstName: d.firstName,
            lastName: d.lastName,
            phone: d.phone,
            password: d.password || "Riktam@Riktam",
            isAdmin: d.isAdmin || false
        })
        user = await user.save();
        return user
    } catch (ex) {
        console.log(ex);
        throw ex;
    }  
    })
    // return User.create(data);
  }
}

module.exports = UsersSeeder;

