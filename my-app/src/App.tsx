import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Router, Route, Switch, Link, BrowserRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

import img1 from "./imgs/brother_typewriter_pink_2.jpg";
import img2 from "./imgs/typewriter2.jpg";
import img3 from "./imgs/typewriter3.jpg";
import img4 from "./imgs/sanddunes.jpg";
import img5 from "./imgs/sanddunes2.jpg";

type promptTwoWordsType = [string, number];
interface myProps {}
interface myState {
  data: null | string;
  likedword: undefined | string;
  message: string;
  promptTwoWords: promptTwoWordsType[];
  sentence: string;
  writtensentences: [string, number][];
  sentenceToExpand: string;
  expandedSentence: string;
  expandedSentenceInline: string;
  allextended: string[];
  inlineExpand: number | undefined;
}

const myHistory = createBrowserHistory();

const timeout = (ms: number) => new Promise((res) => setTimeout(res, ms));

class App extends Component<myProps, myState> {
  constructor(props: myProps) {
    super(props);
    this.state = {
      data: null,
      likedword: undefined,
      message: "",
      promptTwoWords: [
        ["", 1],
        ["", 2],
      ],
      writtensentences: [],
      allextended: [],
      sentenceToExpand: "",
      expandedSentence: "",
      expandedSentenceInline: "",
      sentence: "write some words that connect these two words",
      inlineExpand: undefined,
    };
    this.callBackendAPI = this.callBackendAPI.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.messageTiming = this.messageTiming.bind(this);
    this.getTwoWords = this.getTwoWords.bind(this);
    this.handleSubmitSentence = this.handleSubmitSentence.bind(this);
    this.viewWrittenSentences = this.viewWrittenSentences.bind(this);
    this.expandSentence = this.expandSentence.bind(this);
    this.getAllExtended = this.getAllExtended.bind(this);
    this.handleSubmitExpandedSentence = this.handleSubmitExpandedSentence.bind(
      this
    );
  }
  async callBackendAPI() {
    const response = await axios.get("/express_backend");
    // console.log("res", response);
    const body = await response.data;
    // console.log("body", body);
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  }
  // componentDidMount() {
  //   this.callBackendAPI()
  //     .then((res) => this.setState({ data: res.express }))
  //     .catch((err) => console.log(err));
  // }

  async getTwoWords() {
    const getter = await axios.get("/gettwowords");
    // console.log("two words", getter);
    let words = getter.data;
    this.setState({ promptTwoWords: words });
    // console.log("words", words);
    // this.setState({});
  }

  handleInputChange(event: React.FormEvent<EventTarget>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;
    // console.log("value", value);
    // console.log("name", name);
    //@ts-ignore
    this.setState({
      [name]: value,
    });
    //@ts-ignore
    // console.log("handling", this.state[name]);
  }
  handleExpandSentence() {}
  async messageTiming() {
    await timeout(2500);
    this.setState({ message: "" });
  }
  async handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let word = this.state.likedword;

    // console.log("word", word);
    await axios.get("/express_backend").then((data) => {
      // console.log("data", data);
    });

    await axios
      .post("/likedword", { word })
      .then((data) => {
        // console.log("post hitting ->", data.data);
        this.setState({ message: data.data, likedword: "" });
      })
      .catch((err) => {
        console.log("err", err);
        this.setState({ message: "something broke" });
      });

    await this.messageTiming();
  }

  async handleSubmitSentence(e: React.FormEvent) {
    e.preventDefault();
    let sentence = this.state.sentence;
    let plucked = this.state.promptTwoWords;
    let idxs = [plucked[0][1], plucked[1][1]];
    let packed = [sentence, idxs];
    axios.post("/sentence", packed).then((data) => {
      // console.log("data", data.data);
      this.setState({ sentence: "write a sentence" });
    });
    this.getTwoWords();
  }
  viewWrittenSentences() {
    axios.get("/allsentences").then((d) => {
      let todo = "todo";
      this.setState({ writtensentences: d.data });
    });
  }
  expandSentence(id?: number) {
    if (!id) {
      axios.get("/singlesentence").then((data) => {
        console.log("data------>", data.data);
        this.setState({
          expandedSentence: data.data,
        });
      });
      return;
    } else {
      let find = this.state.writtensentences.find((s) => s[1] === id);
      //@ts-ignore
      let expander = find[0] || "todo";
      this.setState({ inlineExpand: id, expandedSentenceInline: expander });
      console.log("find", find);
      return;
    }
  }
  handleSubmitExpandedSentence(inline: boolean) {
    let data;
    inline
      ? (data = this.state.expandedSentenceInline)
      : (data = this.state.expandedSentence);
    console.log("data", data);
    axios.post("/addexpandedsentence", { data }).then((d) => {
      this.setState({ message: "your expanded sentence has been added" });
      this.messageTiming();
    });
  }

  getAllExtended() {
    axios.get("/allextended").then((d) => {
      this.setState({ allextended: d.data });
    });
  }

  render() {
    return (
      <Router history={myHistory}>
        <main className="App">
          <nav className="header">
            <ul className="headerlist">
              <p className="routechoice">
                <Link to="addword">add a word</Link>
              </p>
              <p className="routechoice">
                <Link to="writingpractice">writing practice</Link>
              </p>
              <p className="routechoice">
                <Link onClick={this.viewWrittenSentences} to="writtensentences">
                  see written sentences
                </Link>
              </p>
              <p className="routechoice">
                <Link
                  onClick={() => {
                    this.expandSentence();
                    console.log("force change git");
                    this.setState({
                      expandedSentence: "what did i just break?",
                    });
                  }}
                  to="singlesentence"
                >
                  expand a sentence
                </Link>
              </p>
              <p className="routechoice">
                <Link onClick={this.getAllExtended} to="allextended">
                  get all extended
                </Link>
              </p>
            </ul>
          </nav>
          <div>
            <h2>{this.state.message}</h2>
          </div>
          <Route
            path="/"
            exact
            render={() => {
              return (
                <div>
                  <div className="mainpics">
                    <img
                      style={{ width: "200px", height: "200px" }}
                      src={img1}
                    />
                    <img
                      style={{ width: "200px", height: "200px" }}
                      src={img2}
                    />
                    <img
                      style={{ width: "200px", height: "200px" }}
                      src={img3}
                    />

                    {/* <img src="../imgs/OpenBookOPT.jpg" alt="" /> */}
                  </div>
                  <div className="qoutes">
                    <h3>
                      “Don’t waste time waiting for inspiration. Begin, and
                      inspiration will find you.”
                    </h3>
                    <h3>
                      "You can’t think yourself out of a writing block; you have
                      to write yourself out of a thinking block."
                    </h3>
                    <h3>
                      "The best way in the world for breaking up a writer’s
                      block is to write a lot."
                    </h3>
                  </div>
                  <img style={{ height: "200px", width: "800px" }} src={img4} />
                </div>
              );
            }}
          />
          <Route
            path="/addword"
            render={() => (
              <form>
                <label>
                  word you like
                  <input
                    onChange={this.handleInputChange}
                    type="text"
                    name="likedword"
                    value={this.state.likedword}
                  />
                </label>
                <input
                  onClick={this.handleSubmit}
                  type="submit"
                  value="Submit"
                />
              </form>
            )}
          />
          <Route
            path="/writingpractice"
            render={() => {
              return (
                <div>
                  <h2>let's practice writing</h2>
                  <button
                    style={{ backgroundColor: "beige" }}
                    onClick={this.getTwoWords}
                  >
                    get 2 words
                  </button>
                  <ul className="chosenwords">
                    <p>{this.state.promptTwoWords[0][0]}</p>
                    <p>{this.state.promptTwoWords[1][0]}</p>
                    {/* <p>{this.state.promptTwoWords[1]}</p> */}
                  </ul>
                  <form>
                    <textarea
                      name="sentence"
                      onChange={this.handleInputChange}
                      value={this.state.sentence}
                    ></textarea>
                  </form>
                  <button onClick={this.handleSubmitSentence}>
                    submit writing
                  </button>
                  <img style={{ width: "300px" }} src={img5} alt="" />
                </div>
              );
            }}
          />
          <Route
            path="/writtensentences"
            render={() => {
              //@ts-ignore
              function changeBackground(e) {
                e.target.style.background = "burlywood";
              }
              //@ts-ignore
              function changeBackgroundBack(e) {
                e.target.style.background = "white";
              }
              return (
                <div>
                  <h2>your sentences</h2>
                  <ul>
                    {this.state.writtensentences.map((sentence, idx) => (
                      <p
                        onMouseEnter={changeBackground}
                        onMouseLeave={changeBackgroundBack}
                        key={`str${idx}`}
                        onClick={(e) => {
                          changeBackgroundBack(e);
                          this.expandSentence(sentence[1]);
                        }}
                      >
                        {" "}
                        {this.state.inlineExpand !== sentence[1] ? (
                          sentence[0]
                        ) : (
                          <div>
                            <textarea
                              //here
                              name="expandedSentenceInline"
                              onChange={this.handleInputChange}
                              value={this.state.expandedSentenceInline}
                            ></textarea>
                            <button
                              onClick={() => {
                                this.handleSubmitExpandedSentence(true);
                              }}
                            >
                              submit expansion
                            </button>
                          </div>
                        )}
                        {/* {sentence[0]} */}
                      </p>
                    ))}
                  </ul>
                </div>
              );
            }}
          />
          <Route
            path="/singlesentence"
            render={() => {
              return (
                <div>
                  expand on this sentence ->{" "}
                  <form>
                    <textarea
                      name="expandedSentence"
                      onChange={this.handleInputChange}
                      value={this.state.expandedSentence}
                      // value={this.state.expandedSentence}
                    ></textarea>
                  </form>
                  <button
                    onClick={() => {
                      this.handleSubmitExpandedSentence(false);
                    }}
                  >
                    submit new sentence
                  </button>
                </div>
              );
            }}
          />
        </main>
        <Route
          path="/allextended"
          render={() => (
            <div className="sentences">
              {this.state.allextended.map((d, idx) => {
                return <p key={`str${idx}`}>{d}</p>;
              })}
            </div>
          )}
        />
      </Router>
    );
  }
}

export default App;
