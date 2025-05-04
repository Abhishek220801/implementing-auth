const express = require('express');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'kehsihba321';

const app = express();

const PORT = process.env.PORT || 3000;

const users = []; // In-memory user storage (for demonstration purposes)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send('Welcome to the home page!');
})

function generateToken(){
    let options = [
        "a","b","c","d","e","f","g","h","i","j","k","l","m",
        "n","o","p","q","r","s","t","u","v","w","x","y","z",
        "A","B","C","D","E","F","G","H","I","J","K","L","M",
        "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        "0","1","2","3","4","5","6","7","8","9"
    ];
    let token = '';
    for(let i=0; i<32; i++){
        token += options[Math.floor(Math.random()*options.length)];
    }
    return token;
}

app.post('/signup', (req, res)=>{
    const {username, password} = req.body;

    //input validation
    if(password.length<8) return res.status(400).send('Password must be at least 8 characters long!');

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: 'User signed up successfully!'
    });
})

app.post('/signin', (req,res)=>{
    const {username, password} = req.body;

    let foundUser = null;
    
    for(let i=0; i<users.length; i++){
        if(users[i].username === username && users[i].password === password){
            foundUser = users[i];
            break;
        }
    }

    if(foundUser){
        // console.log(foundUser.username, foundUser.password);
        const token = jwt.sign({
            username: foundUser.username,
        }, JWT_SECRET, {expiresIn: '1h'});
        foundUser.token = token;
        res.json({
            token: token
        });
    } else {
        res.status(403).send({
            message: 'Invalid username or password!',
        })
    }

    // const user = users.find(user => user.username === username && user.password === password);
})

app.get('/me', (req, res)=>{
    const token = req.headers.token;
    const decodedInformation = jwt.verify(token, JWT_SECRET);
    const username = decodedInformation.username; 
    let foundUser = null; 

    for(let i=0; i<users.length; i++){
        if(users[i].username === username){
            foundUser = users[i];
            break;
        }
    }
    if(foundUser){
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    } else {
        res.status(403).send({
            message: 'Invalid token!'
        })
    }
})

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));