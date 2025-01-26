using System;
using System.Numerics;

class MyClass
{
    static void Main(string[] args)
    {
        FloorOfMeanOfSubArray();
    }

    private static void FloorOfMeanOfSubArray()
    {
        int[] queryCountAndArraySize = Array.ConvertAll(Console.ReadLine().Split(' '), int.Parse);
        long[] array = Array.ConvertAll(Console.ReadLine().Split(' '), long.Parse);
        long[] sumArray = CalculatesumArray(array, queryCountAndArraySize[0]);

        for (int index = 0; index < queryCountAndArraySize[1]; index++)
        {
            int[] range = Array.ConvertAll(Console.ReadLine().Split(' '), int.Parse);
            long sum = sumArray[range[1]] - sumArray[range[0] - 1];
            int count = range[1] - range[0] + 1;
            Console.WriteLine((double)sum / count);
        }
    }

    private static long[] CalculatesumArray(long[] array, int size)
    {
        long[] sumArray = new long[size + 1];
        sumArray[0] = 0;

        for (int index = 1; index <= size; index++)
        {
            sumArray[index] = sumArray[index - 1] + array[index - 1];
        }

        return sumArray;
    }
}
