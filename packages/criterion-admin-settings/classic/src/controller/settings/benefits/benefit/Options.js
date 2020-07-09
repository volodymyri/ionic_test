Ext.define('criterion.controller.settings.benefits.benefit.Options', function() {

    var employerId = null;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_benefit_options',

        listen : {
            global : {
                employerChanged : 'handleEmployerChanged'
            }
        },

        onBeforeEmployerChange : function(employer) {
            employerId = employer ? employer.getId() : null;
        },

        onEmployerChange : function() {
            this.load();
        },

        load : function() {
            criterion.model.Employer.load(employerId, {
                scope : this,
                callback : function(record) {
                    this.getViewModel().set('record', record);
                }
            });
        },

        onOptionChange : function() {
            var record = this.getViewModel().get('record');

            setTimeout(function() { // workaround
                if (record.dirty) {
                    record.save({
                        callback : function() {
                            criterion.Utils.toast(i18n.gettext('Option saved.'));
                        }
                    });
                }
            }, 0);
        }
    };
});
