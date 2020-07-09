Ext.define('criterion.view.ess.dashboard.infoActionPanel.ActionBtn', function() {

    return {

        extend : 'Ext.Button',

        alias : 'widget.criterion_selfservice_dashboard_info_action_panel_action_btn',

        cls : 'criterion-btn-transparent criterion-selfservice-dashboard-info-action-panel-action-btn',
        ui : 'light',
        textAlign : 'left',
        iconCls : 'icon',
        iconAlign : 'right',

        config : {

            /**
             * @cfg {String}
             */
            badgeValue : null
        },

        renderTpl :
        '<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" ' +
                'class="{btnWrapCls} {btnWrapCls}-{ui} {splitCls}{childElCls}">' +
            '<span id="{id}-btnEl" data-ref="btnEl" role="presentation" unselectable="on" style="{btnElStyle}" ' +
                    'class="{btnCls} {btnCls}-{ui} {textCls} {noTextCls} {hasIconCls} ' +
                    '{iconAlignCls} {textAlignCls} {btnElAutoHeightCls}{childElCls}">' +
                '<tpl if="iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
                '<span id="{id}-btnInnerEl" data-ref="btnInnerEl" unselectable="on" ' +
                    'class="{innerCls} {innerCls}-{ui}{childElCls}">{text}</span>' +
                '<span id="{id}-btnBangeEl" data-ref="btnBangeEl" unselectable="on" class="btnBangeEl">{badgeValue}</span>' +
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
        // Split buttons have additional tab stop for the arrow element
        '<tpl if="split">' +
            '<span id="{id}-arrowEl" class="{arrowElCls}" data-ref="arrowEl" ' +
                'role="button" hidefocus="on" unselectable="on"' +
                '<tpl if="tabIndex != null"> tabindex="{tabIndex}"</tpl>' +
                '<tpl foreach="arrowElAttributes"> {$}="{.}"</tpl>' +
                ' style="{arrowElStyle}"' +
            '>{arrowElText}</span>' +
        '</tpl>',

        childEls : [
            'btnEl', 'btnWrap', 'btnInnerEl', 'btnIconEl', 'arrowEl', 'btnBangeEl'
        ],

        _hasBangeCls : Ext.baseCSSPrefix + 'btn-has-bange-val',

        updateBadgeValue : function(badgeValue, oldBadgeValue) {
            badgeValue = badgeValue == null || badgeValue === 0 ? '' : String(badgeValue);
            oldBadgeValue = oldBadgeValue || '';

            var me = this,
                btnBangeEl = me.btnBangeEl,
                btnEl = me.btnEl;

            if (me.rendered) {
                btnBangeEl.setHtml(badgeValue || '&#160;');

                btnEl[badgeValue ? 'addCls' : 'removeCls'](me._hasBangeCls);
                me.updateLayout();
            }
            me.fireEvent('badgevaluechange', me, oldBadgeValue, badgeValue);
        }
    }

});
