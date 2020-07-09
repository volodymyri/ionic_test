Ext.define('criterion.view.employee.PositionsView', function() {

    return {

        alias : 'widget.criterion_employee_positions_view',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employee.PositionsView',
            'criterion.view.employee.Position'
        ],

        scrollable : 'vertical',

        bodyPadding : 0,

        cls : 'criterion-fullscreen-popup',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : '100%'
            }
        ],

        config : {
            positions : [],
            isPartOfESS : false
        },

        controller : {
            type : 'criterion_employee_positions_view'
        },

        listeners : {
            scope : 'controller'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            data : {
                employer : null,
                currentIndex : 0,
                positions : [],
                assignmentDetail : null,
                hideDelete : false
            },

            formulas : {
                currentPosition : function(data) {
                    return data('positions').getAt(data('currentIndex')) || {};
                },

                hasLeft : function(data) {
                    return data('currentIndex') !== 0;
                },

                hasRight : function(data) {
                    return data('currentIndex') < (data('positions').count() - 1)
                }
            }
        },

        noButtons : true,

        initComponent : function() {
            var me = this,
                vm = this.getViewModel(),
                isPartOfESS = this.getIsPartOfESS();

            this.buttons = [
                {
                    xtype : 'button',
                    text : i18n.gettext('Delete'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : 'handleDeleteDetail'
                    },
                    hidden : true,
                    bind : {
                        hidden : '{hideDelete || !isDeletable}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Close'),
                    cls : 'criterion-btn-light',
                    reference : 'cancelBtn',
                    scale : 'small',
                    handler : 'handleCancelClick'
                }
            ];

            this.items = [];

            if (!isPartOfESS) {
                this.items.push({
                    xtype : 'toolbar',

                    items : [
                        {
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['arrow-left-a'],
                            text : i18n.gettext('Prev'),
                            scale : 'medium',
                            margin : '0 10 0 0',
                            bind : {
                                hidden : '{!hasLeft}'
                            },
                            tooltip : i18n.gettext('Prev'),
                            listeners : {
                                click : 'handleLeftPositionSwitch'
                            }
                        },
                        {
                            xtype : 'tbtext',
                            flex : 1,
                            cls : 'centeredText',
                            bind : {
                                html : Ext.util.Format.format('<span>{0}</span>', i18n.gettext('Position History'))
                            }
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['arrow-right-a'],
                            text : i18n.gettext('Next'),
                            iconAlign : 'right',
                            scale : 'medium',
                            bind : {
                                hidden : '{!hasRight}'
                            },
                            tooltip : i18n.gettext('Next'),
                            listeners : {
                                click : 'handleRightPositionSwitch'
                            }
                        }
                    ]
                });
            }

            this.items.push(
                {
                    xtype : 'criterion_employee_position',
                    reference : 'positionView',

                    recordIds : [],

                    bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.TWO_TIER_FORM,

                    flex : 1,
                    border : false,
                    noButtons : true,

                    viewModel : {
                        data : {
                            editMode : false,
                            showCustomfields : this.showCustomfields,
                            isPrimary : false,
                            skipSalaryGradeFilter : true,
                            skipActionFilter : true
                        },
                        formulas : {
                            isEditable : function() {
                                return false
                            },
                            isPendingWorkflow : function() {
                                return false
                            }
                        }
                    }
                }
            );

            this.callParent(arguments);
            Ext.defer(function() {
                vm.set('hideDelete', me.hideDelete);
            }, 100)
        },

        loadRecord : function(record) {
            this.getController() && this.getController().load();
        }
    }
});
