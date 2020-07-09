Ext.define('criterion.data.validator.EmailList', {
    extend : 'Ext.data.validator.Format',
    alias : 'data.validator.criterion_email_list',

    type : 'criterion_email_list',

    message : i18n.gettext('Is not a valid email address list. Should be list of email addresses, separated by ";"'),

    matcher : /^(([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+([;.](([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5}){1,25})+)*$/,

    validate : function(value) {
        var matcher = this.getMatcher(),
            result = matcher && matcher.test(value);

        if (value === null && this.allowNull) {
            return true;
        }

        return result ? result : this.getMessage();
    }
});
