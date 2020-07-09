/**
 *  Adds filtering by one property selected by combo
 *  Handler for filterByProperty event can be added with criterion.controller.mixin.FilterByProperty to GridView controller
 *  Bar can be used as:
 *  {
 *       xtype : 'criterion_filter_with_selector_bar',
 *       properties : {
 *           data : [
 *               { id : 'name', name : 'Name'},
 *               { id : 'location', name : 'Location'},
 *               { id : 'code', name : 'Course Code'},
 *               { id : 'description', name : 'Course Description'}
 *           ]
 *       },
 *       listeners : {
 *           filterByProperty : 'handleFilterByProperty'
 *       }
 *   }
 */
Ext.define('criterion.view.FilterWithSelectorBar', function() {

    return {

        extend : 'Ext.toolbar.Toolbar',

        alias : 'widget.criterion_filter_with_selector_bar',

        config : {
            properties : null,
            propertyPrefix : '',
            propertiesComboConfig : {},
            filterValueConfig : {}
        },

        addFilterByPropertyListener : false,

        defaultFilterByPropertyListenerName : 'handleFilterByProperty',

        padding : '0',

        viewModel : {
            data : {
                filterByProperty : null,
                filterByValue : null
            }
        },

        initComponent : function() {
            let me = this;

            Ext.apply(me, {
                items : [
                    Ext.merge({
                        xtype : 'combobox',
                        itemId : 'propertiesCombo',
                        editable : false,
                        autoSelect : true,
                        allowBlank : false,
                        sortByDisplayField : false,
                        queryMode : 'local',
                        store : me.getProperties(),
                        displayField : 'name',
                        valueField : 'id',
                        bind : '{filterByProperty}',
                        listeners : {
                            scope : me,
                            change : 'handlePropertyChange'
                        }
                    }, me.getPropertiesComboConfig()),
                    Ext.merge({
                        xtype : 'textfield',
                        bind : '{filterByValue}',
                        triggers : {
                            clear : {
                                type : 'clear',
                                cls : 'criterion-clear-trigger-transparent',
                                hideWhenEmpty : true
                            }
                        },
                        listeners : {
                            scope : me,
                            change : {
                                fn : 'handleValueChange',
                                buffer : criterion.Consts.UI_DEFAULTS.SEARCH_CHANGE_BUFFER
                            }
                        }
                    }, me.getFilterValueConfig())
                ]
            });

            me.callParent(arguments);

            let propertiesCombo = me.getComponent('propertiesCombo'),
                vm = me.lookupViewModel(),
                store,
                first;

            if (propertiesCombo && (store = propertiesCombo.getStore()) && (first = store.first())) {
                vm.set('filterByProperty', first.get('id'));
            }

            if (me.addFilterByPropertyListener) {
                me.on('filterByProperty', me.defaultFilterByPropertyListenerName);
            }
        },

        handlePropertyChange : function(combo, filterByProperty, lastFilterByProperty) {
            let me = this,
                vm = me.lookupViewModel();

            if (!Ext.isEmpty(filterByProperty)) {
                vm.set('filterByValue', '');
                me.updateGridStore();
            }
        },

        handleValueChange : function() {
            let me = this;

            me.updateGridStore();
        },

        updateGridStore : function() {
            let me = this,
                vm = me.getViewModel(),
                filterByProperty = me.getPropertyPrefix() + vm.get('filterByProperty'),
                filterByValue = vm.get('filterByValue');

            me.fireEvent('filterByProperty', filterByProperty, filterByValue)
        }
    }

});
