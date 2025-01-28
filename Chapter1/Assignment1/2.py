import random

def is_valid_number(input_value):
    if input_value.isdigit() and 1<= int(input_value) <=100:
        return True
    else:
        return False

def guess_number_game():
    secret_number = random.randint(1,100)
    continue_game = True
    guessed_number = input("Guess a number between 1 and 100:")
    guess_count = 0
    while continue_game:
        if not is_valid_number(guessed_number):
            guessed_number = input("I wont count this one Please enter a number between 1 to 100")
            continue
        else:
            guess_count += 1
            guessed_number = int(guessed_number)

        if guessed_number < secret_number:
            guessed_number = input("Too low. Guess again")
        elif guessed_number > secret_number:
            guessed_number = input("Too High. Guess again")
        else:
            print("You guessed it in", guess_count ,"guesses!")
            continue_game = True


guess_number_game()