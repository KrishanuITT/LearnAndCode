let arr:number[] = [-1,-3,-5,-5,-2,-4]
let size:number = arr.length;

let largest:number = -Infinity;
let secondLargest:number = -Infinity;
for(let index = 0;index<size;index++){
    if(largest<arr[index]){
        secondLargest = largest;
        largest = arr[index];
    }
    if(secondLargest<arr[index] && arr[index]<largest){
        secondLargest = arr[index]
    }
}

console.log(secondLargest);