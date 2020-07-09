Ext.define('criterion.view.moduleToolbar.EssUser', function() {

    return {
        alias : 'widget.criterion_moduletoolbar_ess_user',

        extend : 'criterion.view.moduleToolbar.User',

        requires : [
            'criterion.controller.moduleToolbar.EssUser'
        ],

        menuAlignOffset : [-16, 5],

        viewModel : {
            data : {
                personName : null,
                selectedEmployment : null,
                selectedEmploymentId : null,
                employer : null,
                multipleEmployments : false,
                showEmploymentsCombo : false
            },
            formulas : {
                hideChangeButton : function(vmget) {
                    return !vmget('multipleEmployments') || vmget('showEmploymentsCombo')
                },
                isMultiPos : function(vmget) {
                    return vmget('employer') && vmget('employer').get('isMultiPosition')
                },
                positionButtonText : function(vmget) {
                    return vmget('isMultiPos') ? 'Primary Position' : 'Position'
                }
            },
            stores : {
                employments : {
                    fields : ['id', 'employeeId', 'positionTitle', 'employerId', 'employerTitle', 'title']
                }
            }
        },

        controller : {
            type : 'criterion_moduletoolbar_ess_user'
        },

        config : {},

        listeners : {
            scope : 'controller',
            render : 'handleRender',
            menuShow : 'onMenuShow'
        },

        initComponent : function() {
            this.callParent(arguments);
        },

        getMenuCfg : function() {
            var menuCfg = this.callParent(arguments);

            menuCfg.plain = true;

            menuCfg.onFocusLeave = function(e) {
                var me = this;

                me.mixins.focusablecontainer.onFocusLeave.call(me, e);

                if (me.floating && !me.preventBlur) {
                    me.hide();
                }
            };

            menuCfg.items = [
                {
                    xtype : 'button',
                    text : i18n.gettext('Change Employer'),
                    hidden : true,
                    ui : 'compact',
                    bind : {
                        hidden : '{hideChangeButton}'
                    },
                    listeners : {
                        click : 'onChangeEmploymentClick'
                    },
                    margin : '15 15 10'
                },
                {
                    xtype : 'combo',
                    reference : 'employmentsCombo',
                    hidden : true,
                    width : 200,
                    bind : {
                        value : '{selectedEmploymentId}',
                        store : '{employments}',
                        hidden : '{!showEmploymentsCombo}'
                    },
                    listeners : {
                        change : 'onEmploymentChange',
                        collapse : 'onEmploymentCollapse'
                    },
                    valueField : 'id',
                    displayField : 'title',
                    editable : false,
                    queryMode : 'local',
                    margin : '15 15 10'
                },
                {
                    xtype : 'menuseparator',
                    hidden : true,
                    bind : {
                        hidden : '{hideChangeButton && !showEmploymentsCombo}'
                    }
                },
                {
                    text : i18n.gettext('Sign Out'),
                    action : 'logout',
                    glyph : criterion.consts.Glyph['log-out'],
                    cls : 'with-glyph',
                    listeners : {
                        click : 'handleLogoutClick'
                    }
                }
            ];

            return menuCfg;
        }
    };

});
