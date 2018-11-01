import {Component} from '@angular/core';
import {ApiService} from './api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    private playerUnit = 'O';
    public turn: boolean;

    /**
     * 0: started
     * 1: finished-win
     * 2: finished-lose
     * 3: finished-draw
     */
    public state = 0;

    public board: any[];
    private series: any[];
    public style: any[];
    public moveHistory: number[][];

    constructor(private api: ApiService) {
        this.initialize();
    }

    ngOnInit() {
        if (!this.turn) {
            this.opponentMove();
        }
    }

    move(x: number, y: number) {
        if (!this.turn || this.state !== 0) {
            return;
        }

        if (this.board[x][y] !== '') {
            return;
        }

        this.board[x][y] = this.playerUnit;
        this.addToHistory([x, y, this.playerUnit])
        this.checkBoard();
        this.turn = false;
        if (this.state === 0) {
            this.opponentMove();
        }
    }

    private opponentMove() {
        this.api.move(this.board).subscribe(
            data => {
                this.board[data[0]][data[1]] = data[2];
                this.addToHistory([data[0], data[1], data[2]]);
                this.checkBoard();
                this.turn = true;
                return true;
            },
            error => {
                console.error("Error on move");
            }
        );
    }

    private checkBoard() {
        let counter = 0;
        for (let serie of this.series) {
            let serieIndex = 0;
            for (let spot of serie) {
                if (this.board[spot[0]][spot[1]]) {
                    serieIndex += this.board[spot[0]][spot[1]] === this.playerUnit ? 1 : 10;
                    counter++;
                }
            }
            if (serieIndex === 3) {
                this.state = 1;
                this.markWinSeries(serie, 'win-series');
            }
            if (serieIndex === 30) {
                this.state = 2;
                this.markWinSeries(serie, 'lose-series');
            }
        }

        if (counter === 24 && this.state === 0) {
            this.state = 3;
        }
    }

    private markWinSeries(serie: any[], mark: string) {
        for (let spot of serie) {
            this.style[spot[0]][spot[1]] = mark;
        }
    }

    private initialize() {
        this.state = 0;

        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        this.style = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];

        this.series = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];

        this.turn = Math.random() >= 0.5;
//        this.turn = false;

        this.moveHistory = [];
    }

    public restart() {
        this.initialize();
        if (!this.turn) {
            this.opponentMove();
        }
    }

    private addToHistory(move: any[]) {
        this.moveHistory.push(move);
    }
}
