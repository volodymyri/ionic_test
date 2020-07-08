Ext.define('ess.view.Scheduling', function() {

    return {
        alias : 'widget.ess_modern_scheduling',

        extend : 'Ext.Container',

        requires : [
            'ess.controller.Scheduling',
            'ess.view.scheduling.Unavailable',
            'ess.view.scheduling.Shifts'
        ],

        controller : {
            type : 'ess_modern_scheduling'
        },

        viewModel : {
            data : {
                subPageTitle : '',
                unavailableEdit : false,
                shiftEdit : false,
                activeTab : 0
            },
            formulas : {
                allowAddUnavailable : data => {
                    let active = data('activeTab');

                    return Ext.isNumber(active) ? data('activeTab') === 0 : active.card.isUnavailable;
                },
                editMode : data => data('unavailableEdit') || data('shiftEdit'),
                mainTitle : data => data('unavailableEdit') ? i18n.gettext('Unavailable Details') : (data('shiftEdit') ? i18n.gettext('Shift details') : i18n.gettext('Scheduling'))
            }
        },

        listeners : {
            activate : 'handleActivate'
        },

        layout : 'card',

        items : [
            {
                xtype : 'container',
                cls : 'navList',
                reference : 'subMenu',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'ess_modern_menubar',
                        docked : 'top',
                        bind : {
                            title : '{mainTitle}',
                            hidden : '{editMode}'
                        },
                        actions : [
                            {
                                xtype : 'button',
                                text : '',
                                iconCls : 'md-icon-add',
                                iconAlign : 'center',
                                handler : 'handleAddUnavailable',
                                hidden : true,
                                bind : {
                                    hidden : '{!allowAddUnavailable}'
                                }
                            }
                        ]
                    },

                    {
                        xtype : 'tabpanel',
                        tabBar : {
                            layout : {
                                pack : 'center'
                            },
                            bind : {
                                activeTab : '{activeTab}',
                                hidden : '{editMode}'
                            }
                        },

                        flex : 1,

                        items : [
                            {
                                xtype : 'ess_modern_scheduling_unavailable',
                                isUnavailable : 1,
                                reference : 'unavailable',
                                title : i18n.gettext('My Unavailable Times'),

                                listeners : {
                                    actEdit : 'handleEditUnavailable',
                                    actFinishEdit : 'handleFinishEditUnavailable'
                                }
                            },
                            {
                                xtype : 'ess_modern_scheduling_shifts',
                                isShifts : 1,
                                reference : 'shifts',
                                title : i18n.gettext('My Shift Schedule'),
                                listeners : {
                                    actEdit : 'handleEditShift',
                                    actFinishEdit : 'handleFinishEditShift'
                                }
                            }
                        ]
                    }
                ]
            }
        ]

    };

});
