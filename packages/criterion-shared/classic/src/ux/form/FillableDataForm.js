Ext.define('criterion.ux.form.FillableDataForm', function() {

    const FIELD_TYPE = 'criterion_data_form_field';

    return {

        extend : 'Ext.container.Container',

        alias : 'widget.criterion_fillable_dataform',

        requires : [
            'criterion.ux.form.field.DataFormField',
            'criterion.model.dataForm.FillableForm'
        ],

        mixins : [
            'criterion.ux.mixin.Component',
            'criterion.ux.mixin.RecordsHolder'
        ],

        config : {

            editable : false,

            /**
             * @cfg {Number} number of columns
             */
            numColumns : 2,

            labelWidth : null,

            isResponsive : true,

            baseDocUrl : criterion.consts.Api.API.EMPLOYEE_DOCUMENT_DATAFORM_FIELDS
        },

        store : {
            type : 'criterion_abstract_store',
            model : 'criterion.model.dataForm.FillableField',
            sorters : [
                {
                    property : 'sequenceNumber',
                    direction : 'ASC'
                }
            ],
            filters : [
                {
                    property : 'isHidden',
                    value : false,
                    exactMatch : true
                }
            ]
        },

        layout : 'hbox',

        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

        createByDataFormId(dataformId) {
            let me = this;

            if (!dataformId) {
                return;
            }

            return criterion.Api.requestWithPromise({
                method : 'GET',
                url : criterion.consts.Api.API.DATAFORM + '/' + dataformId
            }).then(function(formData) {
                me.getStore().loadData(formData.formFields);

                return formData;
            });
        },

        loadForm(documentId, url) {
            let me = this;

            if (!url) {
                url = Ext.String.format(me.getBaseDocUrl(), documentId);
            } else {
                url = Ext.String.format(url, documentId);
            }

            return criterion.Api.requestWithPromise({
                method : 'GET',
                url : url
            }).then(function(formData) {
                me.getStore().loadData(formData.formFields);

                return formData;
            });
        },

        getRecordItems() {
            return this.query(FIELD_TYPE);
        },

        addRecordItem(item, record) {
            let me = this,
                index = me.getStore().indexOf(record),
                column = me.down('#column' + (index % this.getNumColumns()));

            if (index < 0) {
                return
            }

            item['margin'] = '0 0 20 0';

            return column.add(item);
        },

        createRecordItem() {
            return {
                xtype : FIELD_TYPE,
                labelWidth : this.getLabelWidth(),
                readOnly : !this.getEditable()
            };
        },

        getFormValues() {
            let vals = [];

            Ext.each(this.getRecordItems(), function(field) {
                vals.push(
                    {
                        name : field.getFieldId(),
                        value : field.getValue()
                    }
                )
            });

            return vals;
        },

        isValid() {
            let valid = true;

            Ext.each(this.getRecordItems(), function(field) {
                if (!field.isValid()) {
                    valid = false;
                }
            });

            return valid;
        },

        initComponent() {
            this.items = [];

            for (var i = 0; i < this.getNumColumns(); i++) {
                this.items.push({
                    xtype : 'container',
                    itemId : 'column' + i
                });
            }

            if (this.getIsResponsive()) {
                this.plugins = [
                    'criterion_responsive_column'
                ];
            }

            this.callParent(arguments);
            this.mixins.recordsholder.init.call(this);
        }
    }
});
