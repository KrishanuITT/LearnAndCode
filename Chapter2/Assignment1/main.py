import random
MIN_SECRET_NUMBER = 1
MAX_SECRET_NUMBER = 100

def get_secret_number():
    return random.randint(MIN_SECRET_NUMBER, MAX_SECRET_NUMBER)

def is_valid_number(s):
    return s.isdigit() and MIN_SECRET_NUMBER <= int(s) <= MAX_SECRET_NUMBER   

def get_user_input():
    while True:
        try:
            user_input = input("Guess a number between 1 and 100: ")
            if not is_valid_number(user_input):
                raise ValueError("I won't count this one. Please enter a number between 1 and 100")
            return int(user_input)
        except ValueError as e:
            print(e)

def check_guess(guess, secret_number):
    if guess < secret_number:
        return "Too low. Guess again"
    elif guess > secret_number:
        return "Too high. Guess again"
    else:
        return "You guessed it!"

def play_game():
    secret_number = get_secret_number()
    guess_count = 0
    continue_game = False
    while not continue_game:
        try:
            user_guessed_number = get_user_input()
            guess_count += 1
            response = check_guess(user_guessed_number, secret_number)
            if response == "You guessed it!":
                print("You guessed it in", guess_count, "guesses!")
                continue_game = True
            else:
                print(response)
        except KeyboardInterrupt:
            print("\nGame interrupted by user.")
            break

def main():
    play_game()

if __name__ == "__main__":
    main()
