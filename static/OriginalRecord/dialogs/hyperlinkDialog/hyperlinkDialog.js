var designer = GC.Spread.Sheets.Designer;
var HYPERLINK_HTML_PATH = '../dialogs/hyperlinkDialog';
var HYPERLINK_HTML_FILE_NAME = 'hyperlinkDialog.html';
var HYPERLINK_WBE_PAGE_DETAILS = "hyperlinkWebPageDetails";
var HYPERLINK_DOCUMENT_DETAILS = "hyperlinkDocumentDetails";
var HYPERLINK_EMAIL_DETAILS = "hyperlinkEmailDetails";
var emailExp = /^(mailto:\/\/)?\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/;
var SELECTED_TAB_COLOR = '#dbdbdb';
var LOCATION_PREFIX = 'sjs://';
var EMAIL_PREFIX = 'mailto:';
var DEFAULT_LINK_COLOR = '#0066cc';
var DEFAULT_VISITED_LINK_COLOR = '#3399ff';

var HyperlinkDialog = (function (_super) {
    designer.extends(HyperlinkDialog, _super);

    function HyperlinkDialog() {
        _super.call(this, designer.util.resolveHtmlPath(HYPERLINK_HTML_PATH, HYPERLINK_HTML_FILE_NAME), '.hyperlink-dialog');
    }

    HyperlinkDialog.prototype._initOptions = function () {
        var self = this;
        var options = { hyperlink: {} };
        return {
            resizable: false,
            width: 'auto',
            modal: true,
            title: designer.res.hyperlinkDialog.title,
            buttons: [
                {
                    text: designer.res.hyperlinkDialog.removeLink,
                    id: 'hyperlinkRemoveButton',
                    click: function () {
                        if (self.isSingleCell()) {
                            designer.actions.doAction('removeHyperlink', designer.wrapper.spread);
                        } else {
                            designer.actions.doAction('removeHyperlinks', designer.wrapper.spread);
                        }
                        self.clearDialogData();
                        self.close();
                        designer.wrapper.setFocusToSpread();
                    }
                },
                {
                    text: designer.res.ok,
                    click: function () {
                        var hyperlink = options.hyperlink;
                        hyperlink.url = '';
                        hyperlink.tooltip = self._element.find('#hyperlinkScreenTip').val();
                        options.text = self._element.find('#hyperlinkTextDisplay').val();
                        if (!isNaN(parseInt(options.text, 10))) {
                            options.text = parseInt(options.text, 10);
                        }
                        hyperlink.linkColor = self._element.find('.link-color-span').css('background-color');
                        hyperlink.visitedLinkColor = self._element.find('.visited-link-color-span').css('background-color');
                        hyperlink.target = self._element.find('#hyperlinkTarget').val();
                        hyperlink.drawUnderline = self._element.find('#hyperlinkDrawUnderline')[0].checked;

                        if (isNullOrUndefined(hyperlink.drawUnderline)) {
                            hyperlink.drawUnderline = true;
                        }
                        if (!hyperlink.linkColor || hyperlink.linkColor === 'rgba(0, 0, 0, 0)') {
                            hyperlink.linkColor = DEFAULT_LINK_COLOR;
                        }
                        if (!hyperlink.visitedLinkColor || hyperlink.visitedLinkColor === 'rgba(0, 0, 0, 0)') {
                            hyperlink.visitedLinkColor = DEFAULT_VISITED_LINK_COLOR;
                        }

                        options.activeCellRowIndex = self.sheet.getActiveRowIndex();
                        options.activeCellColunmIndex = self.sheet.getActiveColumnIndex();
                        var inputElement;
                        switch (self.currentLinkType) {
                            case HYPERLINK_WBE_PAGE_DETAILS:
                                inputElement = self._element.find('#hyperlinkAddress');
                                hyperlink.url = inputElement.val();
                                if (!hyperlink.url) { // If user input nothing, do not set the hyperlink.
                                    inputElement.css('border', 'solid lightpink');
                                    return;
                                } else {
                                    inputElement.css('border', '');
                                }
                                break;
                            case HYPERLINK_DOCUMENT_DETAILS:
                                inputElement = self._element.find('#hyperlinkCellReference');
                                hyperlink.url = inputElement.val();
                                if (!hyperlink.url) { // If user input nothing, do not set the hyperlink.
                                    inputElement.css('border', 'solid lightpink');
                                    return;
                                } else {
                                    inputElement.css('border', '');
                                }
                                var locationPrefixLen = LOCATION_PREFIX.length;
                                if (hyperlink.url.substring(0, locationPrefixLen) !== LOCATION_PREFIX) {
                                    hyperlink.url = LOCATION_PREFIX + hyperlink.url;
                                }
                                break;
                            case HYPERLINK_EMAIL_DETAILS:
                                inputElement = self._element.find('#hyperlinkEmailAddress');
                                var emailAddress = inputElement.val();
                                if (!emailAddress) {  // If user input nothing, do not set the hyperlink.
                                    inputElement.css('border', 'solid lightpink');
                                    return;
                                } else {
                                    inputElement.css('border', '');
                                }
                                var emailSubject = self._element.find('#hyperlinkEmailSubject').val();
                                if (emailSubject) {
                                    hyperlink.url = emailAddress + '?subject=' + emailSubject;
                                } else {
                                    hyperlink.url = emailAddress;
                                }
                                var emailPrefixLen = EMAIL_PREFIX.length;
                                if (hyperlink.url.substring(0, emailPrefixLen) !== EMAIL_PREFIX) {
                                    hyperlink.url = EMAIL_PREFIX + hyperlink.url;
                                }
                                break;
                        }
                        designer.actions.doAction("setHyperlinkAction", designer.wrapper.spread, options);
                        self.clearDialogData();
                        self.close();
                        designer.wrapper.setFocusToSpread();
                    }
                },
                {
                    text: designer.res.cancel,
                    click: function () {
                        self.clearDialogData();
                        self.close();
                        designer.wrapper.setFocusToSpread();
                    }
                }
            ]
        }
    };

    HyperlinkDialog.prototype._beforeOpen = function () {
        var self = this;
        self.spread = designer.wrapper.spread;
        self.sheet = self.spread.getActiveSheet();

        self.selections = self.sheet.getSelections();
        self.selection = self.selections[0];
        self.hyperlink = {};

        self.clearDialogData();
        self.perProcessTextData();
        self.changeHyperlinkType();
        self.preProcessDocument();
        self.setDefaultColor();
        self.processRemoveButton();
    };

    HyperlinkDialog.prototype._init = function () {
        var self = this;

        $(".link-color-container").colorpicker({
            valueChanged: function (e, value) {
                if (value.color === undefined) {
                    self._element.find('.link-color-span').css('background-color', "");
                } else {
                    self._element.find('.link-color-span').css('background-color', value.color);
                }
            },
            choosedColor: function (e, value) { /* NOSONAR: UnusedFunctionArgument */
                self._element.find('#hyperlink-dialog-link-color-selector').comboframe('close');
            },
            openColorDialog: function (e, value) { /* NOSONAR: UnusedFunctionArgument */
                self._element.find('#hyperlink-dialog-link-color-selector').comboframe('close');
            }
        });
        this._element.find("#hyperlink-dialog-link-color-selector").comboframe();
        $(".visited-link-color-container").colorpicker({
            valueChanged: function (e, value) {
                if (value.color === undefined) {
                    self._element.find('.visited-link-color-span').css('background-color', "");
                } else {
                    self._element.find('.visited-link-color-span').css('background-color', value.color);
                }
            },
            choosedColor: function (e, value) { /* NOSONAR: UnusedFunctionArgument */
                self._element.find('#hyperlink-dialog-visited-link-color-selector').comboframe('close');
            },
            openColorDialog: function (e, value) { /* NOSONAR: UnusedFunctionArgument */
                self._element.find('#hyperlink-dialog-visited-link-color-selector').comboframe('close');
            }
        });
        this._element.find("#hyperlink-dialog-visited-link-color-selector").comboframe();

        self.bindChangeTypeEvent();
    };

    HyperlinkDialog.prototype.changeHyperlinkType = function () {
        var self = this;

        self.webPageLinkEle.hide();

        self.documentLinkEle.hide();

        self.emailLinkEle.hide();

        self.currentLinkType = self.currentLinkType ? self.currentLinkType : HYPERLINK_WBE_PAGE_DETAILS;

        switch (self.currentLinkType) {
            case HYPERLINK_WBE_PAGE_DETAILS:
                self.webPageLinkEle.show();
                break;
            case HYPERLINK_DOCUMENT_DETAILS:
                self.documentLinkEle.show();
                break;
            case HYPERLINK_EMAIL_DETAILS:
                self.emailLinkEle.show();
                break;
        }
    };

    HyperlinkDialog.prototype.bindChangeTypeEvent = function () {
        var self = this;
        if (self.bindEvent) {
            return;
        }

        self.webPageLinkEle = $("#hyperlinkWebPageDetails");
        self.documentLinkEle = $("#hyperlinkDocumentDetails");
        self.emailLinkEle = $("#hyperlinkEmailDetails");

        self.currentLinkType = self.currentLinkType ? self.currentLinkType : HYPERLINK_WBE_PAGE_DETAILS;

        $("#hyperlinkWebPageDetailsLink").bind('click', function () {
            self.webPageLinkEle.show();
            self.documentLinkEle.hide();
            self.emailLinkEle.hide();
            self.currentLinkType = HYPERLINK_WBE_PAGE_DETAILS;
            self.setCurrentTabColor();
        });

        $("#hyperlinkDocumentDetailsLink").bind('click', function () {
            self.webPageLinkEle.hide();
            self.documentLinkEle.show();
            self.emailLinkEle.hide();
            self.currentLinkType = HYPERLINK_DOCUMENT_DETAILS;
            self.setCurrentTabColor();
        });

        $("#hyperlinkEmailDetailsLink").bind('click', function () {
            self.webPageLinkEle.hide();
            self.documentLinkEle.hide();
            self.emailLinkEle.show();
            self.currentLinkType = HYPERLINK_EMAIL_DETAILS;
            self.setCurrentTabColor();
        });

        self.bindEvent = true;
    };

    HyperlinkDialog.prototype.perProcessTextData = function () {
        var self = this;
        if (self.isSingleCell()) {
            var row = self.selection.row;
            var col = self.selection.col;
            self.hyperlink = self.getHyperlinkFromSingleCell();
            if (self.hyperlink) {
                if (self.hyperlink.url) {
                    var url = self.hyperlink.url;
                    var drawUnderline = self.hyperlink.drawUnderline;
                    url.toLowerCase();
                    if (url.indexOf('sjs://') !== -1 && (url.substring(0, LOCATION_PREFIX.length) === LOCATION_PREFIX)) {
                        self.currentLinkType = HYPERLINK_DOCUMENT_DETAILS;
                        $("#hyperlinkCellReference").val(url.split('sjs://')[1]);
                    } else if (url.match(emailExp) || (url.substring(0, EMAIL_PREFIX.length) === EMAIL_PREFIX)) {
                        self.currentLinkType = HYPERLINK_EMAIL_DETAILS;
                        if (url.substring(0, EMAIL_PREFIX.length) === EMAIL_PREFIX) {
                            url = url.substring(EMAIL_PREFIX.length, url.length);
                        }
                        $("#hyperlinkEmailAddress").val(url.split('?subject=')[0]);
                        $("#hyperlinkEmailSubject").val(url.split('?subject=')[1]);
                    } else {
                        self.currentLinkType = HYPERLINK_WBE_PAGE_DETAILS;
                        $("#hyperlinkAddress").val(url);
                    }
                    $("#hyperlinkTextDisplay").val(self.sheet.getText(row, col));
                    $("#hyperlinkScreenTip").val(self.hyperlink.tooltip);
                    if (isNullOrUndefined(drawUnderline)) {
                        $('#hyperlinkDrawUnderline').prop("checked", "checked");
                    } else if (drawUnderline) {
                        $('#hyperlinkDrawUnderline').prop("checked", "checked");
                    }
                    $("#hyperlinkTarget").val(self.hyperlink.target);
                    self.setCurrentTabColor();
                }
            } else {
                self.currentLinkType = HYPERLINK_WBE_PAGE_DETAILS;
                self.setCurrentTabColor();
                $("#hyperlinkTextDisplay").val(self.sheet.getText(row, col));
                $('#hyperlinkDrawUnderline').removeProp('checked');
            }
        }
    };

    HyperlinkDialog.prototype.preProcessDocument = function () {
        var self = this;
        var sheets = self.spread.sheets;
        var sheetItemContainer = $("#hyperlinkSheetName");
        sheetItemContainer.empty();
        self.currentSelectPlaceName = '';
        for (var i = 0, len = sheets.length; i < len; i++) {
            self.createSheetEle(sheets, sheetItemContainer, i);
        }

        var activeSheet = self.spread.getActiveSheet();
        var definedNamesContainer = $("#hyperlinkDefinedNames");
        definedNamesContainer.empty();
        var definedNames = designer.wrapper.spread.getCustomNames();
        for (var j = 0, length = definedNames.length; j < length; j++) {
            self.createSpreadNamesEle(definedNames, activeSheet, definedNamesContainer, j);
        }

        for (var m = 0, sheetsLength = sheets.length; m < sheetsLength; m++) {
            var currentSheet = sheets[m];
            var sheetDefinedNames = currentSheet.getCustomNames();
            for (var n = 0, sheetDefinedNamesLength = sheetDefinedNames.length; n < sheetDefinedNamesLength; n++) {
                self.createSheetNamesEle(sheetDefinedNames, currentSheet, definedNamesContainer, n);
            }
        }

        // selected sheet location or definedName item need highlight in Hyperlink dialog.
        if (this.currentLinkType === HYPERLINK_DOCUMENT_DETAILS) {
            var text = $("#hyperlinkTextDisplay").val();
            var elementId = '#' + text;
            if (text.indexOf('!') === -1) {
                if (definedNamesContainer.find(elementId).length === 1) {
                    definedNamesContainer.find(elementId).css('background-color', SELECTED_TAB_COLOR);
                    self.currentSelectPlaceName = text;
                }
            } else {
                text = text.split('!')[0];
                elementId = '#' + text;
                if (sheetItemContainer.find(elementId).length === 1) {
                    sheetItemContainer.find(elementId).css('background-color', SELECTED_TAB_COLOR);
                    self.currentSelectPlaceName = text;
                }
            }
        }
    };

    HyperlinkDialog.prototype.createSheetEle = function (sheets, sheetItemContainer, index) {
        var self = this;
        var sheetItemId = sheets[index].name();
        var sheetItemEle = document.createElement('div');
        sheetItemEle.setAttribute('id', sheetItemId);
        sheetItemEle.innerText = sheetItemId;
        sheetItemEle = $(sheetItemEle);
        sheetItemEle.css('margin-left', '15px');
        sheetItemEle.bind('click', function () {
            $('.activeSelect').removeClass('activeSelect');
            sheetItemEle.addClass('activeSelect');
            self.currentSelectPlaceName = sheetItemId;
            $("#hyperlinkCellReference").val(sheetItemId + '!A1').removeAttr('disabled');
        });
        sheetItemContainer.append(sheetItemEle);
    };

    HyperlinkDialog.prototype.createSpreadNamesEle = function (definedNames, activeSheet, definedNamesContainer, index) {
        var self = this;
        var definedNameItemId = definedNames[index].getName();
        self.createDefinedNamesEle(definedNameItemId, definedNames, activeSheet, definedNamesContainer, index);
    };

    HyperlinkDialog.prototype.createSheetNamesEle = function (definedNames, activeSheet, definedNamesContainer, index) {
        var self = this;
        var definedNameItemId = activeSheet.name() + '!' + definedNames[index].getName();
        self.createDefinedNamesEle(definedNameItemId, definedNames, activeSheet, definedNamesContainer, index);
    };

    HyperlinkDialog.prototype.createDefinedNamesEle = function (definedNameItemId, definedNames, activeSheet, definedNamesContainer, index) {
        var self = this;
        var definedNameItemEle = document.createElement('div');
        definedNameItemEle.setAttribute('id', definedNameItemId);
        definedNameItemEle.innerText = definedNameItemId;
        definedNameItemEle = $(definedNameItemEle);
        definedNameItemEle.css('margin-left', '15px');
        definedNameItemEle.bind('click', function () {
            definedNameItemEle.css('background-color', SELECTED_TAB_COLOR);
            if (self.currentSelectPlaceName) {
                var currentSelectPlaceNameEle = document.getElementById(self.currentSelectPlaceName);
                $(currentSelectPlaceNameEle).css('background-color', 'white');
            }
            self.currentSelectPlaceName = definedNameItemId;
            var documentReferenceFormula = self._unparse(null, definedNames[index].getExpression(), activeSheet.getActiveRowIndex(), activeSheet.getActiveColumnIndex());
            $("#hyperlinkCellReference")
                .val(documentReferenceFormula.split('$').join(""))
                .attr('disabled', 'disabled');
        });
        definedNamesContainer.append(definedNameItemEle);
    };

    HyperlinkDialog.prototype.isSingleCell = function () {
        var self = this;
        var selections = self.selections;
        if (selections.length === 1) {
            var selection = selections[0];
            var rowCount = selection.rowCount;
            var colCount = selection.colCount;
            if (rowCount === 1 && colCount === 1) {
                return true;
            }
        }

        return false;
    };

    HyperlinkDialog.prototype.clearDialogData = function () {
        $("#hyperlinkSheetName").empty();
        $("#hyperlinkDefinedNames").empty();

        $('#hyperlinkTextDisplay').val('');
        $('#hyperlinkScreenTip').val('');
        $('#hyperlinkDrawUnderline').removeProp('checked');

        $('#hyperlinkAddress').val('').css('border', '');
        $('#hyperlinkCellReference').val('').css('border', '');
        $('#hyperlinkEmailAddress').val('').css('border', '');
        $('#hyperlinkEmailSubject').val('');
        $('#hyperlinkTarget').val(0);
    };

    HyperlinkDialog.prototype.getHyperlinkFromSingleCell = function () {
        var self = this;
        if (self.isSingleCell()) {
            var row = self.selection.row;
            var col = self.selection.col;
            return self.sheet.getHyperlink(row, col);
        }
        return null;
    };

    HyperlinkDialog.prototype.setDefaultColor = function () {
        var self = this;
        var colorItem;
        var linkColorPicker = $(".link-color-container");
        var linkColorSpan = this._element.find(".link-color-span");
        var visitedLinkColorPicker = $(".visited-link-color-container");
        var visitedLinkColorSpan = this._element.find(".visited-link-color-span");

        linkColorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());
        visitedLinkColorPicker.colorpicker("option", "themeColors", designer.wrapper.getThemeColors());

        if (self.hyperlink && self.hyperlink.linkColor) {
            colorItem = designer.ColorHelper.parse(self.hyperlink.linkColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
            linkColorPicker.colorpicker('option', 'selectedItem', colorItem);
            linkColorSpan.css("background-color", colorItem.color);
        } else {
            linkColorPicker.colorpicker('option', 'selectedItem', null);
            linkColorSpan.css("background-color", DEFAULT_LINK_COLOR);
        }

        if (self.hyperlink && self.hyperlink.visitedLinkColor) {
            colorItem = designer.ColorHelper.parse(self.hyperlink.visitedLinkColor, designer.wrapper.spread.getActiveSheet().currentTheme().colors());
            visitedLinkColorPicker.colorpicker('option', 'selectedItem', colorItem);
            visitedLinkColorSpan.css("background-color", colorItem.color);
        } else {
            visitedLinkColorPicker.colorpicker('option', 'selectedItem', null);
            visitedLinkColorSpan.css("background-color", DEFAULT_VISITED_LINK_COLOR);
        }
    };

    HyperlinkDialog.prototype.setCurrentTabColor = function () {
        var self = this;
        var webPageLinkEle = $(".hyperlink-web-page");
        var documentLinkEle = $(".hyperlink-document");
        var emailLinkEle = $(".hyperlink-email");

        switch (self.currentLinkType) {
            case HYPERLINK_WBE_PAGE_DETAILS:
                webPageLinkEle.css('background-color', SELECTED_TAB_COLOR);
                documentLinkEle.css('background-color', '');
                emailLinkEle.css('background-color', '');
                break;
            case HYPERLINK_DOCUMENT_DETAILS:
                webPageLinkEle.css('background-color', '');
                documentLinkEle.css('background-color', SELECTED_TAB_COLOR);
                emailLinkEle.css('background-color', '');
                break;
            case HYPERLINK_EMAIL_DETAILS:
                webPageLinkEle.css('background-color', '');
                documentLinkEle.css('background-color', '');
                emailLinkEle.css('background-color', SELECTED_TAB_COLOR);
                break;
        }
    };

    HyperlinkDialog.prototype.processRemoveButton = function () {
        var removeButton = $("#hyperlinkRemoveButton");
        var self = this;
        if (self.isSingleCell() && !self.getHyperlinkFromSingleCell()) {
            removeButton.attr('disabled', 'disabled');
            removeButton.addClass('ui-state-hover');
        } else {
            removeButton.removeAttr('disabled');
            removeButton.removeClass('ui-state-hover');
        }
    };

    return HyperlinkDialog;
})(designer.BaseDialog);
designer.HyperlinkDialog = HyperlinkDialog;

function isNullOrUndefined(value) {
    return value === undefined || value === null;
}