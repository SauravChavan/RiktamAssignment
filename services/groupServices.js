const Group = require("../models/group");
const User = require("../models/user");

function numberAlreadyExistsFunc(obj1, obj2) {
    let result
    obj1.map((o1, i) => {
        obj2.map((o2, j) => {
            if (o1.phone==o2.phone){
                result = true
            }
        })
    })
    return result;
}

const getAllGroups = async(userId) => {
    try {
        let groups
        groups = await Group.find({createdBy: userId})
        return groups
    } catch (ex) {
        console.log(ex);
    }
}

const createGroup = async (adminId, data) => {
    try {
        let {
            name, members
        } = data;
        if (!name || !members) {
            return {
                err: true,
                message: "Missing required fields",
            };
        }
        const existingGroup = await Group.findOne({ name: data.name });
        if (existingGroup) {
            return {
                err: true,
                message: "Group with same Name already exists.",
            };
        }
        data.members.map(async(d, i) => {  
            let member = await User.findOne({phone: d.phone})
            if (member == null) {
                return {
                    err: true,
                    message: d.phone + " does not exists"
                }
            }
        })
        let group = new Group({
            name: name,
            members: members,
            createdBy: adminId
        });
        group = await group.save();
        return group;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const addMember = async (adminId, data) => {
    try {
        data.members.map(async(d, i) => {  
            let member = await User.findOne({phone: d.phone})
            if (member == null) {
                return {
                    err: true,
                    message: d.phone + " does not exists"
                }
            }
        })
        let group = await Group.findOne({name: data.name, createdBy: adminId})
        if (group==null){
            return {
                err: true,
                message: "Group not found, please check credentails"
            }
        }  
        numberAlreadyExists = numberAlreadyExistsFunc(group.members, data.members)
        if (numberAlreadyExists) {
            return {
                err: true,
                message: "User already exists in group"
            }
        }
        group = await Group.findOneAndUpdate({name: data.name, createdBy: adminId}, {$push: {members: data.members}});  
        group = await group.save()
        let updatedGroup = await Group.find({name: data.name, createdBy: adminId})
        return updatedGroup;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const removeMember = async (adminId, data) => {
    try {
        let group = await Group.findOne({name: data.name, createdBy: adminId})
        if (group==null) {
            return {
                err: true,
                message: "Group does not exist."
            }
        }
        numberAlreadyExists = numberAlreadyExistsFunc(group.members, data.members)
        if (!numberAlreadyExists) {
            return {
                err: true,
                message: "User does exists in group"
            }
        }
        group = await Group.findOneAndUpdate({name: data.name, createdBy: adminId}, {$pull: {members: data.members}});
        group = await group.save()
        let updatedGroup = await Group.find({name: data.name, createdBy: adminId})
        return updatedGroup;
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const deleteGroup = async (adminId, data) => {
    try {
        if (!data.name) {
            return {
                err: true,
                message: "Name required.",
            };
        }
        let group = await Group.findOne({name: data.name, createdBy: adminId});
        if (group==null) {
            return {
                err: true,
                message: "Group '" + data.name + "' does not exists.",
            };
        }
        Group.deleteOne({name: data.name, createdBy: adminId}, (err) => {
            if (err) {
                return ({
                    error: "Failed to delete the product"
                })
            }
            
        })
        return {success: true}
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const sendSMS = async (userId, data) => {
    try {
        let toGroup = await Group.findOne({name: data.toGroup});
        if (toGroup==null) {
            return {
                err: true,
                errMsg: "Group '" + data.toGroup + "' does not exists.",
            };
        }
        let sentBy = await User.findById(userId)
        let isMember = false
        toGroup.members.map(async(m, i) => {
            if (m.phone == sentBy.phone) {
                isMember = true
                return;
            }
        })
        if (!isMember) {
            return {
                err: true,
                errMsg: sentBy.phone + " is not a group member",
            };
        }
        let saveMsgToGrp = {message: data.message, sentBy: {firstName: sentBy.firstName, lastName: sentBy.lastName,     phone: sentBy.phone, _id: sentBy._id},}
        group = await Group.findOneAndUpdate({name: data.toGroup}, {$push: {messages: saveMsgToGrp}});  
        group = await group.save()
        return {
            message: saveMsgToGrp.message,
            group: data.toGroup,
            sentBy: saveMsgToGrp.sentBy,
            errMsg: "Message sent successfully"
        }
    } catch (ex) {
        console.log(ex);
        throw ex;
    }
}

const getAllMsg = async(userId, data) => {
    try {
        let group = await Group.findOne({name: data.group});
        if (group==null) {
            return {
                err: true,
                errMsg: "Group '" + data.group + "' does not exists.",
            };
        }
        let sentBy = await User.findById(userId)
        let isMember = false
        group.members.map(async(m, i) => {
            if (m.phone == sentBy.phone) {
                isMember = true
                return;
            }
        })
        if (!isMember) {
            return {
                err: true,
                errMsg: sentBy.phone + " is not a group member",
            };
        }
        return group.messages
    } catch (ex) {
        console.log(ex);
    }
}

const getAllMembers = async(userId, data) => {
    try {
        let group = await Group.findOne({name: data.group});
        if (group==null) {
            return {
                err: true,
                errMsg: "Group '" + data.group + "' does not exists.",
            };
        }
        let sentBy = await User.findById(userId)
        let isMember = false
        group.members.map(async(m, i) => {
            if (m.phone == sentBy.phone) {
                isMember = true
                return;
            }
        })
        if (!isMember) {
            return {
                err: true,
                errMsg: sentBy.phone + " is not a group member",
            };
        }
        return group.members
    } catch (ex) {
        console.log(ex);
    }
}

module.exports = {
    getAllGroups, createGroup, addMember, removeMember, deleteGroup, sendSMS, getAllMsg, getAllMembers,
}