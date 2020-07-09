Ext.define('criterion.ux.tab.Tab', function() {

    return {
        extend : 'Ext.tab.Tab',

        alias : 'widget.criterion_tab',

        renderTpl:
        '<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" ' +
            'class="{btnWrapCls} {btnWrapCls}-{ui} {splitCls}{childElCls}">' +
            '<span id="{id}-btnEl" data-ref="btnEl" role="presentation" unselectable="on" style="{btnElStyle}" ' +
                'class="{btnCls} {btnCls}-{ui} {textCls} {noTextCls} {hasIconCls} ' +
                '{iconAlignCls} {textAlignCls} {btnElAutoHeightCls}{childElCls}">' +
                '<tpl if="iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
                '<span id="{id}-btnInnerEl" data-ref="btnInnerEl" unselectable="on" ' +
                'class="{innerCls} {innerCls}-{ui}{childElCls}">{text}</span>' +
                '<tpl if="!iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
            '</span>' +
        '</span>' +
        '{[values.$comp.getAfterMarkup ? values.$comp.getAfterMarkup(values) : ""]}' +
            // if "closable" (tab) add a close element icon
        '<tpl if="closable">' +
            '<span id="{id}-closeEl" data-ref="closeEl" class="{baseCls}-close-btn">' +
            '<tpl if="closeText">' +
                ' {closeText}' +
            '</tpl>' +
            '</span>' +
        '</tpl>' +
            // collapsible
        '<tpl if="collapsible">' +
            '<span id="{id}-collapseEl" data-ref="collapseEl" class="{baseCls}-collapse-btn">' +
            '</span>' +
        '</tpl>',

        collapsible : false,
        sectionLabel : '',

        initComponent : function() {
            this.callParent(arguments);

            if (this.collapsible) {
                this.addCls('with-sub-items');
            }
        },

        getTemplateArgs : function() {
            var me = this,
                result = me.callParent();

            result.collapsible = me.collapsible;
            result.sectionLabel = me.sectionLabel;

            return result;
        }
    }

});
