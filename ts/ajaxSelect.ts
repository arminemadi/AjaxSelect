var ajaxSelects: {[id:string] : AjaxSelect} = {};
class AjaxSelect{
    private classes = {
        container:"ajax-select",
        input:"ajax-select-input",
        options:"ajax-select-options",
        option:"ajax-select-option",
        showOptions: "show"
    };
    private attributes = {
        value:"data-value",
        name:"data-name",
        index:"data-index"
    };

    private origianalSelect:HTMLElement;

    private container:HTMLElement;
    private input:HTMLInputElement;
    private options:HTMLElement;

    private index:number = 1;
    private showingOptions:boolean = false;
    constructor(id:string) {
        this.origianalSelect = document.getElementById(id);
        this.build();
    }
    //Common functions
    private build(){
        this.hideOriginalSelect();
        this.buildContainer();
        this.buildInput();
        this.buildOptions();
        this.origianalSelect.insertAdjacentElement("afterend" , this.container);

    }
    private reset(){
        this.index = 1;
        this.options.innerHTML = "";
    }
    //End of common functions



    //Original select functions
    private hideOriginalSelect():void{
        this.origianalSelect.classList.add("hide-select");
    }
    private getOrignalSelectSelectChoosedItemAsJson(){
        let selectedOption = this.origianalSelect.querySelector("option[selected]");
        if(selectedOption == null)
            return {name:"" , value:""};
        return { name: selectedOption.textContent , value: selectedOption.getAttribute("value")}
    }
    //End of select functions



    // Container functions
    private buildContainer():void{
        this.container = document.createElement("div");
        this.container.classList.add(this.classes.container);
    }
    // End of container functions

    //Input fucntions
    private buildInput():void{
        this.input = document.createElement("input");
        let selectedItem = this.getOrignalSelectSelectChoosedItemAsJson();
        this.input.value = selectedItem.name;
        this.input.classList.add(this.classes.input);
        this.setupInputEvents();
        this.container.insertAdjacentElement("afterbegin", this.input);
    }
    private setupInputEvents() {
        this.input.addEventListener("focusin", (e) => {
            this.showOptions();
        });
        this.input.addEventListener("focusout", (e) => {
            this.hideOptions();
        });
        this.input.addEventListener("keydown", e => this.processKeyboardForOption(e));
    }
    //End of Input fucntions

    //Options functions
    private buildOptions(){
        this.options = document.createElement("div");
        this.options.classList.add(this.classes.options);
        this.setupOptionsEvent();
        this.container.insertAdjacentElement("beforeend" , this.options);
    }
    private setupOptionsEvent() {
        this.options.addEventListener("mouseenter", e => {
            this.removeHoverEffectFromAllOptions();
        });
    }
    private showOptions():void{
        if(this.showingOptions == false)
        {
            this.focusOnIndexedOption();
            this.options.classList.add(this.classes.showOptions);
            this.showingOptions = true;
        }
    }
    private hideOptions():void{
        if(this.showingOptions){
            this.options.classList.remove(this.classes.showOptions);
            this.index = 1;
            this.showingOptions = false;
        }
    }
    //End of Options functions


    
    // Option functions
    public setOptions(optionsList:Array<HTMLElement>){
        this.reset();
        optionsList.forEach((item , i)=>{
            this.buildOption(item, i);
        });
    }
    private buildOption(element: HTMLElement, index: number) {
        this.setupOptionEvents(element);
        this.setOptionClass(element);
        this.setOptionIndex(element, index);
        this.setOptionMouseMove(element);
        this.selectOptionIfAlreadySelected(element);
        this.options.insertAdjacentElement("beforeend", element);
    }
    private setupOptionEvents(item: HTMLElement) {
        item.addEventListener("click", e => this.selectOption(item));
    }
    private selectOptionIfAlreadySelected(item: HTMLElement) {
        var selectedOption = this.getOrignalSelectSelectChoosedItemAsJson();
        var itemValue = item.getAttribute(this.attributes.value);
        if (selectedOption.value == itemValue) {
            item.classList.add("selected");
        }
    }
    private setOptionMouseMove(item: HTMLElement) {
        item.addEventListener("mousemove", (e) => {
            this.index = Number(item.getAttribute(this.attributes.index));
            this.removeHoverEffectFromAllOptions();
            if (item.classList.contains("hover") == false) {
                item.classList.add("hover");
            }
        });
    }
    private setOptionIndex(item: HTMLElement, i: number) {
        if (item.hasAttribute(this.attributes.index) == false) {
            item.setAttribute(this.attributes.index, (i + 1).toString());
        }
    }
    private setOptionClass(item: HTMLElement) {
        if (item.classList.contains(this.classes.option) == false) {
            item.classList.add(this.classes.option);
        }
    }
    private selectOption(option:HTMLElement){
        this.setOriginalSelectSelectedItem(option);
        this.removeHoverEffectFromAllOptions();
        this.clearSelectedOptionEffect();
        option.classList.add("selected");
        let name = option.getAttribute(this.attributes.name);
        this.input.value = name;
    }
    private setOriginalSelectSelectedItem(option:HTMLElement){
        this.origianalSelect.innerHTML = "";
        let value = option.getAttribute(this.attributes.value);
        var selectedOption = document.createElement("option");
        selectedOption.setAttribute("value" , value);
        selectedOption.setAttribute("selected" , "");
        this.origianalSelect.insertAdjacentElement("afterbegin" , selectedOption);
    }
    private clearSelectedOptionEffect(){
        this.options.querySelectorAll(".selected").forEach(item=>{
            item.classList.remove("selected");
        });
    }
    private processKeyboardForOption(e:KeyboardEvent){
        if(e.keyCode == 38){
            this.focusOnPrevOption();
        }
        else if(e.keyCode == 40){
            this.focusOnNextOption();
        }
        else if(e.keyCode == 13){
            this.getCurrnetIndexOptionElement().click();
            this.input.blur();
        }
    }
    private focusOnNextOption(){
        let optionsCount = this.options.querySelectorAll(`.${this.classes.option}`).length;
         if(this.index + 1 > optionsCount)
             this.index = 1;
         else
             this.index++;
         this.focusOnIndexedOption();
    }
     private focusOnPrevOption(){
         let optionsCount = this.options.querySelectorAll(`.${this.classes.option}`).length;
         if(this.index - 1 < 1)
             this.index = optionsCount;
         else
             this.index--;
         this.focusOnIndexedOption();
    }
     private focusOnIndexedOption(){
        this.removeHoverEffectFromAllOptions();
        let option = this.getCurrnetIndexOptionElement();
        if(option != null){
            option.classList.add("hover");
        }
    }
    private getCurrnetIndexOptionElement():HTMLElement{
        return this.options.querySelector(`.${this.classes.option}:nth-child(${this.index})`);
    }
    private removeHoverEffectFromAllOptions(){
        let hoverdedOptions = this.options.querySelectorAll(`.${this.classes.option}.hover`);
        hoverdedOptions.forEach(item=>{
            item.classList.remove("hover");
        })
    }
    //End of option functions
}

function ajaxSelect(id){
    ajaxSelects[id] = new AjaxSelect(id);
}
function setOptions(id:string , options:Array<HTMLElement>){
    ajaxSelects[id].setOptions(options);
}
