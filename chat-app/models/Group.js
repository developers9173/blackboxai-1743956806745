const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    avatar: {
        type: String,
        default: '/images/default-group.png'
    }
}, { timestamps: true });

// Add methods for group management
groupSchema.methods.addMember = function(userId) {
    if (!this.members.includes(userId)) {
        this.members.push(userId);
    }
};

groupSchema.methods.removeMember = function(userId) {
    this.members = this.members.filter(member => !member.equals(userId));
};

groupSchema.methods.isMember = function(userId) {
    return this.members.some(member => member.equals(userId));
};

module.exports = mongoose.model('Group', groupSchema);