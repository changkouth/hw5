/*
1. Display the name of item that is currently selected
2. One select element that has all categories appear in the data 
3. One select element that has all items belongs to the category selected by the first element 
4. Both select element should have default value inititally
*/

const API = (() => {
    const URL = "http://localhost:3000/items"
    const getItems = () => fetch(URL).then((data) => data.json());
    const postItem = (item) => {
        fetch(URL, {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((data) => data.json);
    }
    return {getItems, postItem};

})();

API.getItems();


const Model = (() => {
    class State {
        //private field 
        #items;
        #onChange;
        constructor() {
            this.#items = [];
        }

        get items() {
            return this.#items;
        }

        set items(newItems) {
            this.#items = newItems;
            //update view
            this.#onChange();
        }

        subscribe(cb) {
            this.#onChange = cb;
        }
    }

    const {getItems, postItem}  = API;
    return { State, getItems, postItem };

})()

const View = (() => {
    const changeCategory = document.getElementById("category");
    const changeItem = document.getElementById("item");
    const selectItemValue = document.querySelector(".fruitoption-container");


    const selectValue = document.querySelector(".categoryoption-container");
    const headerItem = document.querySelector(".header");
    const categoryoptionElem = document.querySelector(".categoryoption-container");
    const fruitoptionElem = document.querySelector(".fruitoption-container");

    const getSelectValue = () => selectValue.value;
    const getSelectItemValue = () => selectItemValue.value;

    const renderMeatItems = (items) => {
        const arrOut = [];
        let itemMeatTemp = "";
        let itemTempHeader = "";

        items.forEach(item => {
            if(item.name && item.category === 'meat') {
                arrOut.push(item.name);
            }
        })
        arrOut.forEach(m => {
            const optionElement = `<option>${m}</option>`;
            itemMeatTemp += optionElement;
        })

        if (arrOut.length !== 0) {
            const strongElement = `<strong>${arrOut[0]}`;
            itemTempHeader += strongElement;
        }
        
        fruitoptionElem.innerHTML = itemMeatTemp;
        headerItem.innerHTML = itemTempHeader;
    }

    const renderTitle = (title) => {
        let itemTempHeader = "";
       
        const strongElement = `<strong>${title}`;
        itemTempHeader += strongElement;
     
        headerItem.innerHTML = itemTempHeader;

    }

    const renderVeggieItems = (items) => {
        const arrOut = [];
        let itemVeggieTemp = "";
        let itemTempHeader = "";

        items.forEach(item => {
            if(item.name && item.category === 'vegetable') {
                arrOut.push(item.name);
            }
        })
        arrOut.forEach(v => {
            const optionElement = `<option>${v}</option>`;
            itemVeggieTemp += optionElement;
        })

        if (arrOut.length !== 0) {
            const strongElement = `<strong>${arrOut[0]}`;
            itemTempHeader += strongElement;
        }

        fruitoptionElem.innerHTML = itemVeggieTemp;
        headerItem.innerHTML = itemTempHeader;
    }
   
    const renderItems = (items) => {
        let itemTemp = "";
        let itemFruitTemp = "";
        let itemTempHeader = "";

        const arrOut = [];
        const arrFruit = [];
       
        items.forEach(item => {
            if (item.name && item.category === 'fruit') {
                arrFruit.push(item.name);
            } 
            arrOut.push(item.category);
        })
       
        const uniqueArray = arrOut.filter(function(item, pos) {
            return arrOut.indexOf(item) == pos;
        })
        uniqueArray.forEach(c => {
            const optionElement = `<option>${c}</option>`;
            itemTemp += optionElement;
        })
        
        arrFruit.forEach(f => {
            const optionElement = `<option>${f}</option>`;
            itemFruitTemp += optionElement;
    
        })

        if (arrFruit.length !== 0) {
            const strongElement = `<strong>${arrFruit[0]}`;
            itemTempHeader += strongElement;
        }

        categoryoptionElem.innerHTML = itemTemp;
        fruitoptionElem.innerHTML = itemFruitTemp;
        headerItem.innerHTML = itemTempHeader;
    }

    return {
        renderItems,
        renderTitle,
        changeCategory,
        changeItem,
        getSelectValue,
        getSelectItemValue,
        renderVeggieItems,
        renderMeatItems
    }
})()

const Controller = ((view, model) => {
    const state = new model.State();

    const handleSelectItem = () => {
        view.changeItem.addEventListener("change", ()=> {
            const inputElement = view.getSelectItemValue();
            view.renderTitle(inputElement);
        });
    }

    const handleSelect = () => {
        view.changeCategory.addEventListener("change", ()=> {
            const inputElement = view.getSelectValue();
            if (inputElement === 'vegetable') {
                const vegetableArr = state.items;
                view.renderVeggieItems(vegetableArr);
            } else if (inputElement === 'meat') {
                const meatArr = state.items;
                view.renderMeatItems(meatArr);
            } else if (inputElement === 'fruit') {
                const fruitArr = state.items;
                view.renderItems(fruitArr);
            }
        });
    }

    const init = () => {
        model.getItems().then(data => {
            state.items = data;
        })
    }
    const bootstrap = () => {
        init();
        state.subscribe(() => {
            view.renderItems(state.items)
        })
        handleSelect();
        handleSelectItem();
    }
    return {
        bootstrap
    }

})(View, Model);

Controller.bootstrap();