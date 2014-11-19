define(function() {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;

            setTimeout(function() {
                $('#greeting-area').fadeOut(400);
                $('#notification-area').fadeIn(400);

            }.bind(this), 4000);
        },
        enableNotification: function() {
            this.showNotification = true;
        },
        showMore: function() {
            // context.model.lens('myNotificationsComponent.showMore').set(false);
        },
        updateNotificationList: function(data) {
            var modelData = context.dataTransform.objectClone(context.model.lens('myNotificationsComponent.list').get()),
                showMore = context.model.lens('myNotificationsComponent.showMore').get(),
                notIfList;
            modelData.splice(data.i, 1);
            notIfList = modelData.length;

            data = {
                showMore: (notIfList > 3 && showMore) ? true : false,
                enableNotificationList: notIfList > 0 ? context.model.lens('myNotificationsComponent.enableNotificationList').get() : false,
                list: modelData.length !== 0 ? modelData : null
            };

            context.model.lens('myNotificationsComponent').set(data);
        }
    };
});