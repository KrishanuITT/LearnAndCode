def sum_of_powers_of_digits(number):
    digit_power_sum = 0
    digit_count = 0

    temp_number = number
    while temp_number > 0:
        digit_count += 1
        temp_number //= 10

    temp_number = number
    while temp_number > 0:
        digit = temp_number % 10
        digit_power_sum += digit ** digit_count
        temp_number //= 10

    return digit_power_sum

number = int(input("\nPlease Enter the Number to Check for Armstrong: "))

if number == sum_of_powers_of_digits(number):
    print("\n%d is an Armstrong Number.\n" % number)
else:
    print("\n%d is Not an Armstrong Number.\n" % number)
