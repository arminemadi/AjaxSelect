var ajaxSelects = {};
var AjaxSelect = /** @class */ (function () {
    function AjaxSelect(id) {
        this.classes = {
            container: "ajax-select",
            input: "ajax-select-input",
            options: "ajax-select-options",
            option: "ajax-select-option",
            showOptions: "show"
        };
        this.attributes = {
            value: "data-value",
            name: "data-name",
            index: "data-index"
        };
        this.index = 1;
        this.showingOptions = false;
        this.origianalSelect = document.getElementById(id);
        this.build();
    }
    //Common functions
    AjaxSelect.prototype.build = function () {
        this.hideOriginalSelect();
        this.buildContainer();
        this.buildInput();
        this.buildOptions();
        this.origianalSelect.insertAdjacentElement("afterend", this.container);
    };
    AjaxSelect.prototype.reset = function () {
        this.index = 1;
        this.options.innerHTML = "";
    };
    //End of common functions
    //Original select functions
    AjaxSelect.prototype.hideOriginalSelect = function () {
        this.origianalSelect.classList.add("hide-select");
    };
    AjaxSelect.prototype.getOrignalSelectSelectChoosedItemAsJson = function () {
        var selectedOption = this.origianalSelect.querySelector("option[selected]");
        if (selectedOption == null)
            return { name: "", value: "" };
        return { name: selectedOption.textContent, value: selectedOption.getAttribute("value") };
    };
    //End of select functions
    // Container functions
    AjaxSelect.prototype.buildContainer = function () {
        this.container = document.createElement("div");
        this.container.classList.add(this.classes.container);
    };
    // End of container functions
    //Input fucntions
    AjaxSelect.prototype.buildInput = function () {
        this.input = document.createElement("input");
        var selectedItem = this.getOrignalSelectSelectChoosedItemAsJson();
        this.input.value = selectedItem.name;
        this.input.classList.add(this.classes.input);
        this.setupInputEvents();
        this.container.insertAdjacentElement("afterbegin", this.input);
    };
    AjaxSelect.prototype.setupInputEvents = function () {
        var _this = this;
        this.input.addEventListener("focusin", function (e) {
            _this.showOptions();
        });
        this.input.addEventListener("focusout", function (e) {
            _this.hideOptions();
        });
        this.input.addEventListener("keydown", function (e) { return _this.processKeyboardForOption(e); });
    };
    //End of Input fucntions
    //Options functions
    AjaxSelect.prototype.buildOptions = function () {
        this.options = document.createElement("div");
        this.options.classList.add(this.classes.options);
        this.setupOptionsEvent();
        this.container.insertAdjacentElement("beforeend", this.options);
    };
    AjaxSelect.prototype.setupOptionsEvent = function () {
        var _this = this;
        this.options.addEventListener("mouseenter", function (e) {
            _this.removeHoverEffectFromAllOptions();
        });
    };
    AjaxSelect.prototype.showOptions = function () {
        if (this.showingOptions == false) {
            this.focusOnIndexedOption();
            this.options.classList.add(this.classes.showOptions);
            this.showingOptions = true;
        }
    };
    AjaxSelect.prototype.hideOptions = function () {
        if (this.showingOptions) {
            this.options.classList.remove(this.classes.showOptions);
            this.index = 1;
            this.showingOptions = false;
        }
    };
    //End of Options functions
    // Option functions
    AjaxSelect.prototype.setOptions = function (optionsList) {
        var _this = this;
        this.reset();
        optionsList.forEach(function (item, i) {
            _this.buildOption(item, i);
        });
    };
    AjaxSelect.prototype.buildOption = function (element, index) {
        this.setupOptionEvents(element);
        this.setOptionClass(element);
        this.setOptionIndex(element, index);
        this.setOptionMouseMove(element);
        this.selectOptionIfAlreadySelected(element);
        this.options.insertAdjacentElement("beforeend", element);
    };
    AjaxSelect.prototype.setupOptionEvents = function (item) {
        var _this = this;
        item.addEventListener("click", function (e) { return _this.selectOption(item); });
    };
    AjaxSelect.prototype.selectOptionIfAlreadySelected = function (item) {
        var selectedOption = this.getOrignalSelectSelectChoosedItemAsJson();
        var itemValue = item.getAttribute(this.attributes.value);
        if (selectedOption.value == itemValue) {
            item.classList.add("selected");
        }
    };
    AjaxSelect.prototype.setOptionMouseMove = function (item) {
        var _this = this;
        item.addEventListener("mousemove", function (e) {
            _this.index = Number(item.getAttribute(_this.attributes.index));
            _this.removeHoverEffectFromAllOptions();
            if (item.classList.contains("hover") == false) {
                item.classList.add("hover");
            }
        });
    };
    AjaxSelect.prototype.setOptionIndex = function (item, i) {
        if (item.hasAttribute(this.attributes.index) == false) {
            item.setAttribute(this.attributes.index, (i + 1).toString());
        }
    };
    AjaxSelect.prototype.setOptionClass = function (item) {
        if (item.classList.contains(this.classes.option) == false) {
            item.classList.add(this.classes.option);
        }
    };
    AjaxSelect.prototype.selectOption = function (option) {
        this.setOriginalSelectSelectedItem(option);
        this.removeHoverEffectFromAllOptions();
        this.clearSelectedOptionEffect();
        option.classList.add("selected");
        var name = option.getAttribute(this.attributes.name);
        this.input.value = name;
    };
    AjaxSelect.prototype.setOriginalSelectSelectedItem = function (option) {
        this.origianalSelect.innerHTML = "";
        var value = option.getAttribute(this.attributes.value);
        var selectedOption = document.createElement("option");
        selectedOption.setAttribute("value", value);
        selectedOption.setAttribute("selected", "");
        this.origianalSelect.insertAdjacentElement("afterbegin", selectedOption);
    };
    AjaxSelect.prototype.clearSelectedOptionEffect = function () {
        this.options.querySelectorAll(".selected").forEach(function (item) {
            item.classList.remove("selected");
        });
    };
    AjaxSelect.prototype.processKeyboardForOption = function (e) {
        if (e.keyCode == 38) {
            this.focusOnPrevOption();
        }
        else if (e.keyCode == 40) {
            this.focusOnNextOption();
        }
        else if (e.keyCode == 13) {
            this.getCurrnetIndexOptionElement().click();
            this.input.blur();
        }
    };
    AjaxSelect.prototype.focusOnNextOption = function () {
        var optionsCount = this.options.querySelectorAll("." + this.classes.option).length;
        if (this.index + 1 > optionsCount)
            this.index = 1;
        else
            this.index++;
        this.focusOnIndexedOption();
    };
    AjaxSelect.prototype.focusOnPrevOption = function () {
        var optionsCount = this.options.querySelectorAll("." + this.classes.option).length;
        if (this.index - 1 < 1)
            this.index = optionsCount;
        else
            this.index--;
        this.focusOnIndexedOption();
    };
    AjaxSelect.prototype.focusOnIndexedOption = function () {
        this.removeHoverEffectFromAllOptions();
        var option = this.getCurrnetIndexOptionElement();
        if (option != null) {
            option.classList.add("hover");
        }
    };
    AjaxSelect.prototype.getCurrnetIndexOptionElement = function () {
        return this.options.querySelector("." + this.classes.option + ":nth-child(" + this.index + ")");
    };
    AjaxSelect.prototype.removeHoverEffectFromAllOptions = function () {
        var hoverdedOptions = this.options.querySelectorAll("." + this.classes.option + ".hover");
        hoverdedOptions.forEach(function (item) {
            item.classList.remove("hover");
        });
    };
    return AjaxSelect;
}());
function ajaxSelect(id) {
    ajaxSelects[id] = new AjaxSelect(id);
}
function setOptions(id, options) {
    ajaxSelects[id].setOptions(options);
}
//# sourceMappingURL=ajaxSelect.js.map