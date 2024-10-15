let shopStock;
let basket;

// This literal will be used to build the objects in the sketch
const lines = [
	{
		name: "Chocolate Hurricane",
		imageFile: "assets/bar1.png",
		weight: 240,
		price: 1.20,
		quantity: 12
	},
	{
		name: "Chewy Mallow Fudge",
		imageFile: "assets/bar2.png",
		weight: 240,
		price: 0.90,
		quantity: 23
	},
	{
		name: "Hazelnut Dream",
		imageFile: "assets/bar3.png",
		weight: 240,
		price: 1.60,
		quantity: 18
	},
	{
		name: "Peppermint Swirl",
		imageFile: "assets/bar4.png",
		weight: 240,
		price: 1.50,
		quantity: 6
	}
];

function setup() {
    createCanvas(800, 600);

    // Initialize shopStock
    shopStock = new Stock();

    let display = {
        width: 150, // Width of each chocolate bar
        height: 400, // Increased height of each chocolate bar
    };

    // Calculate total width needed for all chocolate bars
    const totalWidth = (display.width + 30) * lines.length; // 30 is the spacing

    // Calculate starting x position to center the bars
    const startX = (width - totalWidth) / 2;
    let y = 50; // Fixed y position

    // Position the chocolate bars
    for (let i = 0; i < lines.length; i++) {
        let l = lines[i];
        display.x = startX + i * (display.width + 30); // Centered positioning
        shopStock.addStock(l.name, l.imageFile, l.weight, l.price, l.quantity, { x: display.x, y: y, width: display.width, height: display.height });
    }

    // Create a basket
    basket = new Basket();
}



function draw() {
	background(249, 207, 214);

	// Draw the chocolate bars if there is stock
	for (let i = 0; i < shopStock.stockLines(); i++) {
		if (shopStock.getStockLevel(i) > 0) {
			shopStock.getLine(i).chocolateBar.draw();
		} else {
			// If there is no stock, draw a helpful message
			let display = shopStock.getLine(i).chocolateBar.display;
			fill(200);
			rect(display.x, display.y, display.width, display.height);
			fill(0);
			textAlign(CENTER);
			text("Out of Stock", display.x + display.width / 2, display.y + display.height / 2);
		}
	}
	// Display the basket total
	push();
	fill(0);
	textSize(20);
	textAlign(CENTER);
	text("Basket total: £" + basket.basketTotal().toFixed(2), width / 2, height - 50);
	pop();
}

// Check for mouse clicks
function mousePressed() {
	let clickedBar = shopStock.checkClick(mouseX, mouseY);
	// If a chocolate bar is returned, there is stock and we can add it to the basket
	if (clickedBar != null && shopStock.reduceStock(clickedBar)) {
		basket.addItem(clickedBar);
		console.log(basket);
	}
}

function Stock() {
	// Initialize an array to hold the stock
	this.stock = [];

	// Add a chocolate bar to the array
	this.addStock = function(name, imageFile, weight, price, quantity, display) {
		this.stock.push({
			chocolateBar: new ChocolateBar(name, imageFile, weight, price, display),
			quantity: quantity
		});
	}

	// Get the number of lines of chocolate bars
	this.stockLines = function() {
		return this.stock.length;
	}

	// Return a particular chocolate bar and stock level from the array by index
	this.getLine = function(i) {
		return this.stock[i];
	}

	// Check if any of the bars have been clicked
	this.checkClick = function(x, y) {
		for (let i = 0; i < this.stock.length; i++) {
			if (this.stock[i].chocolateBar.wasClicked(x, y)) {
				return this.stock[i].chocolateBar;
			}
		}
		return null;
	}

	// Reduce stock quantity if a bar is in stock
	this.reduceStock = function(chocolateBar) {
		for (let i = 0; i < this.stock.length; i++) {
			if (this.stock[i].chocolateBar.name == chocolateBar.name) {
				if (this.stock[i].quantity > 0) {
					this.stock[i].quantity--;
					return true;
				} else {
					return false;
				}
			}
		}
	}

	// Return the level of stock available
	this.getStockLevel = function(i) {
		return this.stock[i].quantity;
	}
}

// ChocolateBar class
function ChocolateBar(name, imageFile, weight, price, display) {
	this.name = name;
	this.image = loadImage(imageFile); // Load image
	this.weight = weight;
	this.price = price;
	this.display = display;

	// Draw the chocolate bar's image and price
	this.draw = function() {
		image(this.image, this.display.x, this.display.y, this.display.width, this.display.height);
		let pricePer100g = (this.price / this.weight) * 100;
		let priceString = "£" + this.price.toFixed(2) + " ( £" + pricePer100g.toFixed(2) + " per 100 grams)";
		textAlign(CENTER);
		fill(0);
		text(priceString, this.display.x + this.display.width / 2, this.display.y + this.display.height + 30);
	}

	// Check if the chocolate bar was clicked
	this.wasClicked = function(x, y) {
		return (x > this.display.x && x < this.display.x + this.display.width &&
			y > this.display.y && y < this.display.y + this.display.height);
	}
}

// Basket class
function Basket() {
	this.items = [];

	this.addItem = function(chocolateBar) {
		// Check if the bar is already in items
		for (let i = 0; i < this.items.length; i++) {
			if (this.items[i].chocolateBar.name == chocolateBar.name) {
				this.items[i].quantity++;
				return;
			}
		}
		this.items.push({
			chocolateBar: chocolateBar,
			quantity: 1
		});
	}

	this.basketTotal = function() {
		let total = 0.0;
		for (let i = 0; i < this.items.length; i++) {
			total += this.items[i].chocolateBar.price * this.items[i].quantity;
		}
		return total; // Return the total
	}
}
