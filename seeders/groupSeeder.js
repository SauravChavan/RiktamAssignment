const Seeder = require('mongoose-data-seed').Seeder;
const Group = require('../models/group');

const data = [{
  name: "Group1",
  members: [
    {phone: "1234567890"},
    {phone: "1111111111"},
    {phone: "2222222222"} 
  ]
},{
  name: "Group2",
  members: [
    {phone: "1234567890"},
    {phone: "1111111111"},
  ]
},{
  name: "Group3",
  members: [
    {phone: "1234567890"},
    {phone: "2222222222"},
  ]
},];

class GroupSeeder extends Seeder {

  async shouldRun() {
    return Group.countDocuments().exec().then(count => count === 0);
  }

  async run() {
    return Group.create(data);
  }
}

module.exports = GroupSeeder;

