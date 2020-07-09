Ext.define('criterion.locale.Common', function() {
    Ext.onReady(function() {
        if (Ext.data && Ext.data.Types) {
            Ext.data.Types.stripRe = /[\$,%]/g;
        }

        if (Ext.Date) {
            Ext.Date.monthNames = criterion.Consts.MONTHS_ARRAY;

            Ext.Date.getShortMonthName = function(month) {
                return Ext.Date.monthNames[month].substring(0, 3);
            };

            Ext.Date.monthNumbers = criterion.Consts.MONTHS_SHORT_NUMBERS;

            Ext.Date.getMonthNumber = function(name) {
                return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
            };

            Ext.Date.dayNames = criterion.Consts.DAYS_OF_WEEK_ARRAY;

            Ext.Date.getShortDayName = function(day) {
                return Ext.Date.dayNames[day].substring(0, 3);
            };

            Ext.Date.parseCodes.S.s = "(?:st|nd|rd|th)";
        }

        if (Ext.util && Ext.util.Format) {
            Ext.apply(Ext.util.Format, {
                thousandSeparator : ',',
                decimalSeparator : '.',
                currencySign : '$',
                dateFormat : 'm/d/Y',

                minutesToLongString : function(minutes) {
                    if (!minutes) {
                        return
                    }

                    var duration = criterion.Utils.minutesToDuration(minutes);

                    return criterion.Utils.durationToLongString(duration);
                },

                minutesToShortString : function(minutes) {
                    if (!minutes) {
                        return
                    }
                    var duration = criterion.Utils.minutesToDuration(minutes);

                    return criterion.Utils.durationToShortString(duration);
                },

                hoursToLongString : function(hrs) {
                    if (!hrs) {
                        return
                    }
                    var duration = criterion.Utils.hoursToDuration(hrs);

                    return criterion.Utils.durationToLongString(duration);
                },

                hoursToShortString : function(hrs) {
                    if (!hrs) {
                        return
                    }
                    var duration = criterion.Utils.hoursToDuration(hrs);

                    return criterion.Utils.durationToShortString(duration);
                },

                minutesToTimeString : function(minutes) {
                    if (!minutes) {
                        minutes = 0;
                    }

                    return criterion.Utils.minutesToTimeStr(minutes);
                },

                gettext : function(text) {
                    return text && i18n.gettext && i18n.gettext(text);
                }

            });
        }
    });

    Ext.define('Ext.locale.en.data.validator.Common', {
        override : 'Ext.data.validator.Bound',
        emptyMessage : i18n.gettext('Must be present')
    });

    Ext.define('Ext.locale.en.data.validator.Email', {
        override : 'Ext.data.validator.Email',
        message : i18n.gettext('Is not a valid email address')
    });

    Ext.define('Ext.locale.en.data.validator.Exclusion', {
        override : 'Ext.data.validator.Exclusion',
        message : i18n.gettext('Is a value that has been excluded')
    });

    Ext.define('Ext.locale.en.data.validator.Format', {
        override : 'Ext.data.validator.Format',
        message : i18n.gettext('Is in the wrong format')
    });

    Ext.define('Ext.locale.en.data.validator.Inclusion', {
        override : 'Ext.data.validator.Inclusion',
        message : i18n.gettext('Is not in the list of acceptable values')
    });

    Ext.define('Ext.locale.en.data.validator.Length', {
        override : 'Ext.data.validator.Length',
        minOnlyMessage : i18n.gettext('Length must be at least {0}'),
        maxOnlyMessage : i18n.gettext('Length must be no more than {0}'),
        bothMessage : i18n.gettext('Length must be between {0} and {1}')
    });

    Ext.define('Ext.locale.en.data.validator.Presence', {
        override : 'Ext.data.validator.Presence',
        message : i18n.gettext('Must be present')
    });

    Ext.define('Ext.locale.en.data.validator.Range', {
        override : 'Ext.data.validator.Range',
        minOnlyMessage : i18n.gettext('Must be must be at least {0}'),
        maxOnlyMessage : i18n.gettext('Must be no more than than {0}'),
        bothMessage : i18n.gettext('Must be between {0} and {1}'),
        nanMessage : i18n.gettext('Must be numeric')
    });

    Ext.define('Ext.locale.en.view.View', {
        override : 'Ext.view.View',
        emptyText : ''
    });

    Ext.define('Ext.locale.en.grid.plugin.DragDrop', {
        override : 'Ext.grid.plugin.DragDrop',
        dragText : i18n.gettext('{0} selected row{1}')
    });

    // changing the msg text below will affect the LoadMask
    Ext.define('Ext.locale.en.view.AbstractView', {
        override : 'Ext.view.AbstractView',
        loadingText : i18n.gettext('Loading...')
    });

    Ext.define('Ext.locale.en.picker.Date', {
        override : 'Ext.picker.Date',
        todayText : i18n.gettext('Today'),
        minText : i18n.gettext('This date is before the minimum date'),
        maxText : i18n.gettext('This date is after the maximum date'),
        disabledDaysText : '',
        disabledDatesText : '',
        nextText : i18n.gettext('Next Month (Control+Right)'),
        prevText : i18n.gettext('Previous Month (Control+Left)'),
        monthYearText : i18n.gettext('Choose a month (Control+Up/Down to move years)'),
        todayTip : '{0} (Spacebar)',
        format : 'm/d/y',
        startDay : 0
    });

    Ext.define('Ext.locale.en.picker.Month', {
        override : 'Ext.picker.Month',
        okText : '&#160;' + i18n.gettext('OK') + '&#160;',
        cancelText : i18n.gettext('Cancel')
    });

    Ext.define('Ext.locale.en.toolbar.Paging', {
        override : 'Ext.PagingToolbar',
        beforePageText : i18n.gettext('Page'),
        afterPageText : i18n.gettext('of {0}'),
        firstText : i18n.gettext('First Page'),
        prevText : i18n.gettext('Previous Page'),
        nextText : i18n.gettext('Next Page'),
        lastText : i18n.gettext('Last Page'),
        refreshText : i18n.gettext('Refresh'),
        displayMsg : i18n.gettext('Displaying {0} - {1} of {2}'),
        emptyMsg : i18n.gettext('No data to display')
    });

    Ext.define('Ext.locale.en.form.Basic', {
        override : 'Ext.form.Basic',
        waitTitle : i18n.gettext('Please Wait...')
    });

    Ext.define('Ext.locale.en.form.field.Base', {
        override : 'Ext.form.field.Base',
        invalidText : i18n.gettext('The value in this field is invalid')
    });

    Ext.define('Ext.locale.en.form.field.Text', {
        override : 'Ext.form.field.Text',
        minLengthText : i18n.gettext('The minimum length for this field is {0}'),
        maxLengthText : i18n.gettext('The maximum length for this field is {0}'),
        blankText : i18n.gettext('This field is required'),
        regexText : '',
        emptyText : null
    });

    Ext.define('Ext.locale.en.form.field.Number', {
        override : 'Ext.form.field.Number',
        decimalPrecision : 2,
        minText : i18n.gettext('The minimum value for this field is {0}'),
        maxText : i18n.gettext('The maximum value for this field is {0}'),
        nanText : i18n.gettext('{0} is not a valid number')
    });

    Ext.define('Ext.locale.en.form.field.Date', {
        override : 'Ext.form.field.Date',
        disabledDaysText : i18n.gettext('Disabled'),
        disabledDatesText : i18n.gettext('Disabled'),
        minText : i18n.gettext('The date in this field must be after {0}'),
        maxText : i18n.gettext('The date in this field must be before {0}'),
        invalidText : i18n.gettext('{0} is not a valid date - it must be in the format {1}'),
        format : 'm/d/y',
        altFormats : 'm/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d'
    });

    Ext.define('Ext.locale.en.form.field.ComboBox', {
        override : 'Ext.form.field.ComboBox',
        valueNotFoundText : undefined
    }, function() {
        Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
            loadingText : i18n.gettext('Loading...')
        });
    });

    Ext.define('Ext.locale.en.form.field.VTypes', {
        override : 'Ext.form.field.VTypes',
        emailText : i18n.gettext('This field should be an e-mail address in the format \'user@example.com\''),
        urlText : i18n.gettext('This field should be a URL in the format \'http:/') + '/www.example.com\'',
        alphaText : i18n.gettext('This field should only contain letters and _'),
        alphanumText : i18n.gettext('This field should only contain letters, numbers and _')
    });

    Ext.define('Ext.locale.en.form.field.HtmlEditor', {
        override : 'Ext.form.field.HtmlEditor',
        createLinkText : i18n.gettext('Please enter the URL for the link:')
    }, function() {
        Ext.apply(Ext.form.field.HtmlEditor.prototype, {
            buttonTips : {
                bold : {
                    title : i18n.gettext('Bold (Ctrl+B)'),
                    text : i18n.gettext('Make the selected text bold.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                italic : {
                    title : i18n.gettext('Italic (Ctrl+I)'),
                    text : i18n.gettext('Make the selected text italic.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                underline : {
                    title : i18n.gettext('Underline (Ctrl+U)'),
                    text : i18n.gettext('Underline the selected text.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                increasefontsize : {
                    title : i18n.gettext('Grow Text'),
                    text : i18n.gettext('Increase the font size.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                decreasefontsize : {
                    title : i18n.gettext('Shrink Text'),
                    text : i18n.gettext('Decrease the font size.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                backcolor : {
                    title : i18n.gettext('Text Highlight Color'),
                    text : i18n.gettext('Change the background color of the selected text.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                forecolor : {
                    title : i18n.gettext('Font Color'),
                    text : i18n.gettext('Change the color of the selected text.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyleft : {
                    title : i18n.gettext('Align Text Left'),
                    text : i18n.gettext('Align text to the left.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifycenter : {
                    title : i18n.gettext('Center Text'),
                    text : i18n.gettext('Center text in the editor.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                justifyright : {
                    title : i18n.gettext('Align Text Right'),
                    text : i18n.gettext('Align text to the right.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertunorderedlist : {
                    title : i18n.gettext('Bullet List'),
                    text : i18n.gettext('Start a bulleted list.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                insertorderedlist : {
                    title : i18n.gettext('Numbered List'),
                    text : i18n.gettext('Start a numbered list.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                createlink : {
                    title : i18n.gettext('Hyperlink'),
                    text : i18n.gettext('Make the selected text a hyperlink.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                },
                sourceedit : {
                    title : i18n.gettext('Source Edit'),
                    text : i18n.gettext('Switch to source editing mode.'),
                    cls : Ext.baseCSSPrefix + 'html-editor-tip'
                }
            }
        });
    });

    Ext.define('Ext.locale.en.grid.header.Container', {
        override : 'Ext.grid.header.Container',
        sortAscText : i18n.gettext('Sort Ascending'),
        sortDescText : i18n.gettext('Sort Descending'),
        columnsText : i18n.gettext('Columns')
    });

    Ext.define('Ext.locale.en.grid.GroupingFeature', {
        override : 'Ext.grid.feature.Grouping',
        emptyGroupText : i18n.gettext('(None)'),
        groupByText : i18n.gettext('Group by this field'),
        showGroupsText : i18n.gettext('Show in Groups')
    });

    Ext.define('Ext.locale.en.grid.PropertyColumnModel', {
        override : 'Ext.grid.PropertyColumnModel',
        nameText : i18n.gettext('Name'),
        valueText : i18n.gettext('Value'),
        dateFormat : 'm/j/Y',
        trueText : i18n.gettext('true'),
        falseText : i18n.gettext('false')
    });

    Ext.define('Ext.locale.en.grid.BooleanColumn', {
        override : 'Ext.grid.BooleanColumn',
        trueText : i18n.gettext('true'),
        falseText : i18n.gettext('false'),
        undefinedText : '&#160;'
    });

    Ext.define('Ext.locale.en.grid.NumberColumn', {
        override : 'Ext.grid.NumberColumn',
        format : '0,000.00'
    });

    Ext.define('Ext.locale.en.grid.DateColumn', {
        override : 'Ext.grid.DateColumn',
        format : 'm/d/Y'
    });

    Ext.define('Ext.locale.en.form.field.Time', {
        override : 'Ext.form.field.Time',
        minText : i18n.gettext('The time in this field must be equal to or after {0}'),
        maxText : i18n.gettext('The time in this field must be equal to or before {0}'),
        invalidText : i18n.gettext('{0} is not a valid time'),
        format : 'g:i A',
        altFormats : 'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H'
    });

    Ext.define('Ext.locale.en.form.field.File', {
        override : 'Ext.form.field.File',
        buttonText : i18n.gettext('Browse...')
    });

    Ext.define('Ext.locale.en.form.CheckboxGroup', {
        override : 'Ext.form.CheckboxGroup',
        blankText : i18n.gettext('You must select at least one item in this group')
    });

    Ext.define('Ext.locale.en.form.RadioGroup', {
        override : 'Ext.form.RadioGroup',
        blankText : i18n.gettext('You must select one item in this group')
    });

    Ext.define('Ext.locale.en.window.MessageBox', {
        override : 'Ext.window.MessageBox',
        buttonText : {
            ok : i18n.gettext('OK'),
            cancel : i18n.gettext('Cancel'),
            yes : i18n.gettext('Yes'),
            no : i18n.gettext('No')
        }
    });

    Ext.define('Ext.locale.en.grid.filters.Filters', {
        override : 'Ext.grid.filters.Filters',
        menuFilterText : i18n.gettext('Filters')
    });

    Ext.define('Ext.locale.en.grid.filters.filter.Boolean', {
        override : 'Ext.grid.filters.filter.Boolean',
        yesText : i18n.gettext('Yes'),
        noText : i18n.gettext('No')
    });

    Ext.define('Ext.locale.en.grid.filters.filter.Date', {
        override : 'Ext.grid.filters.filter.Date',
        fields : {
            lt : {text : i18n.gettext('Before')},
            gt : {text : i18n.gettext('After')},
            eq : {text : i18n.gettext('On')}
        },
        // Defaults to Ext.Date.defaultFormat
        dateFormat : null
    });

    Ext.define('Ext.locale.en.grid.filters.filter.List', {
        override : 'Ext.grid.filters.filter.List',
        loadingText : i18n.gettext('Loading...')
    });

    Ext.define('Ext.locale.en.grid.filters.filter.Number', {
        override : 'Ext.grid.filters.filter.Number',
        emptyText : i18n.gettext('Enter Number...')
    });

    Ext.define('Ext.locale.en.grid.filters.filter.String', {
        override : 'Ext.grid.filters.filter.String',
        emptyText : i18n.gettext('Enter Filter Text...')
    });

    Ext.define('Ext.locale.en.grid.RowEditor', {
        override : 'Ext.grid.RowEditor',

        saveBtnText : i18n.gettext('Update'),
        cancelBtnText : i18n.gettext('Cancel'),
        errorsText : i18n.gettext('Errors'),
        dirtyText : i18n.gettext('You need to commit or cancel your changes')
    });

    // This is needed until we can refactor all of the locales into individual files
    Ext.define('Ext.locale.en.Component', {
        override : 'Ext.Component'
    });

    return {};
});
