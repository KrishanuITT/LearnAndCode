import random
def roll_die(upper_limit):
    return random.randint(1, upper_limit)

def start_dice_game():
    sides_of_die = 6
    game_in_progress = True
    while game_in_progress:
        user_input = input("Ready to roll? Enter Q to Quit: ")
        if user_input.lower() != "q":
            rolled_value = roll_die(sides_of_die)
            print(f"You rolled a {rolled_value}")
        else:
            game_in_progress = False

start_dice_game()