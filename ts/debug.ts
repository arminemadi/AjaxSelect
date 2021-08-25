var input:HTMLInputElement = document.querySelector(".ajax-select-input");
input.addEventListener("focusin" , e=>{
    loadOptions();
});
input.addEventListener("input" , e=>{
    loadOptions();
});

function loadOptions() {
    let request = new XMLHttpRequest();
    request.open("get", "server.json");
    request.onload = () => {
        let elements: Array<HTMLElement> = [];
        let currnetIndex = 0;
        request.response.forEach(item => {
            var inputValue = input.value;
            if (item.name.toLowerCase().indexOf(inputValue.toLowerCase()) != -1) {
                let element = document.createElement("div");
                element.classList.add("image-option");


                let image = document.createElement("img");
                image.src = item.path;
                element.insertAdjacentElement("afterbegin" , image);

                let name = document.createElement("span");
                name.textContent =item.name;
                element.insertAdjacentElement("beforeend" , name);

                element.setAttribute("data-name", item.name);
                element.setAttribute("data-value", item.value);
                elements[currnetIndex] = element;
                currnetIndex++;
            }
        });
        setOptions("ajaxSelect", elements);
    };
    request.responseType = "json";
    request.send();
}
