Ext.define('criterion.ux.form.field.File', function() {

    return {

        alias : [
            'widget.criterion_filefield'
        ],

        extend : 'Ext.form.field.File',

        cls : 'criterion-filefield',

        buttonMargin : 6,

        maxFileSize : null,
        maxFileSizeUrl : null,

        twoWayBindable : 'showViewTrigger',

        config : {
            showViewTrigger : null,
            showFileButton : true,
            maxFileSizeUrlOptions : null
        },

        buttonConfig : {
            text : '',
            glyph : criterion.consts.Glyph['plus'],
            cls : 'criterion-btn-primary'
        },

        triggers : {
            view : {
                cls : 'criterion-view-trigger',
                hidden : true,
                weight : 1,
                hideOnReadOnly : false
            },
            filebutton : {
                type : 'component',
                weight : 2,
                hideOnReadOnly : false,
                preventMouseDown : false
            }
        },

        initComponent : function() {
            this.callParent(arguments);

            var trigger = this.getTrigger('view'),
                me = this;

            trigger.onClick = function() {
                me.fireEvent('viewFile');
            };
        },

        setShowViewTrigger : function(value) {
            var trigger = this.getTrigger('view');

            if (!!value && !this.isDirty()) {
                trigger.show();
                this.addCls('view-trigger');
            } else {
                trigger.hide();
                this.removeCls('view-trigger');
            }

            this.callParent(arguments);
        },

        setShowFileButton : function(value) {
            var trigger = this.getTrigger('filebutton');

            trigger.setVisible(value);

            // Hidden trigger rendered incorrectly in FF
            value && trigger.el && trigger.el.setWidth(44);

            this.callParent(arguments);
        },

        onFileChange : function(button, event, value) {
            var file = event.target && event.target.files && event.target.files[0];

            if (this.maxFileSize) {
                if (this.checkFileSize(file, this.maxFileSize)) {
                    this.changeFile(button, event, value, file);
                }
            } else if (this.maxFileSizeUrl) {
                criterion.Api.requestWithPromise(
                    Ext.merge(this.getMaxFileSizeUrlOptions() || {}, {
                        url : this.maxFileSizeUrl,
                        method : 'GET',
                        silent : true
                    })
                ).then(function(mFileSize) {
                    this.maxFileSize = mFileSize;

                    if (this.checkFileSize(file, mFileSize)) {
                        this.changeFile(button, event, value, file);
                    }
                }, null, null, this);
            } else {
                this.changeFile(button, event, value, file);
            }

        },

        changeFile : function(button, event, value, file) {
            var oldValue = this.getValue();

            this.superclass.onFileChange.call(this, [button, event, value]);
            this.setShowViewTrigger(false);
            this.setRawValue(value.replace(/C:\\fakepath\\/g, ''));
            this.validate();

            if (Ext.isDefined(file)) {
                this.fireEvent('fileChange', this, this.getValue(), oldValue, file);
            }
        },

        checkFileSize : function(file, maxSize) {
            if (file && file.size > maxSize) {
                criterion.Msg.error({
                    title : i18n.gettext('Maximum file size exceeded'),
                    message : Ext.util.Format.format('Max file size is {0} MB', maxSize / criterion.Consts.ATTACHMENTS_CONFIG.BYTES_IN_MB)
                });

                return false;
            }

            return true;
        }

    }
});
