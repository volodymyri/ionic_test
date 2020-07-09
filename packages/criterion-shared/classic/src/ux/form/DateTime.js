Ext.define('criterion.view.ux.form.DateTime', {

    extend : 'Ext.form.FieldContainer',

    mixins : [
        'Ext.form.field.Field'
    ],

    alias : 'widget.criterion_ux_form_datetime',

    config : {
        /**
         * Time field is hidden
         */
        hideTime : false,
        disableDirtyCheck : false
    },

    layout : 'hbox',
    timeFieldXType : 'timefield',

    /**
     * Parse date & time fields to component value
     * @private
     */
    updateTimestamp : function() {
        var time = this.time,
            date = this.date;

        if (time && date) {
            var timestamp = Ext.Date.parse(
                Ext.Date.format(date, 'Y-m-d') + ' ' + Ext.Date.format(time, 'g:i A'),
                'Y-m-d g:i A'
            );

            this.setValue(timestamp);
        }
    },

    initComponent : function() {
        this.timeFieldXType = typeof ess === 'undefined' ? 'timefield' : 'criterion_time_field';

        this.items = [
            {
                xtype : 'datefield',
                fieldLabel : '',
                hideLabel : true,
                allowBlank : false,
                disableDirtyCheck : this.getDisableDirtyCheck(),
                flex : 1
            },
            {
                xtype : this.timeFieldXType,
                fieldLabel : '',
                hideLabel : true,
                allowBlank : false,
                increment : 30,
                margin : '0 0 0 10',
                disableDirtyCheck : this.getDisableDirtyCheck(),
                flex : 1
            }
        ];

        this.callParent(arguments);

        this.initField();

        this.down('datefield').on('change', function(cmp, value) {
            this.date = value;
            this.updateTimestamp();
        }, this);

        this.down(this.timeFieldXType).on('change', function(cmp, value) {
            this.time = value;
            this.updateTimestamp();
        }, this);
    },

    setValue : function(timestamp) {
        this.mixins.field.setValue.call(this, timestamp);
        this.down('datefield').setValue(timestamp);
        this.down(this.timeFieldXType).setValue(timestamp);
    },

    setReadOnly : function(readOnly) {
        this.down('datefield').setReadOnly(readOnly);
        this.down(this.timeFieldXType).setReadOnly(readOnly);
    },

    markInvalid : function(message) {
        this.down('datefield').markInvalid(message);
        this.down(this.timeFieldXType).markInvalid(message);
    },

    clearInvalid : function() {
        this.down('datefield').clearInvalid();
        this.down(this.timeFieldXType).clearInvalid();
    },

    updateHideTime : function(value) {
        var timefield;

        if (!this.rendered) {
            return;
        }

        timefield = this.down(this.timeFieldXType);
        timefield.setHidden(value);
        timefield.setDisabled(value);

        if (value) {
            this.time = this.time || Ext.Date.parse('0:00:00 PM', 'g:i:s A');
            this.updateTimestamp();
        }
    }

});
