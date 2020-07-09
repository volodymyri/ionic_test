Ext.define('criterion.controller.settings.general.Videos', function() {

    return {
        extend : 'criterion.controller.employer.GridView',

        alias : 'controller.criterion_settings_videos',

        handleVideoView : function(record) {
            var newWin = window.open(record.get('url'),
                "Video",
                "width=600,height=500,resizable=yes,scrollbars=yes,status=yes"
            );

            newWin.focus()
        },

        onEmployerChange : function() {
            this.load();
        }
    };

});
