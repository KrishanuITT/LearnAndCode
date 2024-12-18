import random
def generate_random_number(upper_limit):
    random_number=random.randint(1, upper_limit)
    return random_number

def roll_dice():
    sides=6
    continue_rolling=True
    while continue_rolling:
        user_input=input("Ready to roll? Enter Q to Quit")
        if user_input.lower() !="q":
            rolled_number = generate_random_number(sides)
            print("You have rolled a",rolled_number)
        else:
            continue_rolling=False

roll_dice()