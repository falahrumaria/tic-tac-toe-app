import { Component, OnInit, Input, Output } from "@angular/core";

@Component({
  selector: "app-tic-tac-toe",
  templateUrl: "./tic-tac-toe.component.html",
  styleUrls: ["./tic-tac-toe.component.css"]
})
export class TicTacToeComponent implements OnInit {
  dimension: number;
  constructor() {}

  ngOnInit() {
    this.dimension = 3;
  }

}
