import random

class Sudoku:
    def __init__(self):
        self.board = [[0 for _ in range(9)] for _ in range(9)]
        self.generate_puzzle()

    def generate_puzzle(self):
        # Generate a full Sudoku solution
        self.solve()
        # Remove numbers to create a puzzle
        for _ in range(40):
            row, col = random.randint(0, 8), random.randint(0, 8)
            while self.board[row][col] == 0:
                row, col = random.randint(0, 8), random.randint(0, 8)
            self.board[row][col] = 0

    def is_valid(self, row, col, num):
        # Check if the number is not in the row, column, or 3x3 grid
        for x in range(9):
            if self.board[row][x] == num or self.board[x][col] == num:
                return False
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(3):
            for j in range(3):
                if self.board[i + start_row][j + start_col] == num:
                    return False
        return True

    def solve(self):
        for row in range(9):
            for col in range(9):
                if self.board[row][col] == 0:
                    for num in range(1, 10):
                        if self.is_valid(row, col, num):
                            self.board[row][col] = num
                            if self.solve():
                                return True
                            self.board[row][col] = 0
                    return False
        return True

    def print_board(self):
        for row in self.board:
            print(" ".join(str(num) if num != 0 else '.' for num in row))

    def is_complete(self):
        for row in self.board:
            if 0 in row:
                return False
        return True

def solo_play():
    sudoku = Sudoku()
    print("Welcome to Solo Sudoku!")
    while not sudoku.is_complete():
        sudoku.print_board()
        try:
            row = int(input("Enter row (1-9): ")) - 1
            col = int(input("Enter column (1-9): ")) - 1
            num = int(input("Enter number (1-9): "))
            if sudoku.is_valid(row, col, num):
                sudoku.board[row][col] = num
            else:
                print("Invalid move! Try again.")
        except ValueError:
            print("Invalid input! Please enter numbers only.")
    print("Congratulations! You solved the puzzle!")
    sudoku.print_board()

def duo_play():
    sudoku = Sudoku()
    print("Welcome to Duo Sudoku!")
    player_turn = 1
    while not sudoku.is_complete():
        sudoku.print_board()
        print(f"Player {player_turn}'s turn:")
        try:
            row = int(input("Enter row (1-9): ")) - 1
            col = int(input("Enter column (1-9): ")) - 1
            num = int(input("Enter number (1-9): "))
            if sudoku.is_valid(row, col, num):
                sudoku.board[row][col] = num
                player_turn = 3 - player_turn  # Switch turns between 1 and 2
            else:
                print("Invalid move! Try again.")
        except ValueError:
            print("Invalid input! Please enter numbers only.")
    print(f"Congratulations! Player {3 - player_turn} solved the puzzle!")
    sudoku.print_board()

def main():
    print("Welcome to Sudoku!")
    mode = input("Choose mode: 1 for Solo, 2 for Duo: ")
    if mode == '1':
        solo_play()
    elif mode == '2':
        duo_play()
    else:
        print("Invalid choice. Exiting.")

if __name__ == "__main__":
    main()