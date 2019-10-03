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
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false
    }
    this.seenJokes = new Set(this.state.jokes.map(j => j.text));
    this.handleClick = this.handleClick.bind(this);
    this.handleVote = this.handleVote.bind(this);
  }

  componentDidMount() {
    if(this.state.jokes.length === 0) this.getJokes();
  }

  async getJokes() {
    try {
    // Load List of Jokes from API
    let jokes = [];
    // Populate jokes array with the amount of jokes specefied in default props
    while(jokes.length < this.props.numJokesToGet) {
      // generates response data, specify application/json to avoid html response
      let response = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      let newJoke = response.data.joke
      if(!this.seenJokes.has(newJoke)) {
        jokes.push({ id: uuid(), text: newJoke, votes: 0 })
      } else {
        console.log("DUPE")
      }
    }
    this.setState( st => ({
      loading: false,
      jokes: [...st.jokes, ...jokes]
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
  );
  } catch(e) {
    alert(e)
    this.setState({ loading: false })
  }
}

handleClick() {
  this.getJokes();
  this.setState({ loading: true }, this.getJokes);
}

handleVote(id, delta) {
  this.setState(
    st => ({
      jokes: st.jokes.map(j =>
        j.id === id ? {...j, votes: j.votes + delta} : j
      )
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
  );
}

render() {

  if(this.state.loading) {
    return (
      <div className="JokeList-spinner">
        <i className="far fa-8x fa-laugh fa-spin" />
        <h1 className="JokeList-title">Loading...</h1>
      </div>
    )
  }
  let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes)
  return(
    <div className="JokeList">
      <div className="JokeList-sidebar">
        <h1 className="JokeList-title">
          <span>Dad</span>
           Jokes
         </h1>
         <img className="shake" src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
         <button className="JokeList-button" onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {jokes.map(j => (
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
