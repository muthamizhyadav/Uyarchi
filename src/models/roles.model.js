const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { toJSON, paginate } = require('./plugins');

const rolesSchema= mongoose.Schema({
    _id:{
        type:String,
        default:v4
    },
    roleName:{
        type:String,
    },
    description:{
        type:String
    },
    active:{
        type:Boolean,
        default:true
    },
    archive:{
        type:Boolean,
        default:false,
    },
    menus:[{
        read:{
            type:Boolean,
        },
        write:{
            type:Boolean,
        },
        update:{
            type:Boolean,
        },
        rm:{
            type:Boolean,
        },
        menu_id:{
            type:String
        },
        point:{
            type:Number
        }
    }],
})

rolesSchema.plugin(toJSON);
rolesSchema.plugin(paginate);
const Roles = mongoose.model('Roles', rolesSchema);

module.exports = Roles;