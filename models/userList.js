const mongoose = require("mongoose");

const userListSchema = new mongoose.Schema({
    userId: { 
        type: String,
    // type.ref : 去參照 User 的 ObjectId
    // type: Schema.Types.ObjectId,
    // ref: 'User',
    // 把欄位設成索引，增加讀取效能
        index: true,
        required: true
    },
    year: {
        type: Number,
    },
    month: {
        type: Number,
        min: 1,
        max: 12
    },
    day: {
        type: Number
    },
    todoList:{
        hours: {
            type: Number,
        },
        minutes: {
            type: Number,
        },
        todoItem: {
            type: String,
        }
    }
});

const UserList = mongoose.model("UserList", userListSchema);

module.exports = UserList;