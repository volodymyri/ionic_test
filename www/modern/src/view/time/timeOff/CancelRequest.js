Ext.define('ess.view.time.timeOff.CancelRequest', function() {

    return {

        alias : 'widget.criterion_time_timeoff_cancel_request',

        extend : 'Ext.MessageBox',

        requires : [
            'Ext.SegmentedButton'
        ],

        cls : 'criterion-time-timeoff-cancel-request',

        applyPrompt : function(prompt) {
            if (prompt) {
                let config = {
                    label : false,

                    height : 210,

                    viewModel : {
                        data : {
                            cancelType : 1,
                            comment : ''
                        }
                    },

                    items : [
                        {
                            xtype : 'segmentedbutton',
                            bind : '{cancelType}',
                            margin : '0 0 0 0',
                            vertical : true,
                            items : [
                                {
                                    text : i18n.gettext('Delete Time Off'),
                                    pressed : true,
                                    textAlign : 'left',
                                    value : 1
                                },
                                {
                                    text : i18n.gettext('Keep Time Off'),
                                    textAlign : 'left',
                                    value : 0
                                }
                            ]
                        },
                        {
                            xtype : 'textareafield',
                            label : i18n.gettext('Comment'),
                            bind : {
                                value : '{comment}'
                            }
                        }
                    ],

                    setValue : function(value) {},
                    getValue : function() {
                        let vm = this.getViewModel();

                        return [vm.get('cancelType'), vm.get('comment')];
                    }
                };

                if (Ext.isObject(prompt)) {
                    Ext.apply(config, prompt);
                }

                return Ext.create('Ext.form.Panel', config);
            }

            return prompt;
        }

    }
});
