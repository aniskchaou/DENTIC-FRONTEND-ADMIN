const Notification = require("../models/notification.js");

// Find all notifications (optionally with condition)
exports.findAllNotifications = (condition, res) => {
    Notification.findAll({ where: condition })
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notifications."
            });
        });
};

// Find one notification by ID
exports.findNotificationById = (id, res) => {
    Notification.findByPk(id)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving notification with id=" + id
            });
        });
};

// Create a new notification
exports.createNotification = (notification, res) => {
    Notification.create(notification)
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the notification."
            });
        });
};

// Update a notification by ID
exports.updateNotification = (id, req, res) => {
    Notification.update(req.body, { where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Notification was updated successfully." });
            } else {
                res.send({ message: `Cannot update notification with id=${id}. Maybe not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating notification with id=" + id
            });
        });
};

// Delete a notification by ID
exports.deleteNotificationById = (id, res) => {
    Notification.destroy({ where: { id: id } })
        .then(num => {
            if (num == 1) {
                res.send({ message: "Notification was deleted successfully!" });
            } else {
                res.send({ message: `Cannot delete notification with id=${id}. Maybe not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete notification with id=" + id
            });
        });
};

// Delete all notifications
exports.deleteAllNotifications = (res) => {
    Notification.destroy({ where: {}, truncate: false })
        .then(nums => {
            res.send({ message: `${nums} notifications were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all notifications."
            });
        });
};