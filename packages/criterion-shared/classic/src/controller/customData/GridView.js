Ext.define('criterion.controller.customData.GridView', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'controller.criterion_customdata_gridview',

        extend : 'criterion.controller.employer.GridView',

        requires : [
            'criterion.store.FieldFormatTypes'
        ],

        datasIsReady : false,

        getEntityTypeCd : function() {
            var view = this.getView();
            view.setEntityTypeCd(this.lookupReference('customizableEntityField').getValue());

            return view.getEntityTypeCd();
        },

        handleChangeStore : function(store) {
            this.getViewModel().set('storeCount', store.count());
        },

        load : function() {
            var entityTypeCd = this.getEntityTypeCd(),
                customFormId = this.getView().getCustomFormId(),
                params = {};

            if (entityTypeCd) {
                this.getViewModel().set('timesheetDetailEntity', criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_TIMESHEET_DETAIL.code, criterion.consts.Dict.ENTITY_TYPE).getId());

                params = {
                    entityTypeCd : entityTypeCd,
                    showHidden : this.lookupReference('showHidden').getValue()
                };
                customFormId > 0 && (params.customFormId = customFormId);

                this.superclass.superclass.load.apply(this, [
                    {
                        params : params
                    }
                ]);
            }
        },

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                entityTypeCd : this.getEntityTypeCd(),
                customFormId : this.getView().getCustomFormId()
            });
        },

        handleChangeEntityType : function() {
            if (!this.datasIsReady) {
                return;
            }
            this.load();
        },

        handleAfterEdit : function() {
            var me = this;

            this.callParent(arguments);

            criterion.CodeDataManager.loadCodeTables()
                .then(function() {
                    me.load();
                });
        },

        handleCloseClick : function() {
            var me = this,
                view = this.getView();

            me.fireEvent('beforePossibleChangesInCustomFields');
            criterion.CodeDataManager.loadCodeTables()
                .then(function() {
                    me.fireEvent('possibleChangesInCustomFields');
                    view.close();
                });
        },

        handleChangeShowHidden : function() {
            this.load();
        },

        handleActivate : function() {
            var view = this.getView();

            view.fieldFormatTypesStore = Ext.create('criterion.store.FieldFormatTypes');
            view.fieldFormatTypesStore.load({
                callback : function() {
                    this.datasIsReady = true;
                    this.load();
                },
                scope : this
            });

        },

        remove : function(record) {
            var store = this.getView().getStore(),
                me = this;

            store.remove(record);
            store.syncWithPromise().then(
                function() {
                    me.load();
                },
                function() {
                    criterion.Msg.warning('You can not delete this field because it has already been used.', function() {
                        me.load();
                    });
                }
            );
        },

        _setEntityTypeCd : function() {
            var me = this,
                view = me.getView(),
                entityTypeCode = view.getEntityTypeCode();

            if (!entityTypeCode) {
                return;
            }

            view.setEntityTypeCd(criterion.CodeDataManager.getCodeDetailRecord('code', entityTypeCode, DICT.ENTITY_TYPE).get('id'));
        },

        handleMoveUpAction : function(record) {
            var me = this;

            criterion.Api.request({
                url : Ext.util.Format.format(criterion.consts.Api.API.CUSTOM_FIELD_UP, record.getId()),
                method : 'PUT',
                scope : this,
                success : function() {
                    me.load();
                }
            });
        },

        handleMoveDownAction : function(record) {
            var me = this;

            criterion.Api.request({
                url : Ext.util.Format.format(criterion.consts.Api.API.CUSTOM_FIELD_DOWN, record.getId()),
                method : 'PUT',
                scope : this,
                success : function() {
                    me.load();
                }
            });
        }
    };

});
