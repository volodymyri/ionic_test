Ext.define('criterion.controller.settings.system.StaticToken', function() {

    return {

        alias : 'controller.criterion_settings_system_static_token',

        extend : 'criterion.controller.FormView',

        requires : [
            'criterion.view.RecordPicker',
            'criterion.store.security.Profiles',
            'criterion.view.person.PersonPicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        onSecurityProfileSearch : function() {
            var me = this,
                picker = Ext.create('criterion.view.RecordPicker', {
                    title : i18n.gettext('Select Security Profile'),
                    searchFields : [
                        {
                            fieldName : 'name', displayName : i18n.gettext('Profile Name')
                        }
                    ],
                    columns : [
                        {
                            text : i18n.gettext('Profile Name'),
                            dataIndex : 'name',
                            width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                        },
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Module'),
                            dataIndex : 'module',
                            encodeHtml : false,
                            renderer : function(value) {
                                return criterion.Utils.getSecurityBinaryNamesFromInt(criterion.Consts.SECURITY_MODULES, value).join('<br />');
                            }
                        },
                        {
                            xtype : 'booleancolumn',
                            header : i18n.gettext('Full Access'),
                            align : 'center',
                            dataIndex : 'hasFullAccess',
                            trueText : '✓',
                            falseText : '',
                            width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                        }
                    ],
                    store : Ext.create('criterion.store.security.Profiles', {
                        pageSize : 10
                    })
                });

            picker.on({
                select : function(profileRecord) {
                    me.getRecord().set({
                        securityProfileId : profileRecord.getId(),
                        securityProfileName : profileRecord.get('name')
                    });
                },
                close : function() {
                    me.setCorrectMaskZIndex(false);
                }
            });

            picker.show();

            me.setCorrectMaskZIndex(true);
        },

        onSecurityProfileClear : function() {
            this.getRecord().set({
                securityProfileId : null,
                securityProfileName : null
            });
        },

        onPersonSearch : function() {
            var me = this,
                record = this.getRecord(),
                picker = Ext.create('criterion.view.person.PersonPicker', {
                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            height : criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_HEIGHT,
                            width : criterion.Consts.UI_DEFAULTS.MODAL_NORMAL_WIDTH,
                            modal : true
                        }
                    ]
                });

            picker.on({
                select : function(person) {
                    record.set({
                        personId : person.get('id'),
                        personName : person.get('fullName')
                    })
                },
                close : function() {
                    me.setCorrectMaskZIndex(false);
                }
            }, this);

            picker.show();

            me.setCorrectMaskZIndex(true);
        },

        onPersonClear : function() {
            this.getRecord().set({
                personId : null,
                personName : null
            });
        },

        onTokenTypeChange : function(cmp, value) {
            let record = this.getRecord();

            if (value === criterion.Consts.STATIC_TOKEN_TYPES.SYSTEM) {
                record.set({
                    personId : null,
                    personName : null
                });
            } else if (value === criterion.Consts.STATIC_TOKEN_TYPES.USER) {
                record.set({
                    securityProfileId : null,
                    securityProfileName : null
                });
            }
        }
    }
});
