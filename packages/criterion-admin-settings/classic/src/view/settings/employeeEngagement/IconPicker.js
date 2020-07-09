Ext.define('criterion.view.settings.employeeEngagement.IconPicker', function() {

    return {
        alias : 'widget.criterion_settings_icon_picker',

        extend : 'criterion.ux.form.ImageField',

        height : 36,
        imageHeight : 25,

        config : {
            store : null
        },

        listeners : {
            imageClick : {
                fn : function() {
                    this.pickIcon()
                }
            }
        },

        pickIcon : function() {
            var me = this,
                store = me.getStore(),
                selectedIconId = me.getValue(),
                url = me.getUrl(),
                picker = Ext.create('criterion.ux.window.Window', {
                    closable : false,
                    title : i18n.gettext('Select Icon'),
                    resizable : false,
                    bodyPadding : 10,
                    viewModel : true,

                    modal : true,
                    cls : 'criterion-modal criterion-settings-icon-picker-window',

                    width : 400,
                    height : 200,

                    items : [{
                        xtype : 'dataview',
                        reference : 'iconDataView',
                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">' +
                            '<div class="dataview-icon-item" style="display: inline-block; float: left; padding:10px">' +
                            '<img src="{[this.getSrc(values)]}" alt="" />' +
                            '</div>' +
                            '</tpl>', {
                                getSrc : function(values) {
                                    var iconUrl = Ext.util.Format.format('{0}/{1}?_dc={2}', url, values.id, new Date().getTime());

                                    return criterion.Api.getSecureResourceUrl(iconUrl);
                                }
                            }
                        ),
                        itemSelector : 'div.dataview-icon-item',
                        store : store
                    }],

                    bbar : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Cancel'),
                            cls : 'criterion-btn-light',
                            listeners : {
                                click : function() {
                                    picker.fireEvent('close');
                                }
                            }
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-primary',
                            text : i18n.gettext('Select'),
                            bind : {
                                disabled : '{!iconDataView.selection}'
                            },
                            listeners : {
                                click : function() {
                                    var vm = this.lookupViewModel();

                                    picker.fireEvent('select', vm.get('iconDataView.selection'));
                                }
                            }
                        }
                    ]
                });

            picker.on('show', function() {
                var selectIcon = function() {
                    var iconList = picker.down('[reference=iconDataView]'),
                        selectedIcon = selectedIconId && store.getById(selectedIconId);

                    if (selectedIcon) {
                        iconList.setSelection(selectedIcon);
                    }
                };

                if (!store.isLoaded()) {
                    store.load(selectIcon);
                } else {
                    selectIcon();
                }
            });

            picker.on('select', function(icon) {
                me.setValue(icon.getId());
                picker.destroy();
            });

            picker.on('close', function() {
                picker.destroy();
            });

            picker.show();
        }
    }
});
