import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // To handle JSON payloads

// Serve static files (like CSS) from the "public" directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Home route
app.get('/', (req, res) => {
    res.render('index', { result: null, num1: '', operator: '', num2: '' });
});

// Calculator route
app.post('/calculate', (req, res) => {
    const { num1, operator, num2 } = req.body;
    let result;

    // Validate input: Ensure num1 & num2 are numbers
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        return res.render('index', { result: 'Invalid numbers.', num1, operator, num2 });
    }

    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);

    // Perform calculation
    switch (operator) {
        case '+':
            result = n1 + n2;
            break;
        case '-':
            result = n1 - n2;
            break;
        case '*':
            result = n1 * n2;
            break;
        case '/':
            result = n2 === 0 ? 'Cannot divide by zero.' : n1 / n2;
            break;
        default:
            result = 'Invalid operator.';
    }

    res.render('index', { result, num1, operator, num2 });
});

// Start the server
app.listen(port, () => {
    console.log(`Calculator app listening at http://localhost:${port}`);
});
