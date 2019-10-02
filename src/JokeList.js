import React, { Component } from "react";
import './JokeList.css';
import axios from "axios";
import Joke from "./Joke";
import uuid from "uuid/v4";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    }
    this.handleVote = this.handleVote.bind(this);
  }

  async componentDidMount() {
    // Load List of Jokes from API
    let jokes = [];
    // Populate jokes array with the amount of jokes specefied in default props
    while(jokes.length < this.props.numJokesToGet) {
      // generates response data, specify application/json to avoid html response
      let response = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      jokes.push({ id: uuid(), text: response.data.joke, votes: 0 })
    }
    this.setState({ jokes: jokes })
  }

  handleVote(id, delta) {
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? {...j, votes: j.votes + delta} : j
        )
      })
    )
  }

  render() {
    console.log(this.state.jokes)
    return(
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
          <span>Dad</span>
           Jokes
         </h1>
         <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(j => (
            <Joke
              key={j.id}
              votes={j.votes}
              text={j.text}
              upvote={() => this.handleVote(j.id, 1)}
              downvote={() => this.handleVote(j.id, -1)}
            />
          ))}
        </div>
      </div>
    )
  }
}
export default JokeList;
