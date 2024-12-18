def sum_of_digits(N):
    sum_digits = 0
    num_digits = 0

    temp_number = N
    while temp_number > 0:
        num_digits += 1
        temp_number //= 10

    temp_number = N
    while temp_number > 0:
        digit = temp_number % 10
        sum_digits += digit ** num_digits
        temp_number //= 10

    return sum_digits

N = int(input("\nPlease Enter the Number to Check for Armstrong: "))

if (N == sum_of_digits(N)):
    print("\n %d is Armstrong Number.\n" % N)
else:
    print("\n %d is Not a Armstrong Number.\n" % N)