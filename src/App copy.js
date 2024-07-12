import React, { Component } from "react";
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
};

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	componentDidMount() { 
    this.snakeInterval = setInterval(this.moveSnake, this.state.speed); 
    document.onkeydown = this.onKeyDown; 
  } 

	componentDidUpdate() { 
		this.onSnakeOutOfBounds(); 
		this.onSnakeCollapsed(); 
		this.onSnakeEats(); 
	} 

	onKeyDown = (e) => { 
		e.preventDefault(); 
		e = e || window.event; 
		switch (e.keyCode) { 
      case 37: 
				this.setState({ direction: "LEFT" }); 
				break; 
			case 38: 
				this.setState({ direction: "UP" }); 
				break; 
			case 39: 
				this.setState({ direction: "RIGHT" }); 
				break; 
			case 40: 
				this.setState({ direction: "DOWN" }); 
        break; 
      case 32:
        this.togglePause();
        break;
      default:
        break;
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
    alert(`GAME OVER, your score is ${this.state.snakeDots.length - 2}`); 
    clearInterval(this.snakeInterval);
    this.setState(initialState, () => {
        this.snakeInterval = setInterval(this.moveSnake, this.state.speed);
    });
  }


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
		const { route, snakeDots, food, speed, isPaused, points, level } = this.state; 
		return ( 
			<div> 
				{route === "menu" ? ( 
					<div> 
						<Menu onRouteChange={this.onRouteChange} /> 
					</div> 
				) : ( 
          <div> 
            <div className="game-info">
              <div>Score: {points}</div>
                <div>Speed: {100 - speed}</div>
                <div>Level: { level }</div>
            </div>
						<div className="game-area"> 
							<Snake snakeDots={snakeDots} /> 
							<Food dot={food.position} type={food.type} /> 
						</div> 
						<button onClick={this.togglePause}>{isPaused ? "Resume" : "Pause"}</button>
					</div> 
				)} 
			</div> 
		); 
	} 
} 

export default App; 
