import React, { Component } from "react";
import "./SortingVisualizer.css";
import {
  getMergeSortAnimations,
  getBubbleSortAnimations,
  getInsertionSortAnimations,
} from "../SortingAlgorithms/sortingAlgorithms.js";

// Change this value for the speed of the animations.
let ANIMATION_SPEED_MS = 1;

// This is the main color of the array bars.
const PRIMARY_COLOR = "turquoise";

// This is the color of array bars that are being compared throughout the animations.
const SECONDARY_COLOR = "red";

const FINAL_COLOR = "purple";

class SortingVisualizer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [],
      size: 165,
      algoGoingOn: false,
    };
  }

  componentDidMount() {
    this.resetArray();
  }

  resetArray() {
    const array = [];
    for (let i = 0; i < this.state.size; i++) {
      array.push(randomIntfromInterval(5, 570));
    }
    this.setState({ array });
  }

  handleChange = (e) => {
    this.setState({
      size: e.target.value,
    });
    ANIMATION_SPEED_MS = 310 / this.state.size;
    this.resetArray();
  };

  mergeSort() {
    const animations = getMergeSortAnimations(this.state.array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    setTimeout(() => {
      this.setState({ algoGoingOn: false });
    }, animations.length * ANIMATION_SPEED_MS + 1);
  }

  bubbleSort() {
    const mainArray = this.state.array;
    let n = this.state.array.length;
    const animations = getBubbleSortAnimations(mainArray);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const swap = i % 3 === 1;
      if (swap) {
        const [barOneIdx, barTwoIdx] = animations[i];
        if (barOneIdx === -1) continue;
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = "red";
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
          const new1 = barOneStyle.height;
          const new2 = barTwoStyle.height;
          barOneStyle.height = new2;
          barTwoStyle.height = new1;
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        let color1 = i % 3 === 0 ? "green" : PRIMARY_COLOR;
        let color2 = color1;
        if (barTwoIdx === n - 1 && color1 === PRIMARY_COLOR) {
          color2 = FINAL_COLOR;
          n--;
          if (n === 0) color1 = color2;
        }
        setTimeout(() => {
          barOneStyle.backgroundColor = color1;
          barTwoStyle.backgroundColor = color2;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    setTimeout(() => {
      const arrayBars = document.getElementsByClassName("array-bar");
      const barStyle = arrayBars[0].style;
      barStyle.backgroundColor = FINAL_COLOR;
    }, (animations.length + 1) * ANIMATION_SPEED_MS);
    n = this.state.array.length;
    for (let i = 0; i < n; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const barStyle = arrayBars[i].style;
      setTimeout(() => {
        barStyle.backgroundColor = PRIMARY_COLOR;
      }, (animations.length + 2 * n + i) * ANIMATION_SPEED_MS);
    }
  }

  insertionSort() {
    const animations = getInsertionSortAnimations(this.state.array);
    let count = 0;
    let flag = false;
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const [barIdx, key] = animations[i];
      let color = key === -2 ? PRIMARY_COLOR : "red";
      if (key < 0) {
        count = 0;
        setTimeout(() => {
          const barStyle = arrayBars[barIdx].style;
          barStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        const barOneStyle = arrayBars[barIdx].style;
        const barTwoStyle = arrayBars[key].style;
        let color = "turquiose";
        if (count === 0) {
          color = "green";
        }
        flag = !flag;
        if (flag === false) {
          setTimeout(() => {
            barOneStyle.backgroundColor = PRIMARY_COLOR;
            barTwoStyle.backgroundColor = color;
          }, i * ANIMATION_SPEED_MS);
          continue;
        }
        count++;
        setTimeout(() => {
          const new1 = barOneStyle.height;
          const new2 = barTwoStyle.height;
          barOneStyle.height = new2;
          barTwoStyle.height = new1;
          barOneStyle.backgroundColor = "red";
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      }
    }
    let n = this.state.array.length;
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const arrayBars = document.getElementsByClassName("array-bar");
        const barStyle = arrayBars[i].style;
        barStyle.backgroundColor = FINAL_COLOR;
      }, (animations.length + i) * ANIMATION_SPEED_MS);
    }
    for (let i = 0; i < n; i++) {
      setTimeout(() => {
        const arrayBars = document.getElementsByClassName("array-bar");
        const barStyle = arrayBars[i].style;
        barStyle.backgroundColor = PRIMARY_COLOR;
      }, (animations.length + 4 * n + i) * ANIMATION_SPEED_MS);
    }
  }

  testSortingAlgorithms() {
    for (let i = 0; i < 1; i++) {
      const array = [];
      const length = randomIntfromInterval(1, 10);
      for (let i = 0; i < length; i++) {
        array.push(randomIntfromInterval(0, 10));
      }
      const javaScriptSortedArray = array.slice().sort((a, b) => a - b);
      const insertionSortedArray = getInsertionSortAnimations(array.slice());
      console.log(insertionSortedArray);
      console.log(arraysAreEqual(javaScriptSortedArray, insertionSortedArray));
    }
  }

  render() {
    const { array } = this.state;
    return (
      <div>
        <div className="container text-center">
          <input
            type="range"
            min={5}
            max={250}
            id="changeSize"
            style={{ background: "white", cursor: "pointer" }}
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button
            onClick={() => this.resetArray()}
            className="btn btn-primary btn-lg active"
          >
            Generate New Array
          </button>
          <button
            onClick={() => this.mergeSort()}
            className="btn btn-primary btn-lg active"
          >
            Merge Sort
          </button>
          <button
            onClick={() => this.bubbleSort()}
            className="btn btn-primary btn-lg active"
          >
            Bubble Sort
          </button>
          <button
            onClick={() => this.insertionSort()}
            className="btn btn-primary btn-lg active"
          >
            Insertion Sort
          </button>
        </div>
        <div className="array-container">
          <p></p>
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                height: `${value}px`,
                width: `${Math.floor(1000 / this.state.size) - 1}px`,
              }}
            ></div>
          ))}
        </div>
      </div>
    );
  }
}

function randomIntfromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}

export default SortingVisualizer;
