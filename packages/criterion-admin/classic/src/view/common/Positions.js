Ext.define('criterion.view.common.Positions', function() {

    return {
        alias : 'widget.criterion_positions',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.common.Positions',
            'criterion.view.common.positions.PositionList',
            'criterion.view.common.positions.PositionSearch',
            'criterion.view.common.positions.PositionForm'
        ],

        controller : {
            type : 'criterion_positions'
        },

        listeners : {
            saved : 'onSaved',
            activate : 'handleActivate'
        },

        viewModel : {
            data : {
                hideAssignments : false
            }
        },

        //Default Main Route
        mainRoute : criterion.consts.Route.HR.POSITIONS,

        title : i18n.gettext('Positions'),

        layout : 'fit',
        bodyPadding : 0,

        plugins : {
            ptype : 'criterion_lazyitems'
        },

        positionsGridStateId : 'positionsGrid',

        initComponent : function() {
            var me = this;

            me.callParent(arguments);

            me.getPlugin('criterionLazyItems').items = [
                {
                    xtype : 'criterion_positions_position_form',
                    reference : 'positionForm',
                    hidden : true,
                    bind : {
                        hideAssignments : '{hideAssignments}'
                    }
                },
                {
                    layout : 'border',
                    reference : 'mainScreen',

                    items : [
                        {
                            xtype : 'panel',
                            region : 'center',
                            layout : 'fit',

                            items : [
                                {
                                    xtype : 'criterion_positions_position_list',
                                    reference : 'positionList',
                                    stateId : me.positionsGridStateId
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_positions_position_search',
                            reference : 'positionSearch',

                            listeners : {
                                search : 'onSearch'
                            },

                            region : 'west',
                            width : 300
                        }
                    ]
                }
            ];
        }
    };

});
