Ext.define('criterion.view.scheduling.shiftGroup.Requirements', function() {

    return {
        alias : 'widget.criterion_scheduling_shift_group_requirements',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.scheduling.shiftGroup.Requirements'
        ],

        controller : {
            type : 'criterion_scheduling_shift_group_requirements'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        viewModel : {},

        listeners : {
            show : 'onShow'
        },

        bodyPadding : 20,
        modal : true,
        draggable : true,
        title : i18n.gettext('Shift Requirements'),

        items : [
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 20 0',
                items : [
                    {
                        xtype : 'criterion_tagfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Positions'),
                        bind : {
                            store : '{presentPositions}',
                            value : '{positionIds}'
                        },
                        displayField : 'text',
                        valueField : 'id',
                        queryMode : 'local',
                        hideTrigger : true,
                        disabled : true
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handlePositionSelect'
                    }
                ]
            },
            {
                xtype : 'criterion_tagfield',
                flex : 1,
                fieldLabel : i18n.gettext('Skills'),
                bind : {
                    store : '{skills}',
                    value : '{skillIds}'
                },
                displayField : 'name',
                valueField : 'id',
                queryMode : 'local'
            },

            {
                xtype : 'criterion_tagfield',
                flex : 1,
                fieldLabel : i18n.gettext('Certifications'),
                bind : {
                    store : '{certifications}',
                    value : '{certificationIds}'
                },
                displayField : 'name',
                valueField : 'id',
                queryMode : 'local'
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                reference : 'cancelBtn',
                handler : 'handleCancel',
                text : i18n.gettext('Cancel')
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Change'),
                handler : 'handleChange'
            }
        ]
    }
});
