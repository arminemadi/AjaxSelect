var input = document.querySelector(".ajax-select-input");
input.addEventListener("focusin", function (e) {
    loadOptions();
});
input.addEventListener("input", function (e) {
    loadOptions();
});
function loadOptions() {
    var request = new XMLHttpRequest();
    request.open("get", "server.json");
    request.onload = function () {
        var elements = [];
        var currnetIndex = 0;
        request.response.forEach(function (item) {
            var inputValue = input.value;
            if (item.name.toLowerCase().indexOf(inputValue.toLowerCase()) != -1) {
                var element = document.createElement("div");
                element.classList.add("image-option");
                var image = document.createElement("img");
                image.src = item.path;
                element.insertAdjacentElement("afterbegin", image);
                var name_1 = document.createElement("span");
                name_1.textContent = item.name;
                element.insertAdjacentElement("beforeend", name_1);
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
//# sourceMappingURL=debug.js.map