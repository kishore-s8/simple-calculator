const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (like CSS) from the "public" directory
app.use(express.static(__dirname + '/public'));

// Home route
app.get('/', (req, res) => {
    res.render('index', { result: null, num1: '', operator: '', num2: '' });
});

// Calculator route
app.post('/calculate', (req, res) => {
    const { num1, operator, num2 } = req.body;
    let result;

    // Validate and calculate result
    if (!isNaN(num1) && !isNaN(num2)) {
        switch (operator) {
            case '+':
                result = parseFloat(num1) + parseFloat(num2);
                break;
            case '-':
                result = parseFloat(num1) - parseFloat(num2);
                break;
            case '*':
                result = parseFloat(num1) * parseFloat(num2);
                break;
            case '/':
                if (parseFloat(num2) === 0) {
                    result = 'Cannot divide by zero.';
                } else {
                    result = parseFloat(num1) / parseFloat(num2);
                }
                break;
            default:
                result = 'Invalid operator.';
        }
    } else {
        result = 'Invalid numbers.';
    }

    res.render('index', { result, num1, operator, num2 });
});

// Start the server
app.listen(port, () => {
    console.log(`Calculator app listening at http://localhost:${port}`);
});

