
//UI interface module
var UIcontroller = (function(){

	//variable for DOM manipulating
	var addDom = {
		type: ".addType",
		description: ".addDescription",
		value: ".addValue",
		button: ".addbtn",
		incomeList: ".incomeList",
		expenseList: ".expenseList",
		budgetLabel: ".budgetValue",
		expenseLabel: ".budgetExpenseValue",
		incomeLabel: ".budgetIncomeValue",
		percentageLabel: ".budgetExpensePercentage",
		container: ".container",
		expensePercentage: ".itemPercentage",
		datalabel: ".budgetTitleMonth"
	}

	var displayNum = function(num, type){
		var numSplit, int, dec;

		num = Math.abs(num)
		num = num.toFixed(2)
		numSplit = num.split(".")
		int = numSplit[0]
		dec = numSplit[1]

		if(int.length < 7 && int.length > 3){
			int = int.substring(0, int.length - 3) + "," + int.substring(int.length - 3, int.length)
		}else if(int.length >= 7){
			int = int.substring(0, int.length - 6) + "," + int.substring(int.length - 6, int.length - 3) + "," + int.substring(int.length - 3, int.length)
		}

		return (type === "expense" ? "- " : "+ ") + int + "." + dec
	}

	var listForEach = function(list ,callback){
		for(var i = 0; i < list.length; i++){
			callback(list[i], i)
		}
	}

	//return two methods for getting the inputs and the DOM string
	return{
		getInput: function(){
			return {
				type: document.querySelector(addDom.type).value,
				description: document.querySelector(addDom.description).value,
				value: parseFloat(document.querySelector(addDom.value).value)
			}	
		},
		getDom: function(){
			return addDom
		},
		addListItem: function(obj, type){
			var html, newHtml, element

			if(type === "income"){
				html = '<div id="income-%id%" class="item clearfix"><div class="itemDescription">%description%</div><div class="right clearfix"><div class="itemValue">%value%</div><div class="itemDelete"><button class="itemDeletebtn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				element = addDom.incomeList
			}else{
				html = '<div id="expense-%id%" class="item clearfix"><div class="itemDescription">%description%</div><div class="right clearfix"><div class="itemValue">%value%</div><div class="itemPercentage"></div><div class="itemDelete"><button class="itemDeletebtn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				element = addDom.expenseList
			}

			newHtml = html.replace("%id%", obj.id)
			newHtml = newHtml.replace("%description%", obj.description)
			newHtml = newHtml.replace("%value%", displayNum(obj.value, type))

			document.querySelector(element).insertAdjacentHTML("beforeend",newHtml)
		},
		delListItem: function(type, id){
			var el = document.querySelector("#" + type + "-" + id)
			el.parentNode.removeChild(el)
		},
		clearFields: function(){
			var fields;

			fields = document.querySelectorAll(addDom.description + ", " + addDom.value);
			fields.forEach(function(current, index, array){
				current.value = "";
			})
			fields[0].focus()
		},
		displayBudget: function(obj){
			var type;
			(obj.budget >= 0) ? type = "income" : type = "expense"

			document.querySelector(addDom.budgetLabel).textContent = displayNum(obj.budget, type);
			document.querySelector(addDom.incomeLabel).textContent = displayNum(obj.totalIncome, "income");
			document.querySelector(addDom.expenseLabel).textContent = displayNum(obj.totalExpense, "expense");
			if(obj.percentage !== -1){
				document.querySelector(addDom.percentageLabel).textContent = obj.percentage + "%";
			}else{
				document.querySelector(addDom.percentageLabel).textContent = "---";
			}
		},
		dsiplayPercentages: function(plist){
			var fields = document.querySelectorAll(addDom.expensePercentage)

			listForEach(fields, function(current, index){
				if(plist[index] > 0){
					current.textContent = plist[index] + "%"
				}else{
					current.textContent = "---"
				}
			})
			
		},
		displayDate: function(){
			var now, year, month, months;

			now = new Date()
			year = now.getFullYear()
			month = now.getMonth()

			months = ['January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
					]
			document.querySelector(addDom.datalabel).textContent = " " + months[month] + " " + year
		},
		changeButton: function(){

			var fields = document.querySelectorAll(addDom.type + "," + addDom.description + "," + addDom.value)

			listForEach(fields, function(cur, i){
				cur.classList.toggle("red-focus")
			})
			document.querySelector(addDom.button).classList.toggle("red")

		}	
	}
})();




//Data control module
var Datacontroller = (function(){

	var Expense = function(id, des, val){
		this.id = id;
		this.description = des;
		this.value = val
		this.percentage = -1
	};

	var Income = function(id, des, val){
		this.id = id;
		this.description = des;
		this.value = val
	};

	Expense.prototype.calcPercentage = function(totalincome){
		if(totalincome > 0){
			this.percentage = Math.round(this.value / totalincome * 100)
		}else{
			this.percentage = -1
		}
	}
	Expense.prototype.getPercentage = function(){
		return this.percentage 
	}

	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(current){
			sum += current.value;
		})
		return sum
	}

	var data = {
		allItems: {
			expense: [],
			income: [],
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget: 0,
		percentage: -1
	}

	return{
		addItem: function(type,des,val){
			var ID, newItem;
			
			if(data.allItems[type].length !== 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1
			}else{
				ID = 1
			}

			if(type === "expense"){
				newItem = new Expense(ID,des,val)
			}else{
				newItem = new Income(ID,des,val)
			}

			data.allItems[type].push(newItem)

			return newItem
		},
		delItem: function(type,id){
			var ids, index;
			ids = data.allItems[type].map(function(current){
				return current.id
			})
			console.log(ids)
			index = ids.indexOf(id)

			if(index !== -1){
				data.allItems[type].splice(index, 1)
			}
		},
		testing: function(){
			return data
		},
		calculateBuget: function(){
			data.totals.expense = calculateTotal("expense")
			data.totals.income = calculateTotal("income")

			data.budget = data.totals.income - data.totals.expense

			if(data.totals.income > 0){
				data.percentage = Math.round(data.totals.expense / data.totals.income * 100)
			}else{
				data.percentage = -1
			}
		},
		calcPercentage: function(){
			data.allItems["expense"].forEach(function(current){
				current.calcPercentage(data.totals.income)
			})
		},
		getPercentage: function(){
			if(data.allItems["expense"].length !== 0){
				var percs = data.allItems["expense"].map(function(current){
					return current.getPercentage()
				})
				return percs;
			}
			
		},
		getBudget: function(){
			return{
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExpense: data.totals.expense,
				percentage: data.percentage,
			}
		}
	}
})()



//Main control of app
var Controller = (function(Datactrl, UIctrl){

	var setEventListener = function(){
		var addDom = UIctrl.getDom()

		//new items events
		document.querySelector(addDom.button).addEventListener("click", additem)
		document.addEventListener("keypress", function(event){
		if(event.which === 13 || event.keyCode === 13){
			event.preventDefault()
			additem();
		}})

		document.querySelector(addDom.container).addEventListener("click", delitem);

		document.querySelector(addDom.type).addEventListener("change", UIctrl.changeButton)
	}
	
	//add new items function
	var additem = function(){
		
		var input = UIctrl.getInput()

		if(input.description !== "" && !isNaN(input.value) && input.value > 0){

			var newItem = Datactrl.addItem(input.type, input.description, input.value)

			UIctrl.addListItem(newItem, input.type)

			UIctrl.clearFields()

			updateBudget()
		}
	}

	var delitem = function(event){
		var IDstring, type, id;

		IDstring = (event.target.parentNode.parentNode.parentNode.parentNode).id

		if(IDstring){
			type = IDstring.split("-")[0]
			id = parseInt(IDstring.split("-")[1]) 
		}
		
		Datactrl.delItem(type, id)

		UIctrl.delListItem(type, id)

		updateBudget()
	}

	var updatePercentage = function(){

		Datactrl.calcPercentage()

		var percentageList = Datactrl.getPercentage()

		UIctrl.dsiplayPercentages(percentageList)
	}

	var updateBudget = function(){

		Datactrl.calculateBuget();

		var data = Datactrl.getBudget();

		UIctrl.displayBudget(data);

		updatePercentage()
	}
	

	//return init methods to restart the program
	return{
		init: function(){
			var initdata = {
				totalIncome: 0,
				totalExpense: 0,
				budget: 0,
				percentage: -1
			}
			UIctrl.displayDate();
			UIctrl.displayBudget(initdata);
			setEventListener()
		}
	}
})(Datacontroller, UIcontroller)


//start the program
Controller.init()