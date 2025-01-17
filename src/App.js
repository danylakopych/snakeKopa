import React, { Component } from "react";
import axios from 'axios';
import Snake from "./Components/Snake";
import Food from "./Components/Food";
import Menu from "./Components/Menu";
import "./App.css";
const getRandomFood = () => {
	let min = 1;
	let max = 98;
	let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
	let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
	const foodTypes = [
		{ type: "First", points: 1 },
		{ type: "Second", points: 5 },
		{ type: "Third", points: 10 }
	];
	let foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
	return { position: [x, y], ...foodType };
};

const initialState = {
	food: getRandomFood(),
	direction: "RIGHT",
	speed: 100,
	route: "menu",
	points: 0,
	snakeDots: [
		[0, 0],
		[0, 2],
	],
	level: 0,
	isPaused: false,
	name: '',
	records: [],
};

class App extends Component {
	constructor() {
		super();
		this.state = {
            ...initialState,
            name: '',
            records: []
        };
	}

	componentDidMount() { 
		this.fetchRecords();
		this.snakeInterval = setInterval(this.moveSnake, this.state.speed); 
		document.onkeydown = this.onKeyDown; 
	} 

	componentDidUpdate() { 
		this.onSnakeOutOfBounds(); 
		this.onSnakeCollapsed(); 
		this.onSnakeEats(); 
	}

	fetchRecords = async () => {
        try {
            const response = await axios.get('http://localhost:3000/records');
            this.setState({ records: response.data });
        } catch (error) {
            console.error("There was an error fetching the records!", error);
        }
    };

	submitScore = async () => {
        const { name, points } = this.state;
        try {
            await axios.post('http://localhost:3000/records', { name, score: points });
            this.fetchRecords();
        } catch (error) {
            console.error("There was an error submitting the score!", error);
        }
    };

	onKeyDown = (e) => {
		const { route } = this.state;
		if (route === "game") {
			switch (e.keyCode) {
				case 37:
					e.preventDefault();
					this.setState({ direction: "LEFT" });
					break;
				case 38:
					e.preventDefault();
					this.setState({ direction: "UP" });
					break;
				case 39:
					e.preventDefault();
					this.setState({ direction: "RIGHT" });
					break;
				case 40:
					e.preventDefault();
					this.setState({ direction: "DOWN" });
					break;
				case 32:
					e.preventDefault();
					this.togglePause();
					break;
				default:
					break;
			}
		}
	};

  moveSnake = () => { 
    if (this.state.isPaused) return;
		let dots = [...this.state.snakeDots]; 
		let head = dots[dots.length - 1]; 
		if (this.state.route === "game") { 
			switch (this.state.direction) { 
				case "RIGHT": 
					head = [head[0] + 2, head[1]]; 
					break; 
				case "LEFT": 
					head = [head[0] - 2, head[1]]; 
					break; 
				case "DOWN": 
					head = [head[0], head[1] + 2]; 
					break; 
				case "UP": 
					head = [head[0], head[1] - 2]; 
					break; 
				default:
					break;
			} 
			dots.push(head); 
			dots.shift(); 
			this.setState({ 
				snakeDots: dots, 
			}); 
		} 
	}; 

	onSnakeOutOfBounds() { 
		let head = this.state.snakeDots[this.state.snakeDots.length - 1]; 
		if (this.state.route === "game") { 
			if ( 
				head[0] >= 100 || 
				head[1] >= 100 || 
				head[0] < 0 || 
				head[1] < 0 
			) { 
				this.gameOver(); 
			} 
		} 
  } 

	onSnakeCollapsed() { 
		let snake = [...this.state.snakeDots]; 
		let head = snake[snake.length - 1]; 
		snake.pop(); 
		snake.forEach((dot) => { 
			if (head[0] === dot[0] && head[1] === dot[1]) { 
				this.gameOver(); 
			} 
		}); 
	} 

	onSnakeEats() { 
		let head = this.state.snakeDots[this.state.snakeDots.length - 1]; 
		let { position, points } = this.state.food;
		if (head[0] === position[0] && head[1] === position[1]) { 
			this.setState({ 
				food: getRandomFood(), 
				points: this.state.points + points 
			});
			this.increaseSnake(); 
			this.increaseSpeed(); 
		} 
	} 

	increaseSnake() { 
		let newSnake = [...this.state.snakeDots]; 
		newSnake.unshift([]); 
		this.setState({ 
			snakeDots: newSnake, 
		}); 
	} 

  increaseSpeed() {
    if (this.state.speed > 10 && this.state.level < Math.floor(this.state.points / 50)) { 
      this.setState({ 
        level: Math.floor(this.state.points / 50),
        speed: this.state.speed - 10
      }, () => {
        clearInterval(this.snakeInterval);
        this.snakeInterval = setInterval(this.moveSnake, this.state.speed);
      });
    } 
  }

	onRouteChange = () => { 
		this.setState({ 
			route: "game", 
		}); 
  }; 
  
  togglePause = () => { 
		this.setState(prevState => ({
			isPaused: !prevState.isPaused
		}));
	};

	gameOver() { 
		alert(`GAME OVER, your score is ${this.state.points}`); 
		clearInterval(this.snakeInterval);
		this.submitScore();
		this.setState(initialState, () => {
			this.snakeInterval = setInterval(this.moveSnake, this.state.speed);
		});
  	}

	handleNameChange = (e) => {
        this.setState({ name: e.target.value });
    };

	onDown = () => { 
		let dots = [...this.state.snakeDots]; 
		let head = dots[dots.length - 1]; 

		head = [head[0], head[1] + 2]; 
		dots.push(head); 
		dots.shift(); 
		this.setState({ 
			direction: "DOWN", 
			snakeDots: dots, 
		}); 
	}; 

	onUp = () => { 
		let dots = [...this.state.snakeDots]; 
		let head = dots[dots.length - 1]; 

		head = [head[0], head[1] - 2]; 
		dots.push(head); 
		dots.shift(); 
		this.setState({ 
			direction: "UP", 
			snakeDots: dots, 
		}); 
	}; 

	onRight = () => { 
		let dots = [...this.state.snakeDots]; 
		let head = dots[dots.length - 1]; 

		head = [head[0] + 2, head[1]]; 
		dots.push(head); 
		dots.shift(); 
		this.setState({ 
			direction: "RIGHT", 
			snakeDots: dots, 
		}); 
	}; 

	onLeft = () => { 
		let dots = [...this.state.snakeDots]; 
		let head = dots[dots.length - 1]; 

		head = [head[0] - 2, head[1]]; 
		dots.push(head); 
		dots.shift(); 
		this.setState({ 
			direction: "LEFT", 
			snakeDots: dots, 
		}); 
	}; 

	render() {
        const { route, snakeDots, food, speed, isPaused, points, level, name, records } = this.state;
        return (
            <div>
                {route === "menu" ? (
                    <div>
						<div className="wrapper">
                        <Menu onRouteChange={this.onRouteChange} />
                        	<input className="userName" type="text" placeholder="Enter your name" value={name} onChange={this.handleNameChange} />
							<div className="records-section">
                            <h2>Top 10 Scores</h2>
                            <ul>
                                {records.map((record, index) => (
                                    <li key={index}>{record.name}: {record.score}</li>
                                ))}
                            </ul>
                        </div>
						</div>
                    </div>
                ) : (
                    <div>
                        <div className="game-info">
                            <div>Score: {points}</div>
                            <div>Speed: {100 - speed}</div>
                            <div>Level: {level}</div>
							<button className="pause" onClick={this.togglePause}>{isPaused ? "Resume" : "Pause"}</button>
                        </div>
                        <div className="game-area">
                            <Snake snakeDots={snakeDots} />
                            <Food dot={food.position} type={food.type} />
                        </div>
                        <div className="wrapper">
						<div className="records-section">
                            <h2>Top 10 Scores</h2>
                            <ul>
                                {records.map((record, index) => (
                                    <li key={index}>{record.name}: {record.score}</li>
                                ))}
                            </ul>
                        </div>
						</div>
                    </div>
                )}
            </div>
        );
    }
}

export default App;
